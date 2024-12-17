import { createClient } from "redis";
import pdf2pic from "pdf2pic";
import { PDFDocument } from "pdf-lib";
import { Payload } from "../types";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import { db } from "@repo/db/db";
require("dotenv").config();
const redisClient = createClient();
(async () => {
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  console.log("Redis connected");
})();

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
      const parsed: Payload = JSON.parse(data);
      const { sessionId, file, taskId } = parsed;
      const buffer = Buffer.from(file.buffer.data);
      const pdfDoc = await PDFDocument.load(buffer);
      const { width, height } = pdfDoc.getPages()[0]!.getSize();

      const options = {
        density: 600,
        saveFilename: `${file.originalname.split(".pdf")[0]}`,
        savePath: "./temp",
        format: "png",
        width: width,
        height: height,
      };

      const convert = pdf2pic.fromBuffer(buffer, options);
      const result = await convert.bulk(-1);

      const urls = [];
      for (let res of result) {
        const imageBuffer = fs.readFileSync(res.path!);

        const command = new PutObjectCommand({
          Bucket: "arvindkh-private",
          Key: `uploads/user-upload/${res.name}-1`,
          Body: imageBuffer,
          ContentType: "image/png",
        });
        await s3.send(command);

        const getCommand = new GetObjectCommand({
          Bucket: "arvindkh-private",
          Key: `uploads/user-upload/${res.name}-1`,
        });

        const url = await getSignedUrl(s3, getCommand);
        urls.push(url);
      }

      urls.forEach(async (url) => {
        await db.image.create({
          data: {
            url,
            session_Id: sessionId,
            taskId,
          },
        });
      });
    }
  }
}

init();
