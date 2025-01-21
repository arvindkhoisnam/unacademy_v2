import { WebSocketServer } from "ws";
import { User } from "./User";
import { Kafka } from "kafkajs";
import { createClient } from "redis";
import { SessionManager } from "./SessionManager";

const wss = new WebSocketServer({ port: 3001 });
// const kafka = new Kafka({ clientId: "my-app", brokers: ["localhost:9092"] });
const kafka = new Kafka({
  clientId: "my-app",
  // brokers: ["kafka-container:9092"],
  brokers: ["my-kafka.my-kafka.svc.cluster.local:9092"],
});
const redisSubscriber = createClient({
  url: "redis://redis-container:6379",
});
const redisPublisher = createClient({
  url: "redis://redis-container:6379",
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
  await redisSubscriber.connect();
  redisSubscriber.on("error", (err) => console.log("Redis sub Error", err));
  await redisPublisher.connect();
  redisSubscriber.on("error", (err) => console.log("Redis pub Error", err));
  console.log("Redis connected");
})();

redisSubscriber.subscribe("join-request", (message) => {
  const parsed = JSON.parse(message);
  console.log(parsed);
  SessionManager.getInstance()
    .sessions.get(parsed.sessionId)
    ?.forEach((u) => {
      if (u.userRole === "admin") {
        u.socket.send(
          JSON.stringify({
            user: parsed.username,
          })
        );
      }
    });
});
wss.on("listening", () => console.log("WebSocket running on port 3001"));
export { producer, redisPublisher };
