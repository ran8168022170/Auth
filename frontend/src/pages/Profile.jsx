import { useSelector } from "react-redux";
import { useRef } from "react";
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="mx-auto p-3 max-w-lg ">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form action="" className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="profile"
          className=" rounded-full h-24 w-24 object-cover mx-auto"
        />
        <input
          type="text"
          id="username"
          placeholder="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
        />
        <button className="uppercase rounded-lg p-3 text-white bg-slate-700 hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-600">Delete Account</span>
        <span className="text-red-600">Sign-Out</span>
      </div>
    </div>
  );
}
