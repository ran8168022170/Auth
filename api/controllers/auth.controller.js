//import User from "../model/user.model.js";

import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  const hasedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hasedPassword });

  try {
    await newUser.save();

    res.status(201).json("user created successfully");
  } catch (error) {
    next(error);
  }
};
