"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let socketInstance = null;

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketInstance) {
      const socketUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
      socketInstance = io(socketUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    socketRef.current = socketInstance;

    return () => {
      // Keep socket open across soft route changes, clean up on root unmount
    };
  }, []);

  return socketInstance;
}
