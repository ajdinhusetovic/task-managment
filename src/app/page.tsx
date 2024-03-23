"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import TaskCard from "./_components/task-card";
import { useState } from "react";
import NotLoggedIn from "./_components/not-logged-in";
import { type Priority, type Task } from "@prisma/client";

export default function Home() {
  const { data: tasks, isLoading } = api.task.all.useQuery();
  const session = useSession();
  const [sortBy, setSortBy] = useState<"priority" | "title" | "date">(
    "priority",
  );

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value as "priority" | "title" | "date");
  };

  if (session.status !== "authenticated") {
    return <NotLoggedIn />;
  }

  if (isLoading) return <p>Loading...</p>;

  const compareTasks = (a: Task, b: Task): number => {
    if (a.priority !== null && b.priority !== null) {
      const priorityOrder: Record<Priority, number> = {
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1,
      };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (a.title && b.title) {
      return a.title.localeCompare(b.title);
    } else {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
  };

  const sortedTasks = tasks?.slice().sort(compareTasks);

  return (
    <div>
      {sortedTasks && sortedTasks.length > 0 && (
        <div className="py-5">
          <div className="flex w-fit items-center space-x-4 rounded-md bg-orange-300 p-5">
            <label className="flex items-center gap-1 text-lg font-medium">
              <input
                type="radio"
                value="priority"
                checked={sortBy === "priority"}
                onChange={handleSortChange}
                className="h-4 w-4"
              />
              Priority
            </label>
            <label className="flex items-center gap-1 text-lg font-medium">
              <input
                type="radio"
                value="title"
                checked={sortBy === "title"}
                onChange={handleSortChange}
                className="h-4 w-4"
              />
              Title
            </label>
            <label className="flex items-center gap-1 text-lg font-medium">
              <input
                type="radio"
                value="date"
                checked={sortBy === "date"}
                onChange={handleSortChange}
                className="h-4 w-4"
              />
              Date (Newest to Oldest)
            </label>
          </div>
        </div>
      )}
      <div className="mt-12 grid grid-cols-3 gap-3">
        {sortedTasks && sortedTasks.length > 0 ? (
          sortedTasks.map((task: Task, index) => (
            <TaskCard key={index} task={task} />
          ))
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <h1 className="rounded bg-orange-400 p-8 text-center text-4xl font-medium">
              There are currently no tasks available.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
