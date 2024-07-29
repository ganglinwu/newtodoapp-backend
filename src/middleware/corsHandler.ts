import { Request, Response, NextFunction } from "express";

export function corsHandler(req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); //TODO: response header needs to be updated
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Set-Cookie, Content-Type, Accept, Authorization, Charset",
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
}
