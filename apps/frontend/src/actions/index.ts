import axios from "axios";

async function getAllAdminClasses() {
  const { data } = await axios.get(
    "https://api-live-classes.arvindkhoisnam.com/api/v1/session/all",
    // "http://localhost:3000/api/v1/session/all",
    {
      withCredentials: true,
    }
  );
  return data;
}

async function createSession(title: string) {
  await axios.post(
    "https://api-live-classes.arvindkhoisnam.com/api/v1/session",
    // "http://localhost:3000/api/v1/session",
    {
      title: title,
    },
    { withCredentials: true }
  );
}

export { getAllAdminClasses, createSession };
