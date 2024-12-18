import { randomUUID } from "crypto";
declare global {
  namespace Express {
    export interface Request {
      role?: "admin" | "user";
      userId?: string;
      jwtToken?: string;
    }
  }
}

export function generateSessionId() {
  const alphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  );
  let id: string = "";

  for (let section = 0; section < 3; section++) {
    for (let i = 0; i < 3; i++) {
      const rand = Math.floor(Math.random() * 26);
      id += alphabets[rand];
    }
    if (section < 2) {
      id += "-";
    }
  }
  return id;
}

export function generateTaskId() {
  return randomUUID();
}
