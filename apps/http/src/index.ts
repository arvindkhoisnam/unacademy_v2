import express from "express";
import { route } from "./routes";
import cors from "cors";
import { createClient } from "redis";
import cookieParser from "cookie-parser";

export const redisClient = createClient({
  url: "redis://redis-container:6379",
});

(async () => {
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  console.log("Redis connected");
})();
const app = express();
app.use(express.json());
// app.use(
//   cors({
//     credentials: true,
//     origin: [
//       "http://localhost:5173",
//       "http://192.168.29.143:5173",
//       "https://arvind-live-classes.netlify.app",
//     ],
//   })
// );

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.29.143:5173",
  "https://arvind-live-classes.netlify.app",
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
  })
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

app.use(cookieParser());
app.use("/api/v1/", route);

app.get("/", (req, res) => {
  res.status(200).send("Healthy server.");
});
app.listen(3000, () => console.log("HTTP running on port 3000"));
