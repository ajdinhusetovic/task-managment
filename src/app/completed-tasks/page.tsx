"use client";

import React from "react";
import { api } from "~/trpc/react";
import TaskCard from "../_components/task-card";
import NotLoggedIn from "../_components/not-logged-in";

const page = () => {
  const tasks = api.task.unfinishedTasks.useQuery();

  if (tasks.isError) {
    return <h1>Error</h1>;
  }

  return (
    <div className="mx-auto my-8 flex w-11/12 flex-col gap-4 ">
      {tasks.data?.map((task, index) => (
        <div key={index} className="w-1/2">
          <TaskCard task={task} />
        </div>
      ))}
    </div>
  );
};

export default page;
