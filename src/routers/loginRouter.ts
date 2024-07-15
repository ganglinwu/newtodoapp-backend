import express from "express";
import path from "path";
import { userModel } from "../models/Users";

export const loginRouter = express.Router();

loginRouter.get("(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "/static", "/login.html"));
});

loginRouter.post("(.html)?", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await userModel.find({ userName }).exec();
  } catch (err) {
    res.status(400).json({ message: `${err}` + "username not found" });
    res.sendFile(path.join(__dirname, "..", "..", "/static", "/login.html"));
  }
});
