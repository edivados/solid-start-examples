import { APIEvent } from "solid-start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { router } from "~/lib/trpc/server/router";
import { context } from "~/lib/trpc/server/trpc";

const handler = (event: APIEvent) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: event.request,
    router: router,
    createContext: () => context,
  });
};

export const GET = handler;

export const POST = handler;
