import { defineConfig } from "@solidjs/start/config";
import { join } from "vinxi/lib/path";
import { config } from "vinxi/plugins/config";

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
  handler: "src/websocket-handler.ts",
  base: "/_ws",
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
