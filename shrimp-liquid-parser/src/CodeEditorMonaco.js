// CodeEditorMonaco.js
import React from "react";
import MonacoEditor from "@monaco-editor/react";

function CodeEditorMonaco({ value, onChange, language }) {
  return (
    <MonacoEditor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={onChange}
      options={{
        tabSize: 2,
        insertSpaces: true,
        automaticLayout: true,
        minimap: { enabled: false },
      }}
    />
  );
}

export default CodeEditorMonaco;
