import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [formDada, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formDada,
      [e.target.id]: e.target.value,
    });
  };

  console.log(formDada);
  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center mt-7">SignIn</h1>
      <form action="" className="flex flex-col gap-4">
        <input
          type="email"
          id="email"
          placeholder="email"
          className="border rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border rounded-lg p-3"
          onChange={handleChange}
        />

        <button className="rounded-lg border p-3 text-white bg-slate-500 hover:opacity-95 disabled:opacity-80">
          SignIn
        </button>
      </form>
    </div>
  );
}
