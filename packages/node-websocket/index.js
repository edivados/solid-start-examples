import common from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import { copyFileSync } from "fs";
import { dirname, join } from "path";
import { rollup } from "rollup";
import { fileURLToPath, pathToFileURL } from "url";
import { createDevHandler } from "./dev-handler.js";

export default () => ({
  name: "node",
  dev: (config, vite) => {
    const { handler } = createDevHandler(vite, config, config.solidOptions);
    vite.httpServer.on("upgrade", async (request, socket) => {
      const response = await handler(request);
      if (!response.headers.has("x-ws-upgrade")) {
        // TODO: send response headers
        socket.destory();
      }
    });
    return handler;
  },
  start: (config, { port }) => {
    process.env.PORT = port;
    import(pathToFileURL(join(config.root, "dist", "server.js")).toString());
    return `http://localhost:${process.env.PORT}`;
  },
  async build(config, builder) {
    const ssrExternal = config?.ssr?.external || [];
    const __dirname = dirname(fileURLToPath(import.meta.url));

    if (!config.solidOptions.ssr) {
      await builder.spaClient(join(config.root, "dist", "public"));
      await builder.server(join(config.root, ".solid", "server"));
    } else if (config.solidOptions.experimental.islands) {
      await builder.islandsClient(join(config.root, "dist", "public"));
      await builder.server(join(config.root, ".solid", "server"));
    } else {
      await builder.client(join(config.root, "dist", "public"));
      await builder.server(join(config.root, ".solid", "server"));
    }

    copyFileSync(join(__dirname, "entry.js"), join(config.root, ".solid", "server", "server.js"));

    builder.debug(`bundling server with rollup`);

    const bundle = await rollup({
      input: join(config.root, ".solid", "server", "server.js"),
      plugins: [
        json(),
        nodeResolve({
          preferBuiltins: true,
          exportConditions: ["node", "solid"]
        }),
        common({ strictRequires: true, ...config.build.commonjsOptions })
      ],
      external: ["stream/web", ...ssrExternal]
    });
    // or write the bundle to disk
    await bundle.write({ format: "esm", dir: join(config.root, "dist") });

    // closes the bundle
    await bundle.close();

    builder.debug(`bundling server done`);
  }
})
