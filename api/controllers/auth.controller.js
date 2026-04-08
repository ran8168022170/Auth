//import User from "../model/user.model.js";

import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hasedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hasedPassword });

  try {
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "user not found"));
    }

    const validEmail = bcryptjs.compareSync(password, validUser.password);

    if (!validEmail) {
      return next(errorHandler(404, "wrong password"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httponly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
