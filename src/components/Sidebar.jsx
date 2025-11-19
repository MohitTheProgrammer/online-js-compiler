import UserAvtar from "./UserAvtar";
import "./styles/sidebar.css";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
const Sidebar = () => {
  const { userList, roomId, socket, setUserList } = useApp();
  const navigate = useNavigate();

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room id copied!");
    } catch (err) {
      toast.error("Failed to copy room id");
    }
  };

  const leaveRoom = () => {
    const ws = socket.current;
    if (!ws) {
      return;
    }

    ws.emit("leave-room", {
      roomId,
    });

    ws.on("userLeft", (username) => {
      toast.error(`${username} left the room`);
    });

    ws.on("roomUsers", (users) => {
      setUserList(users);
    });

    navigate(`/`);
  };

  return (
    <div className="sidebar-div">
      <div>
        <h2 className="sidebar-heading">Connected Users</h2>
        <div className="user-list">
          {userList.length
            ? userList.map((name, ind) => <UserAvtar name={name} key={ind} />)
            : "no user connected"}
        </div>
      </div>
      <div className="btn-container">
        <button className="btn" onClick={copyRoomId}>
          Copy Room Id
        </button>
        <button className="btn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
