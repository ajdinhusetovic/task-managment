import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type User, type Task, type TaskCategory } from "@prisma/client";
import { TRPCError } from "@trpc/server";

enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

enum TaskCategorye {
  health = "health",
  work = "work",
  education = "education",
  finance = "finance",
  personal = "personal",
  home = "home",
  other = "other",
}

const priorityValues: [string, ...string[]] = [
  Priority.HIGH,
  Priority.MEDIUM,
  Priority.LOW,
];

const categoryValues: [string, ...string[]] = [
  TaskCategorye.health,
  TaskCategorye.work,
  TaskCategorye.education,
  TaskCategorye.finance,
  TaskCategorye.personal,
  TaskCategorye.home,
  TaskCategorye.other,
];

const inputSchema = z.object({
  title: z.string().min(3, "Title must contain at least 3 characters"),
  priority: z.enum(priorityValues),
  description: z
    .string()
    .max(300, "Description exceeds maximum length of 300 characters"),
  isDone: z.boolean(),
  category: z.enum(categoryValues),
});

const updateSchema = z.object({
  title: z.string(),
  priority: z.enum(priorityValues),
  description: z.string(),
  id: z.string(),
  category: z.enum(categoryValues),
});

const taskIdSchema = z.string();
const userIdSchema = z.string();

const markAsDoneSchema = z.object({
  id: z.string(),
  isDone: z.boolean(),
});

export const taskRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    if (!userId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User id not provided",
      });
    }

    const tasks: Task[] = await ctx.db.task.findMany({
      where: { userId, isDone: false },
    });
    return tasks;
  }),

  unfinishedTasks: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    if (!userId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User id not provided",
      });
    }

    const tasks: Task[] = await ctx.db.task.findMany({
      where: { userId, isDone: true },
    });
    return tasks;
  }),

  byId: protectedProcedure.input(taskIdSchema).query(async ({ ctx, input }) => {
    const task: Task | null = await ctx.db.task.findUnique({
      where: { id: input },
    });
    return task;
  }),

  create: protectedProcedure
    .input(inputSchema)
    .mutation(
      async ({
        ctx,
        input: { title, priority, description, isDone, category },
      }) => {
        const taskPriority: Priority = priority as Priority;
        const taskCategory: TaskCategory = category as TaskCategory;
        const task: Task = await ctx.db.task.create({
          data: {
            title,
            priority: taskPriority,
            description,
            isDone,
            userId: ctx.session.user.id,
            category: taskCategory,
          },
        });

        return task;
      },
    ),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deletedTask = await ctx.db.task.delete({
        where: { id: input },
      });

      return deletedTask;
    }),

  update: protectedProcedure
    .input(updateSchema)
    .mutation(
      async ({
        ctx,
        input: { id, title, priority, description, category },
      }) => {
        const taskPriority: Priority = priority as Priority;
        const taskCategory: TaskCategory = category as TaskCategory;
        const updatedTask = await ctx.db.task.update({
          where: { id },
          data: {
            title,
            priority: taskPriority,
            description,
            category: taskCategory,
          },
        });

        return updatedTask;
      },
    ),

  markAsDone: protectedProcedure
    .input(markAsDoneSchema)
    .mutation(async ({ ctx, input: { id, isDone } }) => {
      const updatedTask = await ctx.db.task.update({
        where: { id },
        data: { isDone },
      });

      if (updatedTask) {
        await ctx.db.user.update({
          where: { id: updatedTask.userId },
          data: {
            completedTasks: {
              increment: 1,
            },
          },
        });

        return updatedTask;
      }

      return null;
    }),

  getUser: protectedProcedure
    .input(userIdSchema)
    .query(async ({ ctx, input }) => {
      const user: User | null = await ctx.db.user.findUnique({
        where: { id: input },
      });
      return user;
    }),
});
