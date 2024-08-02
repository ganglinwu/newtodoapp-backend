import express from "express";

export const logoutRouter = express.Router();

logoutRouter.get("(.html)?", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.end();
});
