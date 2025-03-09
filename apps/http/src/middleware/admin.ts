import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookie = req.cookies;
  let token = cookie.token;
  if (!token) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token!, process.env.JWT_SECRET! as string) as {
      id: string;
      role: string;
    };
    if (decoded.role !== "admin") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    req.userId = decoded.id;
    req.jwtToken = token;
    next();
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
}
