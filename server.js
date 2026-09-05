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

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Join user-specific notification room
    socket.on("join_user_room", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User joined room: user_${userId}`);
      }
    });

    // Join live ticket chat room
    socket.on("join_ticket", (ticketId) => {
      if (ticketId) {
        socket.join(`ticket_${ticketId}`);
        console.log(`Socket joined ticket room: ticket_${ticketId}`);
      }
    });

    // Handle real-time ticket messaging
    socket.on("send_ticket_message", async (data) => {
      const { ticketId, senderId, message } = data;
      // Broadcast message to everyone in the ticket room including sender
      io.to(`ticket_${ticketId}`).emit("receive_ticket_message", {
        senderId,
        message,
        createdAt: new Date(),
      });
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
