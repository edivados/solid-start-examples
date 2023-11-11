import { buildRouter } from "../trpc";
import { counterRouter } from "./counter";

export const router = buildRouter({
  counter: counterRouter,
});

export type Router = typeof router;
