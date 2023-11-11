import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { client } from "~/lib/prisma/client";

type Context = {
  prisma: PrismaClient;
};

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter: (shape) => ({ shape }),
});

export const buildRouter = t.router;

export const publicProcedure = t.procedure;

export const context: Context = {
  prisma: client,
};
