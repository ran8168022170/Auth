import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSucess,
  signInFailure,
} from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});

  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("DATA:", data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));

        return;
      }
      dispatch(signInSucess(data));

      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  console.log("Errror", error);
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-10 ">SignIn</h1>

      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border rounded-lg p-3 "
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border rounded-lg p-3 "
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-80 uppercase "
        >
          {loading ? "Loading..." : "SignIn"}
        </button>
      </form>

      <div className="flex my-2">
        <p>Dont Have an account? </p>
        <Link to={"/sign-up"}>
          <span className="text-blue-500">SignUp</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
