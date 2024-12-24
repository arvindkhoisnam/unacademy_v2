import { WebSocketServer } from "ws";
import { User } from "./User";
import { Kafka } from "kafkajs";

const wss = new WebSocketServer({ port: 3001 });
const kafka = new Kafka({ clientId: "my-app", brokers: ["localhost:9092"] });
const producer = kafka.producer();

wss.on("connection", async (ws) => {
  new User(ws);
});

(async () => {
  await producer.connect();
  console.log("kafka producer running.");
})();

wss.on("listening", () => console.log("WebSocket running on port 3001"));
export { producer };
