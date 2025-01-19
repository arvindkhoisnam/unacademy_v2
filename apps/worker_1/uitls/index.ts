import { Payload } from "../types";
import { PDFDocument } from "pdf-lib";
import pdf2pic from "pdf2pic";
import fs from "fs";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@repo/db/db";

console.log({
  utils: process.env.AWS_ACCESS_KEY!,
  utils1: process.env.AWS_SECRET_ACCESS_KEY!,
});
export async function convertAndStore(data: string) {
  try {
    const parsed: Payload = JSON.parse(data);
    const { sessionId, file, taskId } = parsed;
    const buffer = Buffer.from(file.buffer.data);
    const pdfDoc = await PDFDocument.load(buffer);
    const { width, height } = pdfDoc.getPages()[0]!.getSize();
    console.log(width, height);
    const options = {
      density: 300,
      saveFilename: `${file.originalname.split(".pdf")[0]}`,
      savePath: "./temp",
      format: "png",
      width: width,
      height: height,
    };

    const convert = pdf2pic.fromBuffer(buffer, options);
    console.log(convert);
    const result = await convert.bulk(-1);
    console.log(result);
    console.log("conversion completed");
    return { result, sessionId, taskId };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw new Error(err.message);
    }
    throw new Error(String(err));
    console.log(err);
  }
}

export async function uploadToAWS() {}

export async function uploadImagesToS3(images: any[], s3: S3Client) {
  const uploadPromises = images.map(async (res) => {
    const imageBuffer = fs.readFileSync(res.path!);
    const key = `uploads/user-upload/${res.name}-1`;

    await s3.send(
      new PutObjectCommand({
        Bucket: "arvindkh-private",
        Key: key,
        Body: imageBuffer,
        ContentType: "image/png",
      })
    );
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: "arvindkh-private", Key: key })
    );
    return url;
  });

  return await Promise.all(uploadPromises);
}

export async function saveImageMetadata(
  urls: string[],
  sessionId: string,
  taskId: string
) {
  const savePromises = urls.map((url) =>
    db.image.create({ data: { url, session_Id: sessionId, taskId } })
  );
  await Promise.all(savePromises);
}
