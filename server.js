const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

// In-memory store of rooms -> array of drawing actions
// (so new users joining a room see what's already drawn)
const rooms = {};

io.on("connection", (socket) => {
  let currentRoom = null;

  socket.on("join-room", (roomId) => {
    currentRoom = roomId;
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];
    // send full drawing history to the new user
    socket.emit("load-history", rooms[roomId]);

    const clientsInRoom = io.sockets.adapter.rooms.get(roomId)?.size || 1;
    io.to(roomId).emit("user-count", clientsInRoom);
  });

  socket.on("draw", (data) => {
    if (!currentRoom) return;
    rooms[currentRoom].push(data);
    socket.to(currentRoom).emit("draw", data);
  });

  socket.on("clear", () => {
    if (!currentRoom) return;
    rooms[currentRoom] = [];
    io.to(currentRoom).emit("clear");
  });

  socket.on("cursor-move", (pos) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit("cursor-move", { id: socket.id, ...pos });
  });

  socket.on("disconnect", () => {
    if (currentRoom) {
      const clientsInRoom = io.sockets.adapter.rooms.get(currentRoom)?.size || 0;
      io.to(currentRoom).emit("user-count", clientsInRoom);
      socket.to(currentRoom).emit("cursor-remove", socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => console.log(`Whiteboard running on port ${PORT}`));
