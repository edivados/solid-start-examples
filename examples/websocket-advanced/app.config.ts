import { defineConfig } from "@solidjs/start/config";
import { join, resolve } from "vinxi/lib/path";
import { config } from "vinxi/plugins/config";
import { APIFileSystemRouter } from "./src/ws/router";

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
      },
      cacheDir: "node_modules/.vinxi/ws"
    })
  ]
});

export default app;
