import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: "http://localhost:5173/" });
const rooms = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));
app.use((req, res, next) => {
  res.sendFile(
    path.join(__dirname, "dist", "index.html")
  );
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("joinRoom", ({ roomId, username }) => {
    //create a rooms map if not exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: [], code: "" });
    }

    // ✅ Store username with socketId
    rooms.get(roomId).users.push({
      socketId: socket.id,
      username,
    });

    //join the room with specific room id
    socket.join(roomId);

    console.log("from server: " + username);

    //send all users list of a room (only usernames)
    io.to(roomId).emit(
      "roomUsers",
      rooms.get(roomId).users.map((u) => u.username)
    );

    //emit event so user can have access to the code that already written
    socket.emit("roomJoined", {
      roomId,
      code: rooms.get(roomId).code,
      username,
    });
    //this will trigger on every key stroke of users
    socket.on("update-code", ({ roomId, text }) => {
      rooms.get(roomId).code = text;
      io.to(roomId).emit("update-code-from-server", { text });
    });

    //send output to all the users
    socket.on("send-output", ({ roomId, output, error }) => {
      io.to(roomId).emit("send-output-from-server", {
        output,
        error,
      });
    });

    socket.on("leave-room", ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      // find & remove
      room.users = room.users.filter((u) => u.socketId !== socket.id);

      // notify others
      socket.to(roomId).emit("userLeft", socket.id);

      // update user list
      io.to(roomId).emit(
        "roomUsers",
        room.users.map((u) => u.username)
      );

      socket.leave(roomId);
    });
  });
});

server.listen(4501, () => {
  console.log("server running at http://localhost:4501");
});
