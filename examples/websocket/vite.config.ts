import solid from "solid-start/vite";
import { defineConfig } from "vite";
import node from "solid-start-node-ws";

export default defineConfig({
  server: {
    hmr: {
      port: 3001
    }
  },
  plugins: [
    solid({ adapter: node() })
  ],
});
