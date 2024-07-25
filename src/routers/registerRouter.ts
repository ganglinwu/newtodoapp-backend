import express from "express";
import bcrypt from "bcrypt";

import { userModel } from "../models/Users";

export const registerRouter = express.Router();

registerRouter.post("(.html)?", async (req, res) => {
  const { userName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new userModel({
    userName: userName,
    email: email,
    password: hashedPassword,
    dataCreated: new Date(),
  });

  try {
    await newUser.save();
    res.status(201).json({
      message: "new user successfully created",
      userName: userName,
      email: email,
      dateCreated: newUser.dateCreated,
    });
  } catch (err) {
    logging.info("There was an error posting new user to database");
    logging.error(err);
    if (err.errorResponse.code === 11000) {
      res.status(400).json({
        message:
          "The username already exists, please try again with another username",
      });
    } else {
      res
        .status(500)
        .json({ message: "There was an error posting new user to database" });
    }
  }
});
