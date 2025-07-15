import { Server as IOServer, Socket } from "socket.io";
import { CustomSocket } from "../types/socket";
import { IChatUseCase } from "../../entities/usecaseInterfaces/chat/chat-usecase.interface";
import { SaveMessageDTO } from "../dtos/chat.dto";
import http from 'http';

export class ChatSocketHandler {
  private io: IOServer;
  private onlineUsers = new Map<string, { socketId: string, userType: 'client' | 'building' }>();

  constructor(httpServer: http.Server, private _chatUseCase: IChatUseCase) {
    this.io = new IOServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
      },
    });
  }

  public initialize() {
    this.io.use(this.authSocketMiddleware);

    this.io.on("connection", (socket) => this.handleConnection(socket as CustomSocket));
  }

  private authSocketMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const { userId, userType } = socket.handshake.auth;
      if (!userId || !userType || !['client', 'building'].includes(userType)) {
        return next(new Error("Invalid authentication data"));
      }

      (socket as CustomSocket).userId = userId;
      (socket as CustomSocket).userType = userType;

      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  };

  private handleConnection(socket: CustomSocket) {
    console.log("User connected:", socket.id, "for user:", socket.userId);

    const existingSocketInfo  = this.onlineUsers.get(socket.userId);
    if (existingSocketInfo ) {
        const existingSocket = this.io.sockets.sockets.get(existingSocketInfo.socketId);
        if (existingSocket) existingSocket.disconnect();
    }

    this.onlineUsers.set(socket.userId, { socketId: socket.id, userType: socket.userType });
    this.io.emit("userOnline", { userId: socket.userId });
    socket.emit("onlineUsers", Array.from(this.onlineUsers.keys()));
    // console.log("Current online users:", this.onlineUsers);

    socket.on("joinRoom", (sessionId: string) => {
      socket.join(sessionId);
      console.log(`Socket ${socket.id} joined room ${sessionId}`);
      console.log("Rooms now:", socket.rooms);
    });

    socket.on("disconnect", () => this.handleDisconnect(socket));

    socket.on("sendMessage", (data: SaveMessageDTO) => this.handleSendMessage(socket, data));

    socket.on("typing", ({ sessionId }) => {
      console.log("Typing event from:", socket.id, "to room:", sessionId);
      socket.to(sessionId).emit("typing", { sessionId });
    });

    socket.on("stopTyping", ({sessionId}) => {
      socket.to(sessionId).emit("stopTyping", { sessionId });
    });

    socket.on("deleteMessage", (data: {messageId: string, sessionId: string}) => this.handleDeleteMessage(socket, data));
  }

  private handleDisconnect(socket: CustomSocket) {
    const user  = this.onlineUsers.get(socket.userId);
    if (user && user.socketId === socket.id) {
      this.onlineUsers.delete(socket.userId);
      this.io.emit("userOffline", { userId: socket.userId });
    }
    console.log("User disconnected:", socket.id);
  }

  private async handleSendMessage(socket: CustomSocket, data: SaveMessageDTO) {
    try {
      const { sessionId, senderId, receiverId, text, image } = data;

      if (!sessionId || !senderId || !receiverId ) {
        console.warn("Invalid message payload:", data);
        return;
      }

      const savedMessage = await this._chatUseCase.saveMessage(data);
      const receiverSocket  = this.onlineUsers.get(receiverId)?.socketId;
      const senderSocket = socket.id;

      const payload = {
        _id: savedMessage._id,
        senderId,
        receiverId,
        text,
        image,
        sessionId,
        createdAt: savedMessage.createdAt,
      };

      if (receiverSocket) this.io.to(receiverSocket).emit("receiveMessage", payload);
      this.io.to(senderSocket).emit("receiveMessage", payload);

      console.log(`Message sent and saved in session ${sessionId}`);
    } catch (error) {
      console.error("Error handling sendMessage:", error);
    }
  }

  private async handleDeleteMessage(socket: CustomSocket, data:{messageId: string, sessionId: string}){
    try {
      const {messageId, sessionId} = data;
      if(!messageId || !sessionId){
        console.warn("Invalid message payload:", data);
        return;
      }

      await this._chatUseCase.deleteMessage(data,socket.userId);
      this.io.to(data.sessionId).emit("messageDeleted", {
        messageId: data.messageId,
        deletedFor: socket.userType,
      });
    } catch (error) {
       console.error("Error deleting message:", error);
    }
  }
}
