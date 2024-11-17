// LiquidParser.js
import React, { useState } from "react";
import { Liquid } from "liquidjs";
import CodeEditorMonaco from "./CodeEditorMonaco";

function LiquidParser() {
  const [liquidInput, setLiquidInput] = useState("");
  const [cssInput, setCssInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");

  const engine = new Liquid();

  const parseLiquid = async (input) => {
    try {
      const html = await engine.parseAndRender(input);
      setHtmlOutput(html);
    } catch (err) {
      setHtmlOutput(`<pre style="color: red;">Error: ${err.message}</pre>`);
    }
  };

  const handleLiquidChange = (input) => {
    setLiquidInput(input);
    parseLiquid(input);
  };

  const handleCSSChange = (input) => {
    setCssInput(input);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Liquid Editor */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <h2>Liquid</h2>
        <div style={{ flexGrow: 1 }}>
          <CodeEditorMonaco
            value={liquidInput}
            onChange={handleLiquidChange}
            language="liquid"
          />
        </div>
      </div>

      {/* CSS Editor */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <h2>CSS</h2>
        <div style={{ flexGrow: 1 }}>
          <CodeEditorMonaco
            value={cssInput}
            onChange={handleCSSChange}
            language="css"
          />
        </div>
      </div>

      {/* Vorschau */}
      <div
        style={{
          flex: 1,
          padding: "10px",
          borderLeft: "1px solid #ccc",
          overflow: "auto",
        }}
      >
        <h2>Vorschau</h2>
        <div
          dangerouslySetInnerHTML={{ __html: htmlOutput }}
          style={{ minHeight: "90%", overflow: "auto" }}
        />
        {/* Dynamisches CSS */}
        <style>{cssInput}</style>
      </div>
    </div>
  );
}

export default LiquidParser;
