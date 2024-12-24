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
        case "whiteBoard-draw":
          SessionManager.getInstance().whiteBoardDraw(parsed.payload.sessionId);
          break;
        case "start-drawing-board":
          SessionManager.getInstance().startWhiteBoard(
            parsed.payload.sessionId,
            parsed.payload.x,
            parsed.payload.y,
            parsed.payload.adminHeight,
            parsed.payload.adminWidth
          );
          break;
        case "move-drawing-board":
          SessionManager.getInstance().moveWhiteBoard(
            parsed.payload.sessionId,
            parsed.payload.x,
            parsed.payload.y,
            parsed.payload.adminHeight,
            parsed.payload.adminWidth
          );
          break;
        case "whiteBoard-erase":
          console.log("erase");
          SessionManager.getInstance().whiteBoardErase(
            parsed.payload.sessionId
          );
          break;
        case "whiteBoard-color-change":
          console.log("change");
          SessionManager.getInstance().whiteBoardColorChange(
            parsed.payload.sessionId,
            parsed.payload.strokeStyle
          );
          break;
        case "whiteBoard-clear":
          console.log("clear");
          SessionManager.getInstance().whiteBoardClear(
            parsed.payload.sessionId
          );
          break;
        case "image-load":
          SessionManager.getInstance().imageLoad(
            parsed.payload.sessionId,
            parsed.payload.imgUrl
          );
          break;
        case "image-next-page":
          SessionManager.getInstance().imageNextPage(
            parsed.payload.sessionId,
            parsed.payload.currPage,
            parsed.payload.imgUrl
          );
          break;
        case "image-prev-page":
          SessionManager.getInstance().imagePrevPage(
            parsed.payload.sessionId,
            parsed.payload.currPage,
            parsed.payload.imgUrl
          );
          break;
        case "message":
          SessionManager.getInstance().message(
            parsed.payload.sessionId,
            parsed.payload.content
          );
        default:
          break;
      }
    });
  }
}
function genId() {
  return Math.random().toString(34).slice(2);
}
