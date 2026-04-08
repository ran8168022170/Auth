import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("DATA:", data);

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(false);

      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  console.log("Errror", error);
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-10 ">SignUp</h1>

      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border rounded-lg p-3 "
          id="username"
          onChange={handleChange}
        />

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
          {loading ? "Loading..." : "SignUp"}
        </button>
      </form>

      <div className="flex my-2">
        <p>Have an account? </p>
        <Link to={"/sign-in"}>
          <span className="text-blue-500">SignIn</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
