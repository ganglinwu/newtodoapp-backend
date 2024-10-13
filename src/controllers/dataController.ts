import { userProjectModel } from "../models/UserProjects";
import { Request, Response } from "express";
import { JWT_SECRETKEY } from "../config/config";
import jwt from "jsonwebtoken";

// get data
export const getData = async (req: Request, res: Response) => {
  if (typeof JWT_SECRETKEY !== "string") {
    logging.warn(
      "attempt to getData failed because JWT_SECRETKEY is not string or cannot be found",
    );
  }
  //TODO: type safety for cookieDecoded from jwt verify
  try {
    const cookieDecoded = jwt.verify(req.cookies.accessToken, JWT_SECRETKEY!);
    logging.log(cookieDecoded);
    const data = await userProjectModel.findOne({
      userName: cookieDecoded.userName,
    });
    res.status(200).send(data);
  } catch (err) {
    //TODO: try catch cookieDecoded and then hit refresh endpoint to get new accessToken
    if (err.message === "jwt expired") {
      console.log("jwt expired caught");
    } else {
      logging.error(err.message);
    }
  }
};

// post new data
export const createData = async (req: Request, res: Response) => {
  const { userName, projects } = req.body;
  try {
    const newUserData = await userProjectModel.create({
      userName,
      projects,
    });
    res.status(201).json(newUserData);
  } catch (err) {
    res.status(400).json({ error: err.message });
    logging.error(err);
  }
};

// update one
export const updateData = async (req: Request, res: Response) => {
  // const data = await userProjectModel.findOneAndUpdate(filter, update, options)
};

// delete
