const http = require("http");

const app = require("./app");
const socket_io = require("socket.io");
const server = http.createServer(app);
const io = socket_io(server);

const { mongoConnect } = require("./services/mongo");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const users = {};

async function startServer() {
  await mongoConnect();

  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  });

  // server.listen(PORT, () => {
  //   io.on("connection", (socket) => {
  //     const userId = socket.handshake.query.userId;
  //     console.log("User connected: ", userId);
  //     users[userId] = {
  //       socketId: socket.id
  //     };

  //     // Join a user to a room
  //     socket.on("join-room", (event) => {
  //       socket.join(`ROOMID::${event.roomId}`);
  //       console.log(`User ${userId} joined to: ${event.roomId}`);
  //     });

  //     // Out a user from a room
  //     socket.on("leave-room", (event) => {
  //       socket.leave(`ROOMID::${event.roomId}`);
  //       console.log(`User ${userId} left the room: ${event.roomId}`);
  //     });

  //     // User sends a message
  //     socket.on("send-message", (event) => {
  //       if(event.roomId) {
  //         // Broadcast message to a group
  //         io.to(`ROOMID::${event.roomId}`).emit("onMessage", {
  //           "message": event.message,
  //           "from": userId,
  //           "roomId": event.roomId,
  //         });
  //         console.log("here", userId, event.roomId);
  //         return;
  //       }

  //       console.log(`user: ${userId} sent a message to ${event.to}:
  //       ${event.message}`);
  //       const receiverSocketId = users[event.to].socketId;
  //       socket.broadcast.to(receiverSocketId)
  //         .emit("onMessage", { "message": event.message, "from": userId });
  //     });

  //     // User disconnects
  //     socket.on("disconnect", (event) => {
  //       delete users[userId];
  //       console.log("user disconnected: ", userId);
  //     });
  //   });

  //   console.log(`Server started on port: ${PORT}`);
  // });
  // server.listen(PORT,"192.168.1.102",  () => {
  //   io.on("connection", (socket) => {});
  //   console.log(`Server started on port: ${PORT}`);
  // });
}

startServer();
