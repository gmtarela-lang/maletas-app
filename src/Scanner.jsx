import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner({ onScan, onClose }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    let scanner;

    const startCamera = async () => {
      try {
        // 🔥 esperar render real del DOM (MUY IMPORTANTE EN MÓVIL)
        await new Promise((r) => setTimeout(r, 500));

        scanner = new Html5Qrcode("reader");

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        };

        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (navigator.vibrate) navigator.vibrate(100);

            scanner.stop().then(() => {
              onScan(decodedText);
            });
          },
          () => {}
        );
      } catch (err) {
        console.error("Camera error:", err);
        setError("No se pudo iniciar la cámara");
      }
    };

    startCamera();

    return () => {
      if (scanner) {
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button onClick={onClose} style={styles.closeBtn}>
          ✕ Cerrar
        </button>
      </div>

      {error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div id="reader" style={styles.reader}></div>
      )}
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
  reader: {
    flex: 1,
    width: "100%",
  },
  error: {
    color: "white",
    padding: "20px",
  },
};