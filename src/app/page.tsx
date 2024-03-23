"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import TaskCard from "./_components/task-card";
import { useState } from "react";
import NotLoggedIn from "./_components/not-logged-in";

export default function Home() {
  const tasks = api.task.all.useQuery();

  const session = useSession();

  if (session.status !== "authenticated") {
    return <NotLoggedIn />;
  }

  if (tasks.isLoading) return <p>Loading...</p>;

  return (
    <>
      {tasks.data && tasks.data.length > 0 ? (
        <div className="mx-auto my-8 flex w-11/12 flex-col gap-4 md:flex-row">
          {tasks.data.map((task, index) => (
            <div key={index} className="md:w-2/6">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[300px] items-center justify-center">
          <h1 className="rounded bg-orange-400 p-8 text-center text-4xl font-medium">
            There currently no tasks available.
          </h1>
        </div>
      )}
    </>
  );
}
