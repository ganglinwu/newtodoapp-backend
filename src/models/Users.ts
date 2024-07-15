import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
  },
  { collection: "users" },
);
export const userModel = mongoose.model("user", userSchema);
