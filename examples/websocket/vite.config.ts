import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  clearScreen: false,
  start: {
    middleware: "./src/middleware.ts",
    server: {
      preset: "./preset"
    }
  }
});
