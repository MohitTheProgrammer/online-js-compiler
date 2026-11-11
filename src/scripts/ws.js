import { io } from "socket.io-client";

export const connectWS = () => {
  const serverUrl =
    import.meta.env.VITE_SOCKET_URL ||
    window.location.origin;

  return io(serverUrl);
};
