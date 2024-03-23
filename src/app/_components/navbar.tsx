"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const session = useSession();
  const user = session.data?.user;

  const handleNav = () => {
    setNav(!nav);
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = nav ? "auto" : "hidden";
    }
  };

  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "auto";
    }

    const handleBeforeUnload = () => {
      if (body) {
        body.style.overflow = "auto";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <nav
      className={`w-full ${nav ? "" : "h-[100px] md:h-[150px]"} border border-l-0 border-r-0 border-t-0 border-b-blue-300`}
    >
      <div className="mx-auto flex h-full w-11/12 justify-between">
        <div
          className={`flex h-full items-center justify-between ${
            nav ? "" : "w-full md:w-1/3"
          }`}
        >
          {nav ? (
            ""
          ) : (
            <h1 className="items-self-center cursor-pointer text-3xl font-medium lg:text-5xl">
              Task<span className="text-yellow-500">Managment</span>
            </h1>
          )}
          <div
            className={`flex justify-end p-2 md:hidden ${
              nav && "fixed right-0 top-0"
            }`}
            onClick={handleNav}
          >
            {nav ? <IoClose size={30} /> : <RxHamburgerMenu size={25} />}
          </div>
        </div>
        {nav && (
          <ul className="flex h-screen w-full flex-col items-center justify-center gap-2 md:hidden">
            <li className="group transition-all duration-300 ease-in-out">
              <Link
                className="bg-gradient-to-r from-orange-500 to-blue-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-300 ease-out group-hover:bg-[length:100%_2px]"
                href="/"
              >
                Home
              </Link>
            </li>
            <li className="group transition-all duration-300 ease-in-out">
              <Link
                className="bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-out group-hover:bg-[length:100%_2px]"
                href="/create-task"
              >
                Create task
              </Link>
            </li>
            {user !== undefined && (
              <li className="group transition-all duration-300 ease-in-out">
                <Link
                  className="bg-gradient-to-r from-blue-500 to-orange-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-out group-hover:bg-[length:100%_2px]"
                  href="/completed-tasks"
                >
                  Completed
                </Link>
              </li>
            )}
            {user !== undefined && (
              <li className="group transition-all duration-300 ease-in-out">
                <Link
                  className="bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-out group-hover:bg-[length:100%_2px]"
                  href={`/profiles/${user?.id}`}
                >
                  Profile
                </Link>
              </li>
            )}
            {user === undefined ? (
              <li className="group transition-all duration-300 ease-in-out">
                <button
                  className="rounded-md bg-yellow-500 p-2 font-medium"
                  onClick={() => void signIn()}
                >
                  Log In
                </button>
              </li>
            ) : (
              <li className="group transition-all duration-300 ease-in-out">
                <button
                  className="rounded-md bg-yellow-500 p-2 font-medium"
                  onClick={() => void signOut()}
                >
                  Log Out
                </button>
              </li>
            )}
          </ul>
        )}

        <ul className="hidden items-center gap-5 md:flex">
          <li className="group transition-all duration-300 ease-in-out">
            <Link
              className="bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-300 ease-out group-hover:bg-[length:100%_2px]"
              href="/"
            >
              Home
            </Link>
          </li>

          <li className="group transition-all duration-300 ease-in-out">
            <Link
              className="bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-out group-hover:bg-[length:100%_2px]"
              href="/create-task/"
            >
              Create task
            </Link>
          </li>
          {user !== undefined && (
            <li className="group transition-all duration-300 ease-in-out">
              <Link
                className="bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-out group-hover:bg-[length:100%_2px]"
                href="/completed-tasks"
              >
                Completed
              </Link>
            </li>
          )}
          {user !== undefined && (
            <li className="group transition-all duration-300 ease-in-out">
              <Link
                className="bg-gradient-to-r from-orange-500 to-orange-500 bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 ease-out group-hover:bg-[length:100%_2px]"
                href={`/profiles/${user?.id}`}
              >
                Profile
              </Link>
            </li>
          )}
          {user === undefined ? (
            <li className="group transition-all duration-300 ease-in-out">
              <button
                className="rounded-md bg-yellow-500 p-2 font-medium"
                onClick={() => void signIn()}
              >
                Log In
              </button>
            </li>
          ) : (
            <li className="group transition-all duration-300 ease-in-out">
              <button
                className="rounded-md bg-yellow-500 p-2 font-medium"
                onClick={() => void signOut()}
              >
                Log Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
