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

          if (payload.event === "board-open") {
            const currRoomState = await db.currentRoomState.create({
              data: {
                event: payload.event,
                epoch: payload.timeStamp,
                session_Id: payload.sessionId,
              },
            });
          } else if (payload.event === "mouse-move") {
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
            };
            buffer.push(p);
            if (buffer.length >= maxBatch) {
              const res = await db.payload.createMany({ data: buffer });
              buffer = [];
            }
          } else {
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
