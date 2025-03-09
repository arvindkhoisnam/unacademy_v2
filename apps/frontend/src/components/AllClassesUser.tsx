import { useEffect, useState } from "react";
import ClassUser from "./ClassUser";
import { SessionType } from "@repo/validators/index";
import { useQuery } from "@tanstack/react-query";
import { getAllUserClasses } from "@/actions";

function AllClassesUser() {
  const [sessions, setSessions] = useState<[]>([]);

  const { data, isFetching } = useQuery({
    queryKey: ["liveClasses"],
    queryFn: getAllUserClasses,
  });

  useEffect(() => {
    if (!isFetching && data?.data.allSessions) {
      setSessions(data.data.allSessions);
    }
  }, [data?.data.allSessions, isFetching]);
  return (
    <div className="p-6">
      {isFetching && (
        <p className="text-center text-xs font-thin text-blue-200">
          checking for live classes...
        </p>
      )}
      {!isFetching && sessions.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="text-center text-zinc-500 text-xs font-thin">
            No live classes at the moment. Please contact admin at {""}
            <span className="text-blue-200">arvindkhoisnam23@gmail.com</span>
          </p>
        </div>
      )}
      {/* <ul className="h-[40rem] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950 scrollbar-thumb-rounded p-2 grid grid-cols-3 gap-2 bg-lime-500"> */}
      <ul className="">
        {!isFetching &&
          sessions.map((session: SessionType, index) => (
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
