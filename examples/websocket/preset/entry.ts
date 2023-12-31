import "#internal/nitro/virtual/polyfill";
import { Server as HttpServer, ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { Server as HttpsServer } from "node:https";
import destr from "destr";
import { toNodeListener } from "vinxi/server";
import { nitroApp } from "#internal/nitro/app";
import { setupGracefulShutdown } from "#internal/nitro/shutdown";
import { trapUnhandledNodeErrors } from "#internal/nitro/utils";
import { useRuntimeConfig } from "#internal/nitro";

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;

const nodeListener = toNodeListener(nitroApp.h3App);

const server =
  cert && key
    ? new HttpsServer({ key, cert }, nodeListener)
    : new HttpServer(nodeListener);

server.on("upgrade", (req) => {
  nodeListener(req, new ServerResponse(req));
});

const port = (destr(process.env.NITRO_PORT || process.env.PORT) ||
  3000) as number;
const host = process.env.NITRO_HOST || process.env.HOST;

const path = process.env.NITRO_UNIX_SOCKET;

// @ts-ignore
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address() as AddressInfo;
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${
    addressInfo.family === "IPv6"
      ? `[${addressInfo.address}]`
      : addressInfo.address
  }:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});

// Trap unhandled errors
trapUnhandledNodeErrors();

// Graceful shutdown
setupGracefulShutdown(listener, nitroApp);

export default {};