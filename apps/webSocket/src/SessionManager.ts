import { User } from "./User";

export class SessionManager {
  static instance: SessionManager;
  sessions: Map<string, User[]> = new Map();

  constructor() {
    this.sessions = new Map();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new SessionManager();
    }
    return this.instance;
  }

  addUser(sessionId: string, user: User) {
    if (this.sessions.get(sessionId)) {
      this.sessions.set(sessionId, [
        ...(this.sessions.get(sessionId) ?? []),
        user,
      ]);
    } else {
      this.sessions.set(sessionId, [user]);
    }
  }

  userLeft(sessionId: string, user: User) {
    this.sessions.set(
      sessionId,
      this.sessions.get(sessionId)?.filter((x) => x.id !== user.id) || []
    );
  }
  imageOpen(sessionId: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "image-open" }));
      }
    });
  }
  imageLoad(sessionId: string, urls: string[]) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({ event: "image-load", payload: { imgUrl: urls } })
        );
      }
    });
  }
  imageClose(sessionId: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "image-close" }));
      }
    });
  }
  whiteBoardOpen(sessionId: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-open" }));
      }
    });
  }
  whiteBoardClose(sessionId: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-close" }));
      }
    });
  }
  startWhiteBoard(sessionId: string, x: string, y: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "start-drawing-board",
            payload: {
              x: x,
              y: y,
            },
          })
        );
      }
    });
  }
  moveWhiteBoard(sessionId: string, x: string, y: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "move-drawing-board",
            payload: {
              x: x,
              y: y,
            },
          })
        );
      }
    });
  }
}
