"use client";

import React from "react";
import { api } from "~/trpc/react";
import TaskCard from "../_components/task-card";
import { type Task } from "@prisma/client";

const page = () => {
  const tasks = api.task.unfinishedTasks.useQuery();

  if (tasks.isError) {
    return <h1>Error</h1>;
  }

  return (
    <div className="mb-12 mt-6 grid w-full grid-cols-1 gap-3 md:mt-8 md:grid-cols-2 xl:grid-cols-3">
      {tasks.data && tasks.data.length > 0 ? (
        tasks.data?.map((task: Task, index: number) => (
          <TaskCard task={task} key={index} />
        ))
      ) : (
        <div className="flex h-[300px] items-center justify-center">
          <h1 className="rounded bg-orange-400 p-8 text-center text-4xl font-medium">
            There are currently no tasks available.
          </h1>
        </div>
      )}
    </div>
  );
};

export default page;
