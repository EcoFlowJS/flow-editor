import { Socket, io } from "socket.io-client";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? window.location.origin + "/"
    : "http://localhost:4000/";

const connectSocketIO = (roomID?: string[] | string): Socket => {
  const socket = io(baseUrl, { path: "/socket.ecoflow" });
  socket.on("connect", () => {
    if (roomID) socket.emit("join", roomID);
  });

  return socket;
};

const disconnectSocketIO = (socket: Socket) => (): void => {
  if (socket.connected) socket.disconnect().close();
};

export { connectSocketIO, disconnectSocketIO };
