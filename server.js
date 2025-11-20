import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
const rooms = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId, username }) => {
    //create a rooms map if not exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: [], code: "" });
    }

    //Store username with socketId
    rooms.get(roomId).users.push({
      socketId: socket.id,
      username,
    });

    //join the room with specific room id
    socket.join(roomId);

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
      cleanupUser(socket.id, roomId);
    });
    socket.on("disconnect", () => {
      cleanupUser(socket.id);
    });
  });
});

function cleanupUser(socketId, specificRoomId = null) {
  for (const [roomId, room] of rooms.entries()) {
    if (specificRoomId && roomId !== specificRoomId) continue;

    const userIndex = room.users.findIndex((u) => u.socketId === socketId);

    if (userIndex !== -1) {
      const username = room.users[userIndex].username;

      // Remove the user
      room.users.splice(userIndex, 1);

      // Notify others
      io.to(roomId).emit("userLeft", username);

      // Send updated user list
      io.to(roomId).emit(
        "roomUsers",
        room.users.map((u) => u.username)
      );

      // Delete room if empty
      if (room.users.length === 0) {
        rooms.delete(roomId);
      }

      break;
    }
  }
}

server.listen(4501, () => {
  console.log("server running at http://localhost:4501");
});
