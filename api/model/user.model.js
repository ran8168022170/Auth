import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      unique: false,
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6dVrrOXyx8Zf9ZYWl1ojna8zsjB98gmI1GA&s",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
