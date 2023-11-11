import { WebSocketServer } from "ws";
import { Middleware } from "solid-start/entry-server";

const server: WebSocketServer = new WebSocketServer({ noServer: true, path: "/ws" });

server.on("error", (e) => {
  console.log("ws/error", e);
});

server.on("connection", (client) => {
  console.log("ws/connection:", "client connected 🎉");

  client.on("pong", (data) => {
    console.log("ws/client/pong", data.toString("utf-8"));
  });

  client.on("message", (data) => {
    // console.log("ws/client/message:", data.toString("utf-8"));
    server.clients.forEach(client => client.send(data.toString("utf-8")));
  });

  client.on("error", (e) => {
    console.log("ws/client/error:", e);
  });

  client.on('close', (e, reason) => {
    console.log("ws/close/error:", e);
    console.log("ws/close/reson:", reason.toString("utf-8"));
    console.log("ws/close:", "client disconnected 👋");
  });
});

export const ws: Middleware = ({forward}) => (event) => {
  if (event.request.headers.get("upgrade") === "websocket") {
    if (server.shouldHandle(event.locals.request)) {
      server.handleUpgrade(event.locals.request, event.locals.request.socket, Buffer.alloc(0), (client, request) => {
        console.log("upgrade done");
        server.emit('connection', client, request);
      });
      return new Response(null, { headers: { "x-ws-upgrade": "" } });
    }
  }
  event.locals.ws = server;
  return forward(event);
}
