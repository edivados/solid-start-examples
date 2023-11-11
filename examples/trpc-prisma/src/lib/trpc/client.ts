import { httpBatchLink, loggerLink, createTRPCProxyClient } from "@trpc/client";
import SuperJSON from "superjson";
import type { Router } from "./server/router";

// process.env.BASE_URL will be replaced by vite. See vite.config.ts
const baseUrl = typeof window !== "undefined" ? "" : process.env.BASE_URL;

export const client = createTRPCProxyClient<Router>({
  transformer: SuperJSON,
  links: [
    loggerLink({ enabled: () => true }),
    httpBatchLink({
      url: `${baseUrl}/api/trpc`
    })
  ],
});
