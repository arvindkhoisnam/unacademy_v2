import express from "express";
import { route } from "./routes";
import cors from "cors";
import { createClient } from "redis";
import cookieParser from "cookie-parser";
require("dotenv").config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
export const redisPublisher = createClient({
  url: process.env.REDIS_URL,
});
export const redisSubscriber = createClient({
  url: process.env.REDIS_URL,
});

(async () => {
  await redisClient.connect();
  await redisPublisher.connect();
  await redisSubscriber.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  console.log("Redis connected");
})();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.29.143:5173",
  "https://live-classes.arvindkhoisnam.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(origin);
      if (allowedOrigins.includes(origin!) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type, Authorization, X-Requested-With"],
    methods: ["GET, POST, PUT, DELETE, OPTIONS"],
    optionsSuccessStatus: 204,
  })
);

// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Requested-With"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.sendStatus(204);
// });

app.use(cookieParser());
app.use("/api/v1/", route);

app.get("/", (req, res) => {
  res.status(200).send("Healthy server.");
});
app.listen(3000, () => console.log("HTTP running on port 3000"));
