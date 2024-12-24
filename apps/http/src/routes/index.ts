import express from "express";
import { db } from "@repo/db/db";
import bcrypt from "bcryptjs";
import { adminMiddleware } from "../middleware/admin";
import jwt from "jsonwebtoken";
import { sessionRoute } from "./session";
import e from "express";
import { userMiddleware } from "../middleware/user";
import { SignupCreds, SigninCreds } from "@repo/validators/index";

require("dotenv").config();

const route = express.Router();

route.use("/session", sessionRoute);

route.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  const validCreds = SignupCreds.safeParse({ username, password, email });

  if (!validCreds.success) {
    res.status(400).json({ message: "Invalid credentials." });
    return;
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await db.user.create({
    data: {
      username,
      password: hashedPassword,
      email,
      role: "user",
    },
  });

  res.status(200).json({
    message: "User created successfully",
    userId: newUser.id,
    email: newUser.email,
  });
});

route.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  const validCreds = SigninCreds.safeParse({ username, password });
  if (!validCreds.success) {
    res.status(400).json({ message: "Invalid credentials." });
    return;
  }
  try {
    const userFound = await db.user.findUnique({ where: { username } });

    if (!userFound) {
      res.status(403).json({ message: "Invalid username or password" });
      return;
    }
    const correcPassword = bcrypt.compareSync(password, userFound!.password);
    if (!correcPassword) {
      res.status(403).json({ message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign(
      {
        id: userFound.id,
        role: userFound.role,
      },
      process.env.JWT_SECRET!
    );
    res.cookie("token", token, { sameSite: "lax", httpOnly: true });
    res.status(200).json({
      message: "Successfully signed in.",
      role: userFound.role,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occured while signing up.", error: err });
  }
});
route.get("/user", userMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  try {
    const user = await db.user.findFirst({ where: { id: userId } });
    if (!user) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).json({ username: user?.username });
  } catch (err) {
    console.log(err);
    throw new Error("An error occured.");
  }
});

route.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Successfully logged out." });
});
export { route };
