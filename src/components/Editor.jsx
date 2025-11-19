import "./styles/editor.css";
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import { default as CodeEditor } from "@monaco-editor/react";

const Editor = ({ sendData }) => {
  const [text, setText] = useState("// Type some JS!!");
  const { socket, roomId, roomCode } = useApp();
  const codeEditorRef = useRef();

  const ws = socket.current;

  useEffect(() => {
    if (roomCode) setText(roomCode);
  }, [roomCode]);

  const handleChange = (code) => {
    setText(code);
    if (!ws) {
      toast.error("Socket not initialized!");
      return;
    }
    ws.emit("update-code", {
      roomId,
      text: code,
    });
  };

  const onEditorMount = (editor) => {
    codeEditorRef.current = editor;
    editor.focus();
  };

  useEffect(() => {
    if (!ws) return;

    const handleCodeUpdate = (data) => {
      setText(data.text);
    };

    const handleOutputUpdate = (output) => {
      sendData(output);
    };

    ws.on("update-code-from-server", handleCodeUpdate);
    ws.on("send-output-from-server", handleOutputUpdate);

    return () => {
      ws.off("update-code-from-server", handleCodeUpdate);
      ws.off("send-output-from-server", handleOutputUpdate);
    };
  }, [ws]);

  const runCode = () => {
    const logs = [];
    let isError = false;
    const original = console.log;

    console.log = (...args) => {
      const formatted = args.map((arg) => {
        if (Array.isArray(arg)) return JSON.stringify(arg);
        if (typeof arg === "object") return JSON.stringify(arg, null, 2);
        return String(arg);
      });

      logs.push(formatted.join(" "));
    };

    try {
      eval(text);
    } catch (err) {
      logs.push(String(err));
      isError = true
    }
    console.log = original;
    ws.emit("send-output", {
      roomId,
      output: logs,
      error: isError,
    });
  };

  return (
    <div className="editor-wrapper">
      <button className="run-btn" onClick={runCode}>
        ▶ Run
      </button>
      {/* <CodeEditor
        value={text}
        onValueChange={(code) => handleChange(code)}
        highlight={(code) => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          height: "100%",
          width: "100%",
          background: "#c5daf1",
          border_radius: "6px",
        }}
      /> */}
      <CodeEditor
        height={"100%"}
        width={"100%"}
        theme="dracula"
        language="javascript"
        onMount={onEditorMount}
        value={text}
        onChange={(code) => handleChange(code)}
        className="textarea"
      />
    </div>
  );
};

export default Editor;
