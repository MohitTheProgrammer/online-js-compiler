import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";
import Console from "../components/Console";
import { useState } from "react";
import "./styles/editorPage.css";

const EditorPage = () => {
  const [output, setOutput] = useState({
    logs: [],
    error: false,
  });

  const getConsoleOutput = (value) => {
    setOutput({
      logs: value.output,
      error: value.error,
    });
  };
  return (
    <div className="editorPage-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="editor-container">
        <Editor sendData={getConsoleOutput} />
        <Console data={output} />
      </div>
    </div>
  );
};

export default EditorPage;
