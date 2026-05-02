import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner({ onScan, onClose }) {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" }, // 🔥 clave para móvil
          config,
          (decodedText) => {
            console.log("QR detectado:", decodedText);

            if (navigator.vibrate) navigator.vibrate(100);

            html5QrCode.stop().then(() => {
              onScan(decodedText);
            });
          },
          () => {}
        );
      } catch (err) {
        console.error("Error cámara:", err);
      }
    };

    startScanner();

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button onClick={onClose} style={styles.closeBtn}>
          ✕ Cerrar
        </button>
      </div>

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
  reader: {
    flex: 1,
    width: "100%",
  },
};