import { Middleware } from "solid-start/entry-server";
import { Server, Socket } from 'socket.io';
import type { FetchEvent } from "solid-start";

let server: Server;

function onConnection(client: Socket) {
  console.log("socket.io/connection:", "client connected 🎉");

  client.on("message", (data) => {
    server.sockets.send(data);
  });

  client.on('disconnect', () => {
    console.log("socket.io/disconnect:", "client disconnected 👋");
  });
}

function useServer(event: FetchEvent) {
  if (import.meta.env.DEV && !server && event.httpServer!.io) {
    // reuse socketio server in dev on hmr
    server = event.httpServer!.io;
    server.removeAllListeners();
    server.addListener("connection", onConnection);
  }

  if (!server) {
    const upgradeListeners = event.httpServer!.listeners("upgrade");
    server = new Server(event.httpServer, { path: "/socketio/" });
    import.meta.env.DEV && (event.httpServer!.io = server);
    event.httpServer!.removeAllListeners("upgrade");
    upgradeListeners.forEach((listener: any) => event.httpServer!.addListener("upgrade", listener));
    server.on("connection", onConnection);
  }

  return server;
} 

export const socketio: Middleware = ({forward}) => async (event) => {
  if (event.request.headers.get("upgrade") === "websocket") {
    if (new URL(event.request.url).pathname === '/socketio/') {
      server = useServer(event);
      server.engine.handleUpgrade(event.locals.request, event.locals.request.socket, Buffer.alloc(0));
      return new Response(null, { headers: { "x-ws-upgrade": "" } });
    }  
  }
  event.locals.io = server;
  return forward(event);
}
