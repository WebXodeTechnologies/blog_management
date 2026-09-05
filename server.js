import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Expose global io instance for API routes
  global.io = io;

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Join user-specific notification room
    socket.on("join_user_room", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    // Join live ticket room
    socket.on("join_room", (roomName) => {
      if (roomName) {
        socket.join(roomName);
        console.log(`Socket joined room: ${roomName}`);
      }
    });

    socket.on("leave_room", (roomName) => {
      if (roomName) {
        socket.leave(roomName);
      }
    });

    // Handle typing indicator properly inside the connection scope
    socket.on("typing", ({ ticketId, userId }) => {
      const roomName = `ticket_${ticketId}`;
      socket.to(roomName).emit("display_typing", { ticketId, userId });
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port} with Socket.io`);
  });
});
