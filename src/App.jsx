import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;
