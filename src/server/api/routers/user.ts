import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { type User } from "@prisma/client";

const userIdSchema = z.string();

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(userIdSchema)
    .query(async ({ ctx, input }) => {
      const user: User | null = await ctx.db.user.findUnique({
        where: { id: input },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid user" });
      }

      return user;
    }),

  resetCompletedTasks: protectedProcedure
    .input(userIdSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid user" });
      }

      const updatedUser = await ctx.db.user.update({
        where: { id: input },
        data: {
          completedTasks: 0,
        },
      });

      return updatedUser;
    }),
});
