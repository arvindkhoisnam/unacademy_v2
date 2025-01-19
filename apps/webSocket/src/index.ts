import { WebSocketServer } from "ws";
import { User } from "./User";
import { Kafka } from "kafkajs";

const wss = new WebSocketServer({ port: 3001 });
// const kafka = new Kafka({ clientId: "my-app", brokers: ["localhost:9092"] });
const kafka = new Kafka({
  clientId: "my-app",
  // brokers: ["kafka-container:9092"],
  brokers: ["my-kafka.my-kafka.svc.cluster.local:9092"],
});
const producer = kafka.producer();
wss.on("connection", async (ws) => {
  const u = new User(ws);
  ws.onclose = () => {
    console.log(`${u.username} left.`);
    u.destroy();
  };
});

(async () => {
  await producer.connect();
  console.log("kafka producer running.");
})();

wss.on("listening", () => console.log("WebSocket running on port 3001"));
export { producer };
