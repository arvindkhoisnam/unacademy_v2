import { Kafka } from "kafkajs";
import { db } from "@repo/db/db";

const kafka = new Kafka({ clientId: "my-app", brokers: ["localhost:9092"] });

const consumer = kafka.consumer({ groupId: "events" });

let buffer: {
  x: number;
  y: number;
  adminHeight: number;
  adminWidth: number;
  currRoomStateId: string;
  epoch: number;
}[] = [];
const maxBatch = 20;
(async () => {
  try {
    await consumer.connect();
    console.log("Kafka consumer running.");

    await consumer.subscribe({ topic: "events" });
    console.log(`Subscribed to topic: events`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (!message?.value) return;

          const payload = JSON.parse(message.value.toString());
          if (!payload) {
            throw new Error("Invalid message data");
          }

          switch (payload.event) {
            case "board-open":
              await db.currentRoomState.create({
                data: {
                  event: payload.event,
                  epoch: payload.timeStamp,
                  session_Id: payload.sessionId,
                },
              });
              break;
            case "board-close":
              await db.currentRoomState.create({
                data: {
                  event: payload.event,
                  epoch: payload.timeStamp,
                  session_Id: payload.sessionId,
                },
              });
              break;
            case "board-draw":
              const x = await db.currentRoomState.findFirst({
                where: { event: "board-open" },
                orderBy: {
                  epoch: "desc",
                },
              });
              await db.payload.create({
                data: {
                  epoch: payload.timeStamp,
                  currRoomStateId: x!.id,
                  event: "board-draw",
                },
              });
              break;
            case "mouse-move":
              const board = await db.currentRoomState.findFirst({
                where: { event: "board-open" },
                orderBy: {
                  epoch: "desc",
                },
              });
              const p = {
                x: Number(payload.x),
                y: Number(payload.y),
                adminHeight: Number(payload.adminHeight),
                adminWidth: Number(payload.adminWidth),
                currRoomStateId: board!.id,
                epoch: payload.timeStamp,
                event: "mouse-move",
              };
              buffer.push(p);
              if (buffer.length >= maxBatch) {
                await db.payload.createMany({ data: buffer });
                buffer = [];
              }
              break;
            case "board-clear":
              const b = await db.currentRoomState.findFirst({
                where: { event: "board-open" },
                orderBy: {
                  epoch: "desc",
                },
              });
              await db.payload.create({
                data: {
                  epoch: payload.timeStamp,
                  currRoomStateId: b!.id,
                  event: "board-clear",
                },
              });
              break;
            case "board-erase":
              const bo = await db.currentRoomState.findFirst({
                where: { event: "board-open" },
                orderBy: {
                  epoch: "desc",
                },
              });
              await db.payload.create({
                data: {
                  epoch: payload.timeStamp,
                  currRoomStateId: bo!.id,
                  event: "board-erase",
                },
              });
              break;
            case "board-color":
              const bb = await db.currentRoomState.findFirst({
                where: { event: "board-open" },
                orderBy: {
                  epoch: "desc",
                },
              });
              await db.payload.create({
                data: {
                  epoch: payload.timeStamp,
                  currRoomStateId: bb!.id,
                  event: "board-color",
                  stroke: payload.stroke,
                },
              });
              break;
            case "image-open":
              const currRoomState = await db.currentRoomState.create({
                data: {
                  event: payload.event,
                  epoch: payload.timeStamp,
                  session_Id: payload.sessionId,
                },
              });

              await db.payload.create({
                data: {
                  currRoomStateId: currRoomState.id,
                  imgUrl: payload.imgUrl,
                  currPage: payload.currPage,
                  epoch: payload.timeStamp,
                },
              });
              break;
            case "image-close":
              await db.currentRoomState.create({
                data: {
                  event: payload.event,
                  epoch: payload.timeStamp,
                  session_Id: payload.sessionId,
                },
              });
              break;
            case "message":
              await db.chat.create({
                data: {
                  session_Id: payload.sessionId,
                  epoch: payload.timeStamp,
                  sender: payload.sender,
                  content: payload.content,
                },
              });
              break;
            default:
              break;
          }
        } catch (err) {
          console.error(`Error processing message: ${err}`);
        }
      },
    });
  } catch (err) {
    console.error(`Error initializing consumer: ${err}`);
  }
})();
