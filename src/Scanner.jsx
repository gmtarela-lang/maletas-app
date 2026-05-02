import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(null);

  const startScanner = async () => {
    try {
      setError(null);

      await new Promise((r) => setTimeout(r, 500));

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (navigator.vibrate) navigator.vibrate(100);

          scanner.stop().then(() => {
            onScan(decodedText);
          });
        },
        () => {}
      );

      setStarted(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo abrir la cámara");
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
    }
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button onClick={() => { stopScanner(); onClose(); }} style={styles.closeBtn}>
          ✕ Cerrar
        </button>
      </div>

      {!started && !error && (
        <div style={styles.center}>
          <button onClick={startScanner} style={styles.startBtn}>
            📷 Iniciar cámara
          </button>
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      <div id="reader" style={styles.reader}></div>
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
  },
  topBar: {
    padding: "10px",
    textAlign: "right",
  },
  closeBtn: {
    fontSize: "18px",
    padding: "8px 12px",
  },
  center: {
    position: "absolute",
    top: "40%",
    width: "100%",
    textAlign: "center",
  },
  startBtn: {
    fontSize: "20px",
    padding: "15px 25px",
  },
  reader: {
    flex: 1,
    width: "100%",
  },
  error: {
    color: "white",
    padding: "20px",
  },
};