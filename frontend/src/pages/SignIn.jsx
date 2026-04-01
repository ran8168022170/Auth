import React from "react";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div>
      Signin page
      <p>dont have account</p>
      <Link to={"/sign-up"}>
        <span className="text-blue-500">singnUp</span>
      </Link>
    </div>
  );
}
