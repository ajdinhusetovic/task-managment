"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { api } from "~/trpc/react";

const Profile = () => {
  const session = useSession();
  const userId = session.data?.user?.id ?? "";

  const userQuery = api.task.getUser.useQuery(userId);
  const user = { ...userQuery?.data };

  console.log(user);

  return (
    <div className="mt-16 flex flex-col items-center">
      <Image
        src={user.image ?? ""}
        alt="user avatar"
        width={200}
        height={200}
        className="rounded-full"
      />
      <div>
        <p className="mt-4 text-zinc-700">{user.email}</p>
        <h1 className="mt-2 text-4xl">{user.name}</h1>
        <p>Tasks completed: {user.completedTasks}</p>
      </div>
    </div>
  );
};

export default Profile;
