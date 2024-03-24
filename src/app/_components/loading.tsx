import React from "react";

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="mb-24 flex flex-col items-center justify-center gap-2">
        <span className="loading loading-spinner loading-lg text-warning"></span>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
