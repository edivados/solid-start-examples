import { buildRouter, publicProcedure } from "../trpc";

export const counterRouter = buildRouter({
  count: publicProcedure.query(async ({ ctx }) => {
    return (await ctx.prisma.counter.findUnique({ where: { id: 1 } })).count;
  }),
  increment: publicProcedure.mutation(async ({ ctx }) => {
    return (
      await ctx.prisma.counter.update({
        where: { id: 1 },
        data: {
          count: {
            increment: 1,
          },
        },
      })
    ).count;
  }),
});
