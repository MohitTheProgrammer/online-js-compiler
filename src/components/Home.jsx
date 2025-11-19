import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { useApp } from "../context/AppContext";
import Navbar from "./Navbar";
import "./styles/home.css";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const { setUserList, socket, useRoomId, setRoomCode } = useApp();

  const navigate = useNavigate();

  const createRoomId = (event) => {
    event.preventDefault();
    const id = uuidv4();
    setRoomId(id);
  };

  const getData = () => {
    if (!username.trim() && !roomId.trim()) {
      toast.error("Both fields required!");
      return;
    } else if (!username.trim()) {
      toast.error("Fill username!");
      return;
    } else if (!roomId.trim()) {
      toast.error("Fill room id!");
      return;
    } else {
    }
    useRoomId(roomId);
    return { roomId, username };
  };

  const joinRoom = (event) => {
    event.preventDefault();
    const userData = getData();
    if (!userData) return;

    const ws = socket.current;

    if (!ws) {
      toast.error("Socket not initialized!");
      return;
    }

    ws.on("roomUsers", (users) => {
      setUserList(users);
    });

    ws.on("roomJoined", (data) => {
      if (data.code) {
        setRoomCode(data.code);
      }
    });

    ws.emit("joinRoom", userData);
    navigate(`/editor/${userData.roomId}`);
  };
  return (
    <>
      <Navbar />
      <div className="home-container">
        <form action="">
          <div>
            <div className="felieds">
              <label htmlFor="" className="inp-label">
                RoomId
              </label>
              <input
                type="text"
                className="input"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
            <div className="felieds">
              <label htmlFor="" className="inp-label">
                Username
              </label>
              <input
                type="text"
                className="input"
                id="username"
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
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;
