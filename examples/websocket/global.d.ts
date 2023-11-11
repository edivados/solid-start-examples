import { IncomingMessage } from "http";
import { Server as IO } from "socket.io";
import { Server as WS } from "ws";

declare module "solid-start/server" {
  interface LocalsExt {
    ws?: WS,
    io?: IO,
    request: IncomingMessage
  }
}