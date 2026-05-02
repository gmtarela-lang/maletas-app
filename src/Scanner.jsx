import { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";

export default function Scanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);

  const beep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.value = 800;
      gain.gain.value = 0.1;

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      scan();
    } catch (err) {
      console.error(err);
      setError("No se pudo abrir la cámara");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  const scan = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      if (!videoRef.current) return;

      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0);

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          beep();
          stopCamera();
          onScan(code.data);
          return;
        }
      }

      requestAnimationFrame(loop);
    };

    loop();
  };

  // 🔥 AUTO-START (WHATSAPP STYLE)
  useEffect(() => {
    startCamera();

    return () => stopCamera();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button onClick={() => { stopCamera(); onClose(); }}>
          ✕
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <video ref={videoRef} style={styles.video} playsInline muted />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    inset: 0,
    background: "black",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    textAlign: "right",
    padding: 10,
  },
  video: {
    flex: 1,
    width: "100%",
  },
  error: {
    color: "red",
    padding: 10,
  },
};