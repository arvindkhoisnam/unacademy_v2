import axios from "axios";

async function getAllAdminClasses() {
  const { data } = await axios.get("http://localhost:3000/api/v1/session/all", {
    withCredentials: true,
  });
  return data;
}

async function createSession(title: string) {
  await axios.post(
    "http://localhost:3000/api/v1/session",
    {
      title: title,
    },
    { withCredentials: true }
  );
}

export { getAllAdminClasses, createSession };
