export default function Scanner({ onScan, onClose }) {
  useEffect(() => {
    const scannerId = "reader";
    const html5QrCode = new Html5Qrcode(scannerId);

    const config = {
      fps: 12,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    const startCamera = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          console.error("No cámaras disponibles");
          return;
        }

        // 🔥 forzar cámara trasera (última suele ser la trasera en móvil)
        const backCamera =
          cameras.find(cam => cam.label.toLowerCase().includes("back")) ||
          cameras[cameras.length - 1];

        await html5QrCode.start(
          backCamera.id,
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

    startCamera();

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
    flexDirection: "column"
  },
  topBar: {
    padding: "10px",
    backgroundColor: "black",
    color: "white",
    textAlign: "right"
  },
  closeBtn: {
    fontSize: "18px",
    background: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px"
  },
  reader: {
    flex: 1,
    width: "100%"
  }
};