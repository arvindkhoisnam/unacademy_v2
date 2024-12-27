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
    <div className="p-6 rounded-xl">
      <h2 className="mb-10 text-neutral-400 text-lg font-thin text-start">
        All Classes
      </h2>
      <ul className="h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 scrollbar-thumb-rounded p-2 text-xs">
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
