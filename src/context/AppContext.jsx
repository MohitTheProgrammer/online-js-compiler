import { createContext, useContext, useEffect, useRef, useState } from "react";
import { connectWS } from "../scripts/ws";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const socketRef = useRef(null);

  useEffect(() => {
    const socket = connectWS();
    socketRef.current = socket;

    socket.on("roomUsers", (users) => {
      setUserList(users);
    });

    socket.on("userLeft", (username) => {});

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        userList,
        setUserList,
        socket: socketRef,
        roomId,
        setRoomId,
        roomCode,
        setRoomCode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
