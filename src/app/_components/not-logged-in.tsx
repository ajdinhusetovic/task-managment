import React from "react";

const NotLoggedIn = () => {
  return (
    <div className="flex h-[300px] items-center justify-center">
      <h1 className="rounded bg-orange-400 p-8 text-center text-4xl font-medium">
        Please log in to start managing your tasks.
      </h1>
    </div>
  );
};

export default NotLoggedIn;
