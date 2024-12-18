import { WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { SessionManager } from "./SessionManager";

export class User {
  id: string;
  userRole: "admin" | "user" | null;
  socket: WebSocket;

  constructor(ws: WebSocket) {
    this.id = genId();
    this.userRole = null;
    this.socket = ws;
    this.init();
  }

  private init() {
    this.socket.on("message", (data) => {
      const parsed = JSON.parse(data as unknown as string);
      switch (parsed.event) {
        case "join":
          const user = jwt.verify(parsed.payload.jwtToken, "jwtSecret");
          if (!user) {
            this.socket.close();
          }
          this.userRole = parsed.payload.role;
          SessionManager.getInstance().addUser(parsed.payload.sessionId, this);
          break;
        case "leave":
          SessionManager.getInstance().userLeft(parsed.payload.sessionId, this);
          break;
        case "image-open":
          SessionManager.getInstance().imageOpen(parsed.payload.sessionId);
          break;
        case "image-close":
          SessionManager.getInstance().imageClose(parsed.payload.sessionId);
          break;
        case "whiteBoard-open":
          SessionManager.getInstance().whiteBoardOpen(parsed.payload.sessionId);
          break;
        case "whiteBoard-close":
          SessionManager.getInstance().whiteBoardClose(
            parsed.payload.sessionId
          );
          break;
        case "start-drawing-board":
          SessionManager.getInstance().startWhiteBoard(
            parsed.payload.sessionId,
            parsed.payload.x,
            parsed.payload.y
          );
          break;
        case "move-drawing-board":
          SessionManager.getInstance().moveWhiteBoard(
            parsed.payload.sessionId,
            parsed.payload.x,
            parsed.payload.y
          );
          break;
        case "image-load":
          SessionManager.getInstance().imageLoad(
            parsed.payload.sessionId,
            parsed.payload.imgUrl
          );
          break;
        default:
          break;
      }
    });
  }
}
function genId() {
  return Math.random().toString(34).slice(2);
}
