"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import Loading from "~/app/_components/loading";
import { api } from "~/trpc/react";

const Profile = () => {
  const session = useSession();
  const userId = session.data?.user?.id ?? "";

  const userQuery = api.user.getUser.useQuery(userId);
  const user = { ...userQuery?.data };

  const userResetCompletedTasks = api.user.resetCompletedTasks.useMutation();

  const handleReset = () => {
    userResetCompletedTasks.mutate(userId);
  };

  if (userQuery.isLoading) {
    return <Loading />;
  }

  return (
    <div className="mt-16 flex flex-col items-center">
      <Image
        src={user.image ?? ""}
        alt="user avatar"
        width={200}
        height={200}
        className="rounded-full"
      />
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-2 text-center text-4xl">{user.name}</h1>
        <p className="text-zinc-700">{user.email}</p>
        <p className="mt-4 text-center text-lg">
          Tasks completed:{" "}
          <span className="text-orange-500">{user.completedTasks}</span>
        </p>
        <button
          className="mt-2 w-full rounded bg-orange-300 p-2 hover:bg-orange-400"
          onClick={handleReset}
        >
          Reset tasks
        </button>
      </div>
    </div>
  );
};

export default Profile;
