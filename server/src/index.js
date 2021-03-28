import SocketServer from "./socket.js";
import Event from "events";
import { constants } from "./constants.js";
import { connect } from "http2";

const eventEmitter = new Event();

async function testServer() {
  const options = {
    post: 9898,
    host: "localhost",
    header: {
      Connection: "Upgrade",
      Upgrade: "websocket",
    },
  };

  const http = await import("http");
  const req = http.request(options);
  req.end();

  req.on("upgrade", (res, socket) => {
    socket.on("data", (data) => {
      console.log("client received", data.toString());
    });

    setInterval(() => {
      socket.write("Hello!");
      console.log("trying to send message");
    }, 1000);
  });
}

const port = process.env.PORT || 9898;
const socketServer = new SocketServer({ port });
const server = await socketServer.initialize(eventEmitter);

console.log("socket server is running at", server.address().port);

eventEmitter.on(constants.event.NEW_USER_CONNECT, (socket) => {
  console.log("new Connection", socket.id);
  socket.on("data", (data) => {
    console.log("server received", data.toString());
    socket.write("World!");
  });
});

await testServer();
