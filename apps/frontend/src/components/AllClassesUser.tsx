import axios from "axios";
import { useEffect, useState } from "react";
import ClassUser from "./ClassUser";
import { SessionType } from "@repo/validators/index";

function AllClassesUser() {
  const [sessions, setSessions] = useState<[]>([]);
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        "http://localhost:3000/api/v1/session/all-active",
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setSessions(res.data.allSessions);
    }
    fetchData();
  }, []);
  return (
    <div className="p-6">
      <ul className="h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 scrollbar-thumb-rounded p-2">
        {sessions.map((session: SessionType, index) => (
          <ClassUser
            title={session.title}
            sessionId={session.sessionId}
            key={index}
          />
        ))}
      </ul>
    </div>
  );
}

export default AllClassesUser;
