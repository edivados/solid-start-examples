import solid from "solid-start/vite";
import { defineConfig } from "vite";

const baseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "production") return "http://localhost:3000";
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default defineConfig({
  define: {
    "process.env.BASE_URL": `"${baseUrl()}"`,
  },
  plugins: [solid()],
  ssr: { external: ["@prisma/client"] },
});
