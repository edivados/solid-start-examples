/// <reference types="@solidjs/start/env" />

import { Server } from "ws";

declare global {
  var ws: Server;
}

declare module "@solidjs/start/server" {
  interface RequestEventLocals {
    ws: Server
  }
}
