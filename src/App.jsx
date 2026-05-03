console.log("🔥 APP MODIFICADO");
import { useState } from "react";
import Scanner from "./Scanner";

export default function App() {
  const [scannerType, setScannerType] = useState(null);

  const [iata, setIata] = useState("");
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState("");

  const handleScan = (data) => {
    if (scannerType === "IATA") {
      setIata(data);
    }

    if (scannerType === "QR") {
      setQr(data);
    }

    setScannerType(null);
  };

  const handleLink = () => {
    if (!iata || !qr) {
      setStatus("❌ Falta IATA o QR");
      return;
    }

    setStatus(`✔ Maleta vinculada\n📍 IATA: ${iata}\n📦 QR: ${qr}`);
  };

  return (
    <div style={styles.container}>
      <h2>Operador Logístico</h2>

      {/* IATA */}
      <div style={styles.box}>
        <h3>IATA (cliente)</h3>
        <input
          value={iata}
          onChange={(e) => setIata(e.target.value)}
          placeholder="Introduce o escanea IATA"
          style={styles.input}
        />
        <button onClick={() => setScannerType("IATA")}>
          📷 Escanear IATA
        </button>
      </div>

      {/* QR */}
      <div style={styles.box}>
        <h3>QR Maleta (interno)</h3>
        <input
          value={qr}
          onChange={(e) => setQr(e.target.value)}
          placeholder="Escanea QR de maleta"
          style={styles.input}
        />
        <button onClick={() => setScannerType("QR")}>
          📷 Escanear QR
        </button>
      </div>

      {/* LINK */}
      <div style={styles.box}>
        <button onClick={handleLink} style={styles.linkBtn}>
          🔗 Vincular maleta
        </button>

        <pre style={styles.status}>{status}</pre>
      </div>

      {/* SCANNER MODAL */}
      {scannerType && (
        <Scanner
          onScan={handleScan}
          onClose={() => setScannerType(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    fontFamily: "system-ui",
  },

  box: {
    border: "1px solid #ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },

  linkBtn: {
    width: "100%",
    padding: 15,
    fontSize: 16,
    backgroundColor: "black",
    color: "white",
  },

  status: {
    marginTop: 10,
    whiteSpace: "pre-line",
  },
};