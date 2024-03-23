"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="navbar bg-orange-300">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 bg-violet-50 p-2 shadow"
          >
            <li className="text-orange-500">
              <Link href="/">Home</Link>
            </li>
            <li className="text-orange-500">
              <Link href="/create-task">Create Task</Link>
            </li>
            {user !== undefined && (
              <li className="text-orange-500">
                <Link href={`/profiles/${user?.id}`}>Profile</Link>
              </li>
            )}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl" href="/">
          Task<span className="text-orange-500">Managment</span>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li className="rounded font-medium text-zinc-950 hover:bg-orange-400">
            <Link href="/">Home</Link>
          </li>
          <li className="rounded font-medium text-zinc-950 hover:bg-orange-400">
            <Link href="/create-task">Create Task</Link>
          </li>
          {user !== undefined && (
            <li className="rounded font-medium text-zinc-950 hover:bg-orange-400">
              <Link href={`/profiles/${user?.id}`}>Profile</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        {user === undefined ? (
          <button
            className="rounded-md bg-violet-50 p-2 font-medium"
            onClick={() => void signIn()}
          >
            Log In
          </button>
        ) : (
          <button
            className="rounded-md bg-violet-50 p-2 font-medium hover:bg-violet-100"
            onClick={() => void signOut()}
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
