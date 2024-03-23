"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const Profile = () => {
  const session = useSession();
  const user = { ...session.data?.user };

  console.log(session.data?.user.name);

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
        <h1 className="mt-4 text-4xl">{user.name}</h1>
      </div>
    </div>
  );
};

export default Profile;
