import express from "express";
import { route } from "./routes";
import cors from "cors";
import { createClient } from "redis";
import cookieParser from "cookie-parser";

export const redisClient = createClient();

(async () => {
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  console.log("Redis connected");
})();
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());
app.use("/api/v1/", route);

app.listen(3000, () => console.log("HTTP running on port 3000"));
