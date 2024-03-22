"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import TaskCard from "./_components/task-card";

export default function Home() {
  const tasks = api.task.all.useQuery();

  const session = useSession();

  if (session.status !== "authenticated") return;

  if (tasks.isLoading) return <p>Loading...</p>;

  if (!tasks) return <p>No tasks found.</p>;

  return (
    <>
      <header>This is the main page</header>
      <div className="mx-auto mt-8 flex w-11/12 flex-col gap-4">
        {tasks.data?.map((task, index) => (
          <div key={index}>
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </>
  );
}

// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
