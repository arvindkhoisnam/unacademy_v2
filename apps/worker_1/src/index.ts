import { createClient } from "redis";
import { convertAndStore, saveImageMetadata, uploadImagesToS3 } from "../uitls";
import { S3Client } from "@aws-sdk/client-s3";
require("dotenv").config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

console.log({
  main: process.env.AWS_ACCESS_KEY!,
  main1: process.env.AWS_SECRET_ACCESS_KEY!,
});
async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    setTimeout(connectToRedis, 5000);
  }
}

connectToRedis();
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function init() {
  while (true) {
    const data = await redisClient.rPop("pdfUpload");
    if (data) {
      console.log("recieved data");
      const { result, sessionId, taskId } = await convertAndStore(data);
      console.log("converted");
      const urls = await uploadImagesToS3(result, s3);
      console.log("pushed to aws");
      await saveImageMetadata(urls, sessionId, taskId);
      console.log("stored in db");
    }
  }
}

init();
