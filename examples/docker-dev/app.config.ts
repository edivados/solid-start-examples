import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite({ router }) {
    return {
      server: {
        ...(router === "client" ? { hmr: { port: 4000 } } : {}),
        // On Windows when mounting from host usePolling is required for the file watcher to work.
        ...(process.platform === "win32" ? { watch: { usePolling: true } } : {})
      }
    }
  }
});
