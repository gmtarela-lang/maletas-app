import { useState } from "react";
import Scanner from "./Scanner";

function App() {
  const [scanning, setScanning] = useState(false);
  const [iata, setIata] = useState("");
  const [qrMaleta, setQrMaleta] = useState("");
  const [resultado, setResultado] = useState("");

  const handleScan = (code) => {
    console.log("Código escaneado:", code);

    if (code.startsWith("QR-")) {
      console.log("➡️ Maleta detectada");

      setQrMaleta(code);
      setResultado("Maleta: " + code);
    } else {
      console.log("➡️ IATA detectado");

      setIata(code);
      setResultado("IATA: " + code);
    }

    setScanning(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Operador Logístico</h1>

      {/* INPUT IATA */}
      <div>
        <label>IATA (cliente)</label>
        <br />
        <input
          value={iata}
          onChange={(e) => setIata(e.target.value)}
          placeholder="Introduce o escanea IATA"
        />
      </div>

      <br />

      {/* INPUT QR */}
      <div>
        <label>QR Maleta (interno)</label>
        <br />
        <input
          value={qrMaleta}
          onChange={(e) => setQrMaleta(e.target.value)}
          placeholder="Escanea QR de maleta"
        />
      </div>

      <br />

      {/* BOTÓN SCANNER */}
      <button onClick={() => setScanning(true)}>
        📷 Escanear QR
      </button>

      {/* BOTÓN DEBUG (IMPORTANTE PARA TI AHORA) */}
      <button
        onClick={() => {
          console.log("Scanner ON (DEBUG)");
          setScanning(true);
        }}
        style={{ marginLeft: "10px" }}
      >
        TEST SCANNER
      </button>

      <p>
        <strong>Resultado:</strong> {resultado}
      </p>

      {/* SCANNER */}
      {scanning && (
        <Scanner
          onScan={handleScan}
          onClose={() => setScanning(false)}
        />
      )}
    </div>
  );
}

export default App;