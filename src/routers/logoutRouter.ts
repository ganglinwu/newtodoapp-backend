import express from "express";

export const logoutRouter = express.Router();

logoutRouter.get("(.html)?", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout Success" });
  logging.log(
    `Outgoing - METHOD:[${req.method}] - URL:[${req.url}] - STATUS:[${res.statusCode}]`,
  );
});
