import { useEffect, useState } from "react";
import ClassAdmin from "./ClassAdmin";
import { SessionType } from "@repo/validators/index";
import { useQuery } from "@tanstack/react-query";
import { getAllAdminClasses } from "../actions";

function AllClassAdmin() {
  const [sessions, setSessions] = useState<[]>([]);
  const { data } = useQuery({
    queryKey: ["adminClasses"],
    queryFn: getAllAdminClasses,
  });
  useEffect(() => {
    if (data) {
      setSessions(data.allSessions);
    }
  }, [data]);

  return (
    // <div className="p-6 rounded-xl border border-neutral-700">
    <div className="p-6 rounded-xl bg-zinc-950">
      <h2 className="text-blue-200 text-lg font-thin text-start mb-4">
        All Sessions
      </h2>
      <ul className="overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950 scrollbar-thumb-rounded p-2 grid grid-cols-3 gap-2">
        {sessions.length &&
          sessions.map((session: SessionType, index) => (
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
