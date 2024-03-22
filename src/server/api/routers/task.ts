import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type Task } from "@prisma/client";

enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

const priorityValues: [string, ...string[]] = [
  Priority.HIGH,
  Priority.MEDIUM,
  Priority.LOW,
];

const inputSchema = z.object({
  title: z.string(),
  priority: z.enum(priorityValues),
  description: z.string(),
});

export const taskRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const tasks: Task[] = await ctx.db.task.findMany();
    return tasks;
  }),

  create: protectedProcedure
    .input(inputSchema)
    .mutation(async ({ ctx, input: { title, priority, description } }) => {
      const taskPriority: Priority = priority as Priority;
      const task: Task = await ctx.db.task.create({
        data: {
          title,
          priority: taskPriority,
          description,
          userId: ctx.session.user.id,
        },
      });

      return task;
    }),
});
