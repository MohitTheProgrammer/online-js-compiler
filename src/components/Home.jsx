import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { useApp } from "../context/AppContext";
import Navbar from "./Navbar";
import "./styles/home.css";

const Home = () => {
  const [localRoomId, setLocalRoomId] = useState("");
  const [username, setUsername] = useState("");

  const { setUserList, socket, setRoomId, setRoomCode } = useApp();
  const navigate = useNavigate();

  const createRoomId = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setLocalRoomId(id);
    toast.success("New Room ID created!");
  };

  const joinRoom = (e) => {
    e.preventDefault();

    if (!username.trim() && !localRoomId.trim()) {
      return toast.error("Both fields required!");
    }
    if (!username.trim()) {
      return toast.error("Fill username!");
    }
    if (!localRoomId.trim()) {
      return toast.error("Fill room id!");
    }
    console.log(localRoomId);
    setRoomId(localRoomId); // Save in global context

    const ws = socket.current;

    if (!ws) {
      toast.error("Socket not initialized");
      return;
    }

    ws.on("roomUsers", (users) => {
      setUserList(users);
    });
    ws.on("roomJoined", (data) => {
      if (data.code) setRoomCode(data.code);
      navigate(`/editor/${data.roomId}`);
    });

    ws.emit("joinRoom", {
      username,
      roomId: localRoomId,
    });
  };

  return (
    <>
      <Navbar />

      <main className="home-container">
        <section className="home-copy">
          <div className="eyebrow"><span className="status-dot" /> REAL-TIME COLLABORATION</div>
          <h1>Build something<br /><span>together.</span></h1>
          <p>A shared JavaScript workspace for ideas that are better written together. Create a room, invite your team, and start coding.</p>
          <div className="home-note"><span className="note-mark">✳</span><span>One room. One editor.<br /><strong>Everyone in sync.</strong></span></div>
        </section>
        <form className="room-form">
          <div className="form-kicker">GET STARTED</div>
          <h2>Join your workspace</h2>
          <p className="form-intro">Enter a room ID or create a new one to get going.</p>
          <div className="felieds">
            <label className="inp-label">Room ID</label>
            <input
              aria-label="Room ID"
              type="text"
              className="input"
              placeholder="Paste a room ID"
              value={localRoomId}
              onChange={(e) => setLocalRoomId(e.target.value)}
            />
          </div>

          <div className="felieds">
            <label className="inp-label">Username</label>
            <input
              aria-label="Username"
              type="text"
              className="input"
              placeholder="How should we call you?"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="btn-container">
            <button className="btn join-btn" onClick={joinRoom}>
              Join Room
            </button>
            <button className="btn create-btn" onClick={createRoomId}>
              + Create room
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default Home;
