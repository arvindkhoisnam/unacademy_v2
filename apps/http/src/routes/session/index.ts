import express from "express";
import { generateSessionId, generateTaskId } from "../../../utils/utils";
import { db } from "@repo/db/db";
import { adminMiddleware } from "../../middleware/admin";
import multer from "multer";
import { redisClient } from "../..";
import { RoomServiceClient, AccessToken } from "livekit-server-sdk";
import { userMiddleware } from "../../middleware/user";
require("dotenv").config();

const devkey = process.env.LIVE_KIT_KEY;
const secret = process.env.LIVE_KIT_SECRET;

const route = express();
const livekitHost = "http://localhost:7880";
const svc = new RoomServiceClient(livekitHost, devkey, secret);

async function adminVideoToken(roomName: string, participantName: string) {
  const at = new AccessToken(devkey, secret, {
    identity: participantName,
    ttl: "10m",
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });
  return await at.toJwt();
}
async function userVideoToken(roomName: string, participantName: string) {
  const at = new AccessToken(devkey, secret, {
    identity: participantName,
    ttl: "10m",
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: false,
    canPublishData: false,
    canSubscribe: true,
  });
  return await at.toJwt();
}
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.post("/", adminMiddleware, async (req, res) => {
  const { title } = req.body;
  const sessionId = generateSessionId();
  await db.session.create({
    data: {
      sessionId,
      title,
    },
  });
  res.status(200).json({
    sessionId,
  });
});
route.get("/all", adminMiddleware, async (req, res) => {
  const allSessions = await db.session.findMany();
  res.status(200).json({ allSessions });
});
route.get("/all-active", userMiddleware, async (req, res) => {
  const allSessions = await db.session.findMany({
    where: { status: "active" },
  });
  res.status(200).json({ allSessions });
});

route.post("/:sessionId/start", adminMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  const user = await db.user.findFirst({ where: { id: req.userId } });
  if (!sessionId) {
    return;
  }
  if (!user) {
    return;
  }

  await db.session.update({
    where: { sessionId: sessionId },
    data: { status: "active" },
  });
  const opts = {
    name: sessionId,
    emptyTimeout: 10 * 60,
    maxParticipants: 20,
    canPublish: true,
    canSubscribe: true,
  };
  const room = await svc.createRoom(opts);
  const token = await adminVideoToken(sessionId, user.username);
  res
    .status(200)
    .json({ message: "Session started successfully.", room, token });
});

route.post("/:sessionId/join", userMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  const user = await db.user.findFirst({ where: { id: req.userId } });
  if (!sessionId) {
    return;
  }
  if (!user) {
    return;
  }
  const token = await userVideoToken(sessionId, user.username);
  res.status(200).json({ message: "Session joined successfully.", token });
});

route.post("/:sessionId/end", adminMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return;
  }
  await db.session.update({
    where: {
      sessionId: sessionId,
    },
    data: {
      status: "inactive",
    },
  });

  svc.deleteRoom(sessionId);
  res.status(200).json({ message: "Session ended successfully" });
});

route.post("/:sessionId/slides/pdf", upload.single("file"), (req, res) => {
  const { sessionId } = req.params;
  const file = req.file;
  const taskId = generateTaskId();
  const payload = {
    sessionId,
    file,
    taskId,
  };
  redisClient.lPush("pdfUpload", JSON.stringify(payload));
  res.status(200).json({ message: "Image uploading", taskId });
});

route.get("/task/:taskId", adminMiddleware, async (req, res) => {
  const { taskId } = req.params;

  try {
    const images = await db.image.findMany({ where: { taskId } });

    if (images.length > 0) {
      res.status(200).json({ images, status: "completed" });
      return;
    } else {
      res.status(200).json({ status: "in_progress" });
      return;
    }
  } catch (err) {
    res.status(500).json({ status: "failed", error: err });
    return;
  }
});

export { route as sessionRoute };
