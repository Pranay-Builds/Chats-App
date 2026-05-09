import { Server, Socket } from "socket.io";

export function registerChatHandlers(
  io: Server,
  socket: Socket
) {

  socket.on("join-chat", (chatId: string) => {

    socket.join(chatId);

    console.log(
      `${socket.id} joined chat ${chatId}`
    );

  });

}