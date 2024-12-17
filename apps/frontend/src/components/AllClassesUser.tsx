import axios from "axios";
import { useEffect, useState } from "react";
import ClassUser from "./ClassUser";

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
      setSessions(res.data.allSessions);
    }
    fetchData();
  }, []);
  return (
    <div className="p-6 rounded-xl border border-neutral-700">
      <ul className="h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 scrollbar-thumb-rounded p-2">
        {sessions.map((session, index) => (
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
