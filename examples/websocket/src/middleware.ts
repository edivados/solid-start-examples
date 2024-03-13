import { RequestMiddleware, createMiddleware } from "@solidjs/start/middleware";
import { WebSocketServer } from "ws";

function lazyRequestMiddleware(fn: (() => RequestMiddleware)) {
  return fn();
}

function createWebSocketServer() {
  if (!globalThis.ws) {
    console.log("create websocket server");

    const server: WebSocketServer = new WebSocketServer({ noServer: true, path: "/ws" });
    globalThis.ws = server;
    
    server.on("connection", (socket) => {
      console.log("client connected 🎉");

      socket.on("message", (data) => {
        server.clients.forEach(client => client != socket && client.send(data.toString("utf-8")));
      });
    
      socket.on('close', () => {
        console.log("client disconnected 👋");
      });
    });
  }
  console.log("returning websocket server");
  return globalThis.ws;
}

export default createMiddleware({
  onRequest: [
    lazyRequestMiddleware(() => {
      console.log("lazy request middleware");
      const server = createWebSocketServer();
      return (event) => {
        event.locals.ws = server;
        console.log("request middleware");
        if (server.shouldHandle(event.nativeEvent.node.req)) {
          console.log("handle upgrade");
          server.handleUpgrade(
            event.nativeEvent.node.req, 
            event.nativeEvent.node.req.socket, 
            Buffer.alloc(0), 
            (client, request) => {
              console.log("upgrade done");
              server.emit('connection', client, request);
            }
          );
          event.nativeEvent._handled = true;
        }
      }
    })
  ]
});
