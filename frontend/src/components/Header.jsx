import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  console.log("header avatar", currentUser?.avatar);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Ranjeet</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form action="" className=" bg-slate-100 p-3 rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
        </form>

        <ul className="flex gap-4 items-center">
          <li>
            <Link
              to="/"
              className="hidden sm:inline text-slate-700 hover:underline"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="hidden sm:inline text-slate-700 hover:underline"
            >
              About
            </Link>
          </li>

          <li>
            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full h-15 w-15  object-cover border border-red-500"
                  src={currentUser?.avatar}
                  alt="profile"
                />
              ) : (
                <span className="hidden sm:inline text-slate-700 hover:underline">
                  SignIn
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
