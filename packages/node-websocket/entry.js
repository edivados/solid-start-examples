import { dirname, join } from "path";
import { createServer } from "solid-start-node-ws/server";
import "solid-start/node/globals.js";
import { fileURLToPath } from "url";
import manifest from "../../dist/public/route-manifest.json";
import handler from "./entry-server.js";
import { createRequest } from "solid-start/node/fetch.js";

const { PORT = 3000 } = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));
const paths = {
  assets: join(__dirname, "/public")
};

const server = createServer({
  paths,
  handler,
  env: { manifest },
});

const { server: httpServer } = server.listen(PORT, err => {
  if (err) {
    console.log("error", err);
  } else {
    console.log(`Listening on port ${PORT}`);
  }
});

httpServer.on('upgrade', async (request) => {
  const response = await handler({
    request: createRequest(request),
    httpServer,
    locals: { request }
  });
  if (!response.headers.has("x-ws-upgrade")) {
    socket.destroy();
  }
})
