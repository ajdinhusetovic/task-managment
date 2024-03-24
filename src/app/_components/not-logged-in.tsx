import { signIn } from "next-auth/react";
import React from "react";

const NotLoggedIn = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mb-44 bg-orange-300 p-8 md:mb-24 md:max-w-[750px] md:p-24 2xl:max-w-full">
        <h1 className="text-2xl font-semibold md:text-5xl">
          Task <span className="text-orange-500">Managment</span>: Simplifying
          your life, one task at a time.
        </h1>
        <p className="text-md md:text-lg">
          You are on step away from efficiently managing your tasks.
        </p>
        <button
          onClick={() => void signIn()}
          className="mt-2 w-[100px] rounded bg-orange-400 p-2 hover:bg-orange-500"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default NotLoggedIn;
