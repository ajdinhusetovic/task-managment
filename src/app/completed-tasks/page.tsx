"use client";

import React from "react";
import { api } from "~/trpc/react";
import TaskCard from "../_components/task-card";
import { type Task } from "@prisma/client";
import Link from "next/link";
import Loading from "../_components/loading";

const Page = () => {
  const tasks = api.task.unfinishedTasks.useQuery();

  if (tasks.isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="mb-12 mt-6 w-full">
        {tasks.data && tasks.data.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:mt-8 md:grid-cols-2 xl:grid-cols-3">
            {tasks.data.map((task: Task, index: number) => (
              <TaskCard task={task} key={index} />
            ))}
          </div>
        )}
        {!(tasks.data && tasks.data.length > 0) && (
          <div className="flex h-screen items-center justify-center">
            <div className="mb-24 flex flex-col items-center justify-center rounded bg-orange-300 px-8 py-16 md:p-24">
              <h1 className="my-4 text-center text-2xl md:text-5xl">
                There are no completed tasks. Get to work!
              </h1>
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
};

export default Page;
