import { randomUUID } from "crypto";
import axios from "axios";
require("dotenv").config();

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

export async function getGoogleOAuthToken(code: string) {
  const values = {
    grant_type: "authorization_code",
    code,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL as string,
  };
  const urlParam = new URLSearchParams(values);

  try {
    const res = await axios.post(
      "https://oauth2.googleapis.com/token",
      urlParam
    );
    return res;
  } catch (err) {
    console.error(err);
    return;
  }
}

export async function getGoogleUserDetails(
  access_token: string,
  id_token: string
) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res;
  } catch (err) {
    console.error(err);
    return;
  }
}
