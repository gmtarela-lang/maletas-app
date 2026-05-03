import { useState } from "react";
import Scanner from "./Scanner";
import "./App.css";

const SHEET_API =
  "https://script.google.com/macros/s/AKfycbyQdIwNirhrRYXR1VN_K0Zy2LtWHHxNJTaMbNgWKEQzT3IIBxTm8NX82uh4lXNPuo2K/exec";

export default function App() {
  const [iata, setIata] = useState("");
  const [qr, setQr] = useState("");
  const [scannerType, setScannerType] = useState(null);
  const [status, setStatus] = useState("");

  const sendToSheet = async (data) => {
    try {
      await fetch(SHEET_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Error enviando a Sheet", err);
    }
  };

  const handleScan = (value) => {
    if (scannerType === "IATA") {
      setIata(value);
    } else {
      setQr(value);
    }
    setScannerType(null);
  };

  const handleLink = async () => {
    if (!iata || !qr) {
      setStatus("❌ Falta IATA o QR");
      return;
    }

    let lat = "";
    let lng = "";

    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch (e) {
      console.log("GPS no disponible");
    }

    const payload = {
      iata,
      qr,
      estado: "Vinculado",
      lat,
      lng,
    };

    await sendToSheet(payload);

    setStatus(`✔ Enviado a Sheets\nIATA: ${iata}\nQR: ${qr}`);
  };

  return (
    <div className="app">
      <h2>Operador Logístico</h2>

      <div className="card">
        <h3>IATA (cliente)</h3>
        <input value={iata} readOnly placeholder="Escanear IATA" />
        <button onClick={() => setScannerType("IATA")}>
          📷 Escanear IATA
        </button>
      </div>

      <div className="card">
        <h3>QR Maleta</h3>
        <input value={qr} readOnly placeholder="Escanear QR" />
        <button onClick={() => setScannerType("QR")}>
          📷 Escanear QR
        </button>
      </div>

      <button className="link-btn" onClick={handleLink}>
        🔗 Vincular maleta
      </button>

      {status && <pre className="status">{status}</pre>}

      {scannerType && (
        <Scanner
          onScan={handleScan}
          onClose={() => setScannerType(null)}
        />
      )}
    </div>
  );
}