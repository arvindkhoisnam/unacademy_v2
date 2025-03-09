import { SigninType, SignupType } from "@repo/validators/index";
import axios, { AxiosError } from "axios";

async function signin(body: SigninType) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/signin`,
      body,
      {
        withCredentials: true,
      }
    );
    return res;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

async function signup(body: SignupType) {
  try {
    await axios.post(
      `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/signup`,
      body,
      {
        withCredentials: true,
      }
    );
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data.message);
    }
    throw new Error("An unknown error occured.");
  }
}
async function getAllAdminClasses() {
  const { data } = await axios.get(
    `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/all`,
    {
      withCredentials: true,
    }
  );
  return data;
}

async function getAllUserClasses() {
  const res = await axios.get(
    `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/all-active`,
    {
      withCredentials: true,
    }
  );
  return res;
}

async function createSession(title: string) {
  await axios.post(
    `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session`,
    {
      title: title,
    },
    { withCredentials: true }
  );
}

async function getMessages(sessionId: string) {
  const res = await axios.get(
    `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/${sessionId}/chat`,
    { withCredentials: true }
  );
  return res;
}
export {
  signin,
  signup,
  getAllAdminClasses,
  getAllUserClasses,
  createSession,
  getMessages,
};
