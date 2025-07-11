import { Server as IOServer } from "socket.io";
import http from "http";
import { CustomSocket } from "../types/socket";

export let io: IOServer;

const onlineUsers = new Map<string, { socketId: string, userType: 'client' | 'vendor' }[]>();

export const initSocketIO = (httpServer: http.Server) => {
  io = new IOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
      methods: ["GET", "POST"],
      credentials: true
    }
  });

 io.use(async (socket, next) => {
    try {
      const { userId, userType } = socket.handshake.auth;
      
      if (!userId || !userType || !['client', 'vendor'].includes(userType)) {
        return next(new Error('Invalid authentication data'));
      }

       (socket as CustomSocket).userId = userId;
       (socket as CustomSocket).userType = userType;

      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

 io.on("connection", (socket) => {
    const customSocket = socket as CustomSocket;
    console.log("User connected:", customSocket.id, "for user:", customSocket.userId);

  const existingSockets = onlineUsers.get(customSocket.userId);
  if (existingSockets && existingSockets.length > 0) {
    existingSockets.forEach(({ socketId }) => {
      const existingSocket = io.sockets.sockets.get(socketId);
      if (existingSocket) {
        console.log("Disconnecting old socket:", socketId);
        existingSocket.disconnect();
      }
    });
  }

  onlineUsers.set(customSocket.userId, [
    { socketId: customSocket.id, userType: customSocket.userType },
  ]);
  console.log("Current online users:", onlineUsers);

  socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      const userSockets = onlineUsers.get(customSocket.userId);
      if (userSockets) {
        const filtered = userSockets.filter(s => s.socketId !== customSocket.id);
        if (filtered.length === 0) {
          onlineUsers.delete(customSocket.userId);
        } else {
          onlineUsers.set(customSocket.userId, filtered);
        }
      }
  });

    // Join Room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Send Message
    socket.on("sendMessage", (data) => {
      // Save to DB here if needed
      io.to(data.roomId).emit("receiveMessage", data);
    });

    // Typing
    socket.on("typing", (roomId, user) => {
      socket.to(roomId).emit("typing", user);
    });

    // Message Read
    socket.on("messageRead", ({ roomId, user }) => {
      socket.to(roomId).emit("messageRead", { roomId, user });
    });

  });

};

