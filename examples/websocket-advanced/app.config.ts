import { defineConfig } from "@solidjs/start/config";
import { join, resolve } from "vinxi/lib/path";
import { config } from "vinxi/plugins/config";
import { APIFileSystemRouter } from "./src/ws/router";
import { createFetch, Headers } from "ofetch";

const app = defineConfig({
  server: {
    experimental: {
      websocket: true
    }
  }
});

app.addRouter({
  name: "ws",
  target: "server",
  type: "http",
  handler: "./src/ws/handler.ts",
  base: "/_ws",
  routes: (router: any, app: any) => {
    return new APIFileSystemRouter(
    { 
      dir: resolve(router.root, "src/ws/routes"),
      extensions: ["js", "ts"] 
    }, 
    router, 
    app
  );},
  plugins: async () => [
    config("ws-server", {
      resolve: {
        alias: {
          "~": join(app.config.root, "src"),
        }
      }
    })
  ]
});

app.hooks.hook("app:dev:server:created", ({ app, devApp }) => {
  // 1. Dev does not support user defined plugins yet so this hook is used to mimic a plugin call at startup.
  // 2. Vinxi does expose the h3 handler but not nitro's $fetch (localFetch) helper.
  // Note: Using "app:dev:server:listener:creating" hook would also work but runs after vinxi's current dev plugins.
  globalThis.$fetch = createFetch({
    fetch: devApp.localFetch,
    Headers,
    defaults: { baseURL: app.config.server.baseURL }
  });
});

export default app;
