import { Server, Socket } from "socket.io";
import { registerChatHandlers } from "./handlers/chat.handler.js";
import { onlineUsers } from "./onlineUsers.js";

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    registerChatHandlers(io, socket);

    socket.on("user-online", (userId: string) => {
      onlineUsers.set(userId, socket.id);

      socket.emit("online-users", Array.from(onlineUsers.keys()));

      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("typing", ({ chatId, userId, name }) => {
      socket.to(chatId).emit("user-typing", {
        userId,
        name,
      });
    });

    socket.on("stop-typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("user-stop-typing", {
        userId,
      });
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          break;
        }
      }

      io.emit("online-users", Array.from(onlineUsers.keys()));

      console.log("Socket disconnected:", socket.id);
    });
  });
}
