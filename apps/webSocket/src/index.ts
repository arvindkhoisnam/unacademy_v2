import { WebSocketServer } from "ws";
import { User } from "./User";

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
  new User(ws);
});

wss.on("listening", () => console.log("WebSocket running on port 3001"));
