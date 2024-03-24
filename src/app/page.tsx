"use client";

import { type Task, type Priority } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";
import NotLoggedIn from "./_components/not-logged-in";
import TaskCard from "./_components/task-card";
import Loading from "./_components/loading";

export default function Home() {
  const { data: tasks, isLoading } = api.task.all.useQuery();
  const session = useSession();
  const [sortBy, setSortBy] = useState<"priority" | "title" | "date">(
    "priority",
  );
  const [taskCategory, setTaskCategory] = useState("");

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value as "priority" | "title" | "date");
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedCategory = event.target.value;
    setTaskCategory(selectedCategory === "all" ? "" : selectedCategory);
  };

  if (session.status !== "authenticated") {
    return <NotLoggedIn />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const compareTasks = (a: Task, b: Task): number => {
    if (sortBy === "priority") {
      if (a.priority !== null && b.priority !== null) {
        const priorityOrder: Record<Priority, number> = {
          HIGH: 3,
          MEDIUM: 2,
          LOW: 1,
        };
        return (
          (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        );
      } else {
        return 0;
      }
    } else if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    } else {
      return (b.createdAt.getTime() || 0) - (a.createdAt.getTime() || 0);
    }
  };

  let filteredTasks = tasks ?? [];
  if (taskCategory !== "") {
    filteredTasks = filteredTasks.filter(
      (task) => task.category === taskCategory,
    );
  }

  const sortedTasks = filteredTasks.slice().sort(compareTasks);

  return (
    <>
      {tasks && tasks.length > 0 && (
        <div className="flex flex-col items-center justify-center md:items-start md:justify-start">
          <div className="py-12">
            <div className="flex w-fit flex-wrap items-center gap-2 rounded-md bg-orange-300 p-4 md:space-x-2 md:p-8">
              <label className="flex items-center gap-1 text-lg font-medium">
                <input
                  type="radio"
                  value="priority"
                  checked={sortBy === "priority"}
                  onChange={handleSortChange}
                  className="radio border-2 border-black"
                />
                Priority
              </label>
              <label className="ml-2 flex items-center gap-1 text-lg font-medium">
                <input
                  type="radio"
                  value="title"
                  checked={sortBy === "title"}
                  onChange={handleSortChange}
                  className="radio border-2 border-black"
                />
                Title
              </label>
              <label className="flex items-center gap-1 text-lg font-medium">
                <input
                  type="radio"
                  value="date"
                  checked={sortBy === "date"}
                  onChange={handleSortChange}
                  className="radio border-2 border-black"
                />
                Date
              </label>
              <select
                name="taskCategory"
                onChange={handleCategoryChange}
                className="mt-2 w-full cursor-pointer rounded bg-orange-400 p-2 text-zinc-950 md:w-[200px]"
                value={taskCategory || "all"}
              >
                <option value="all">All</option>
                <option value="home">Home</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="work">Work</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}
      <div className="mb-12 mt-6 w-full">
        {sortedTasks && sortedTasks.length > 0 && (
          <div className="grid grid-cols-1 gap-3 pb-8 md:mt-8 md:grid-cols-2 xl:grid-cols-3">
            {sortedTasks.map((task: Task, index) => (
              <TaskCard key={index} task={task} />
            ))}
          </div>
        )}
        {!(tasks && tasks.length > 0) && (
          <div className="flex h-screen flex-col items-center justify-center">
            <div className="mb-24 flex flex-col items-center justify-center rounded bg-orange-300 px-8 py-16 md:p-24">
              <h1 className="text-4xl md:text-5xl">
                Start creating your tasks!
              </h1>
              <p className="mt-4 text-lg">
                You currently do not have any tasks. Click the button below to
                get started.
              </p>
              <Link
                href="/create-task"
                className="mt-4 rounded-md bg-orange-400 p-4 hover:bg-orange-500"
              >
                Start creating tasks
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
