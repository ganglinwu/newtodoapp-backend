import express from "express";
import { userProjectModel } from "../models/UserProjects";
import { createData, getData } from "../controllers/dataController";

export const dataRouter = express.Router();

//get data
dataRouter.get("/", getData);

// post new data
dataRouter.post("/", createData);

//update one
dataRouter.patch("/", async (req, res) => {
  const { userName, projects } = req.body;
  try {
  } catch (error) {}
  res.json({ msg: "user data updated" });
});
