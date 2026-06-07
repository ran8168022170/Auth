import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "unauthorised"));
  console.log("read tocken");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log("JWT Error:", err);
    console.log("Decoded User:", user);

    if (err) return next(errorHandler(401, "forbidden"));

    req.user = user;
    next();
  });
};
