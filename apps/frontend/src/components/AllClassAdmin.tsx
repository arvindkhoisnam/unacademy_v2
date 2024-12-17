import axios from "axios";
import { useEffect, useState } from "react";
import ClassAdmin from "./ClassAdmin";

function AllClassAdmin() {
  const [sessions, setSessions] = useState<[]>([]);
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3000/api/v1/session/all", {
        withCredentials: true,
      });
      setSessions(res.data.allSessions);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 rounded-xl border border-neutral-700">
      <h2 className="text-center mb-10 text-neutral-400 text-xl font-thin">
        All Classes
      </h2>
      <ul className="h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 scrollbar-thumb-rounded p-2">
        {sessions.length &&
          sessions.map((session, index) => (
            <ClassAdmin
              title={session.title}
              status={session.status}
              sessionId={session.sessionId}
              key={index}
            />
          ))}
      </ul>
    </div>
  );
}

export default AllClassAdmin;
