"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection pointing to your custom server host/port
    // In production, this automatically falls back to window.location.origin if hosted on a single server
    const socketIo = io({
      path: "/socket.io",
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketIo.on("connect", () => {
      setIsConnected(true);
      console.log(`⚡ Connected to WebSocket server: ${socketIo.id}`);

      // Fetch current logged-in user to bind real-time room notifications
      fetch("/api/v1/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user?._id) {
            socketIo.emit("join_user_room", data.user._id);
          }
        })
        .catch(() => {});
    });

    socketIo.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log(`❌ Disconnected from WebSocket server: ${reason}`);
    });

    // Global real-time notification listener
    socketIo.on("receive_notification", (notif) => {
      toast.success(notif.title || "New notification received!", {
        icon: "🔔",
      });
    });

    setSocket(socketIo);

    // Clean up socket connection on unmount to prevent memory leaks
    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
