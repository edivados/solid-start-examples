import { defineConfig } from "@solidjs/start/config";

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
  base: "/_ws"
});

export default app;
