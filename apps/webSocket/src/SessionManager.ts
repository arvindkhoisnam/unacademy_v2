import { User } from "./User";
import { producer } from ".";

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
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "image-open",
            imgUrl: urls,
            currPage: 0,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({ event: "image-load", payload: { imgUrl: urls } })
        );
      }
    });
  }
  imageNextPage(sessionId: string, currPage: number, urls: string[]) {
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "image-open",
            imgUrl: urls,
            currPage: currPage,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "image-next-page",
            payload: {
              currPage,
            },
          })
        );
      }
    });
  }
  imagePrevPage(sessionId: string, currPage: number, urls: string[]) {
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "image-open",
            imgUrl: urls,
            currPage: currPage,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "image-prev-page",
            payload: {
              currPage,
            },
          })
        );
      }
    });
  }
  imageClose(sessionId: string) {
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "image-close",
            imgUrl: [],
            currPage: 0,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "image-close" }));
      }
    });
  }
  whiteBoardOpen(sessionId: string) {
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "board-open",
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-open" }));
      }
    });
  }
  whiteBoardClose(sessionId: string) {
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "board-close",
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-close" }));
      }
    });
  }
  whiteBoardDraw(sessionId: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-draw" }));
      }
    });
  }
  startWhiteBoard(
    sessionId: string,
    x: string,
    y: string,
    height: string,
    width: string
  ) {
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "mouse-move",
            x: x,
            y: y,
            adminHeight: height,
            adminWidth: width,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "start-drawing-board",
            payload: {
              x: x,
              y: y,
              adminHeight: height,
              adminWidth: width,
            },
          })
        );
      }
    });
  }
  moveWhiteBoard(
    sessionId: string,
    x: string,
    y: string,
    height: string,
    width: string
  ) {
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "mouse-move",
            x: x,
            y: y,
            adminHeight: height,
            adminWidth: width,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "move-drawing-board",
            payload: {
              x: x,
              y: y,
              adminHeight: height,
              adminWidth: width,
            },
          })
        );
      }
    });
  }
  whiteBoardColorChange(sessionId: string, color: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "whiteBoard-color-change",
            payload: {
              strokeStyle: color,
            },
          })
        );
      }
    });
  }
  whiteBoardErase(sessionId: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-erase" }));
      }
    });
  }
  whiteBoardClear(sessionId: string) {
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-clear" }));
      }
    });
  }

  message(sessionId: string, content: { user: string; text: string }) {
    this.sessions.get(sessionId)?.forEach((user) => {
      user.socket.send(
        JSON.stringify({ event: "message", payload: { content: content } })
      );
    });
  }
}
