import axios from "axios";
import { useEffect, useState } from "react";
import ClassUser from "./ClassUser";
import { SessionType } from "@repo/validators/index";

function AllClassesUser() {
  const [sessions, setSessions] = useState<[]>([]);
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(
        "https://api-live-classes.arvindkhoisnam.com/api/v1/session/all-active",
        // "http://localhost:3000/api/v1/session/all-active",
        {
          withCredentials: true,
        }
      );
      setSessions(res.data.allSessions);
    }
    fetchData();
  }, []);
  return (
    <div className="p-6 relative">
      {sessions.length === 0 && (
        <p className="text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 text-sm font-thin">
          No live classes at the moment. Please contact admin at {""}
          <span className="text-blue-200">arvindkhoisnam23@gmail.com</span>
        </p>
      )}
      <ul className="h-[40rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950 scrollbar-thumb-rounded p-2 grid grid-cols-3 gap-2">
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
