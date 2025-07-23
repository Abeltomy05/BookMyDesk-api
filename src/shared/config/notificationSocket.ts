import { Server as IOServer, Socket } from "socket.io";
import http from 'http';
import { config } from "../config";
import { injectable } from "tsyringe";

@injectable()
export class NotificationSocketHandler{
     private io: IOServer;
     private connectedUsers = new Map<string, string>(); 

     constructor(httpServer: http.Server) {
        this.io = new IOServer(httpServer, {
        path: "/notification-socket",
        cors: {
            origin: config.CORS_ORIGIN,
            credentials: true,
        },
        });
    }

   public initialize() {
    this.io.on("connection", (socket) => {
      const { userId } = socket.handshake.auth;
      if (!userId) return socket.disconnect();

      this.connectedUsers.set(userId, socket.id);
      console.log(`🔔 ${userId} connected for notifications`);
      socket.on("disconnect", () => {
        this.connectedUsers.delete(userId);
        console.log(`🔔 ${userId} disconnected for notifications`);
      });
    });
  }

   public emitNotification(userId: string) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit("newNotification");
    }
  }

}