import { ServeResult } from "esbuild";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
require("dotenv").config();

export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookie = req.cookies;
  const token = cookie.token;
  if (!token) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as {
      id: string;
      role: string;
    };
    req.userId = decoded.id;
    req.jwtToken = token;
    next();
  } catch (err) {
    res.status(403).json({ message: "Unauthorized" });
  }
}
