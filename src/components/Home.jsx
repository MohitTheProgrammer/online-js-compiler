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

  useEffect(() => {
    const ws = socket.current;
    if (!ws) return;

    const handleRoomUsers = (users) => {
      setUserList(users);
    };

    const handleRoomJoined = (data) => {
      if (data.code) {
        setRoomCode(data.code);
        console.log("handleRoomJoined")
        navigate(`/editor/${data.roomId}`);
      }
    };

    ws.on("roomUsers", handleRoomUsers);
    ws.on("roomJoined", handleRoomJoined);

    return () => {
      ws.off("roomUsers", handleRoomUsers);
      ws.off("roomJoined", handleRoomJoined);
    };
  }, [socket]);

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

    ws.emit("joinRoom", {
      username,
      roomId: localRoomId,
    });
  };

  return (
    <>
      <Navbar />

      <div className="home-container">
        <form>
          <div className="felieds">
            <label className="inp-label">Room ID</label>
            <input
              type="text"
              className="input"
              value={localRoomId}
              onChange={(e) => setLocalRoomId(e.target.value)}
            />
          </div>

          <div className="felieds">
            <label className="inp-label">Username</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="btn-container">
            <button className="btn" onClick={joinRoom}>
              Join Room
            </button>
            <button className="btn" onClick={createRoomId}>
              New Room ID
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;
