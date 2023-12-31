import { eventHandler, createMiddleware, lazyEventHandler, H3Event } from "@solidjs/start/server";
import { WebSocketServer } from "ws";

export default createMiddleware({
  onRequest: [
    lazyEventHandler(() => {
      console.log("lazy init handler");
    
      const server: WebSocketServer = new WebSocketServer({ noServer: true, path: "/ws" });
      
      server.on("connection", (socket) => {
        console.log("client connected 🎉");

        socket.on("message", (data) => {
          server.clients.forEach(client => client != socket && client.send(data.toString("utf-8")));
        });
      
        socket.on('close', () => {
          console.log("client disconnected 👋");
        });
      });
    
      return eventHandler(async (event) => {
        event.locals.ws = server;
        console.log("hitting middleware");
        if (event.node.req.url == "/ws") {
          console.log("hitting /ws endpoint");
          if (event.node.req.headers["upgrade"] === "websocket") {
            if (server.shouldHandle(event.node.req)) {
              server.handleUpgrade(event.node.req, event.node.req.socket, Buffer.alloc(0), (client, request) => {
                console.log("upgrade done");
                server.emit('connection', client, request);
              });
              // event.node.res.writeHead(101);
              event[Object.getOwnPropertySymbols(event)[0]]._handled = true;
            }
          }
        }
      });
    })
  ]
});