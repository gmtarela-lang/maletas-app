import { useRef, useState } from "react";

export default function Scanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);

  const startCamera = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // 🔥 SIMULACIÓN QR (para validar cámara primero)
      // luego metemos decoder real
      console.log("Cámara iniciada OK");
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

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button onClick={handleClose} style={styles.closeBtn}>
          ✕ Cerrar
        </button>
      </div>

      {!error && (
        <button onClick={startCamera} style={styles.startBtn}>
          📷 Abrir cámara
        </button>
      )}

      {error && <div style={styles.error}>{error}</div>}

      <video
        ref={videoRef}
        style={styles.video}
        playsInline
        muted
      />
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
    padding: "10px",
    textAlign: "right",
  },
  closeBtn: {
    fontSize: "18px",
    padding: "8px 12px",
  },
  startBtn: {
    marginTop: "20px",
    fontSize: "18px",
    padding: "12px 20px",
  },
  video: {
    width: "100%",
    flex: 1,
  },
  error: {
    color: "white",
    padding: "20px",
  },
};