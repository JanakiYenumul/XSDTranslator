import React, { useState } from "react";
import "./Translator.css";

function Translator() {
  const [inputXml, setInputXml] = useState("");
  const [inputXsd, setInputXsd] = useState("");
  const [oasSpec, setOasSpec] = useState("");
  const [outputXml, setOutputXml] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransformWithXsd = async () => {
    setLoading(true);
    try {
      //using github codespaces generated URL
      const response = await fetch("https://organic-giggle-vpv65ggv6v5fx7jq-5000.app.github.dev/transform-with-xsd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputXml, inputXsd }),
      });

      const data = await response.json();
      setOutputXml(data.transformedXml || "Error occurred");
    } catch (err) {
      setOutputXml("Error connecting to backend");
    }
    setLoading(false);
  };

  const handleTransformWithOas = async () => {
    setLoading(true);
    try {
      //using github codespace genrated URL 
      const response = await fetch("https://organic-giggle-vpv65ggv6v5fx7jq-5000.app.github.dev/transform-using-oas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputXml, oasSpec }),
      });

      const data = await response.json();
      setOutputXml(data.transformedXml || "Error occurred");
    } catch (err) {
      setOutputXml("Error connecting to backend");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="title">XSD Translator</h1>
      <div className="container">
        <div className="grid">
          <div className="box">
            <h3>Input XML</h3>
            <textarea
              value={inputXml}
              onChange={(e) => setInputXml(e.target.value)}
              placeholder="Paste XML here..."
            />
          </div>

          <div className="box">
            <h3>Input XSD</h3>
            <textarea
              value={inputXsd}
              onChange={(e) => setInputXsd(e.target.value)}
              placeholder="Paste XSD here..."
            />
          </div>

          <div className="box">
            <h3>Input OAS Spec</h3>
            <textarea
              value={oasSpec}
              onChange={(e) => setOasSpec(e.target.value)}
              placeholder="Paste OAS YAML here..."
            />
          </div>

          <div className="box">
            <h3>Output XML</h3>
            <textarea value={outputXml} readOnly />
          </div>
        </div>

        <div className="buttons">
          <button onClick={handleTransformWithXsd} disabled={loading}>
            Transform with XSD
          </button>

          <button onClick={handleTransformWithOas} disabled={loading}>
            Transform with OAS
          </button>
        </div>

        {loading && <p className="loading">Transforming...</p>}
      </div>
    </div>
  );
}

export default Translator;
