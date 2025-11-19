import { createContext, useContext, useState, useRef, useEffect } from "react";
import { connectWS } from "../scripts/ws";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [roomId, useRoomId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = connectWS();
  }, []);

  return (
    <AppContext.Provider
      value={{
        userList,
        setUserList,
        socket: socketRef,
        roomId,
        useRoomId,
        roomCode,
        setRoomCode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
