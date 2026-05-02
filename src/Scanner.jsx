import { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";

export default function Scanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setRunning(true);
      scanLoop();
    } catch (err) {
      console.error(err);
      setError("No se pudo abrir la cámara");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setRunning(false);
  };

  const scanLoop = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const tick = () => {
      if (!running) return;

      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          if (navigator.vibrate) navigator.vibrate(100);

          stopCamera();
          onScan(code.data);
          return;
        }
      }

      requestAnimationFrame(tick);
    };

    tick();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button onClick={handleClose} style={styles.closeBtn}>
          ✕
        </button>
      </div>

      {!running && (
        <button onClick={startCamera} style={styles.btn}>
          📷 Abrir cámara
        </button>
      )}

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
    backgroundColor: "black",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  topBar: {
    width: "100%",
    textAlign: "right",
    padding: 10,
  },
  closeBtn: {
    fontSize: 20,
    padding: 10,
  },
  btn: {
    marginTop: 20,
    fontSize: 18,
    padding: "10px 20px",
  },
  video: {
    width: "100%",
    flex: 1,
  },
  error: {
    color: "red",
    padding: 10,
  },
};