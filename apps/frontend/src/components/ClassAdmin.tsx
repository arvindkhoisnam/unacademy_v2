import axios from "axios";
import { MdOnlinePrediction } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { sessionTitle, socket, userRole } from "../recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";

function ClassAdmin({
  title,
  status,
  sessionId,
}: {
  title: string;
  status: string;
  sessionId: string;
}) {
  const Role = useRecoilValue(userRole);
  const navigate = useNavigate();
  const setSessionTitle = useSetRecoilState(sessionTitle);
  const setSocket = useSetRecoilState(socket);

  async function startSession() {
    const res = await axios.post(
      `http://localhost:3000/api/v1/session/${sessionId}/start`,
      {},
      {
        withCredentials: true,
      }
    );
    setSessionTitle(res.data.sessionTitle);
    // setVideoToken(res.data.token);
    const ws = new WebSocket("ws://localhost:3001");
    ws.onopen = () => {
      console.log("connected to ws");
      ws.send(
        JSON.stringify({
          event: "join",
          payload: {
            role: Role,
            sessionId: sessionId,
            jwtToken: res.data.jwtToken,
          },
        })
      );
      setSocket(ws);
    };
    navigate(`/session/${sessionId}`);
  }
  return (
    <li className="border border-neutral-700 mb-2 px-4 py-2 flex justify-between items-center rounded-xl">
      <div className="flex flex-col gap-3">
        <span className="text-neutral-300 font-thin">{title}</span>
        <div
          className={`${status === "active" ? "text-green-600" : "text-neutral-600"} flex items-center gap-2 font-thin`}
        >
          {status === "active" && <MdOnlinePrediction />}
          <span>{status}</span>
        </div>
      </div>
      <button
        onClick={() => status !== "active" && startSession()}
        className={`${status === "active" ? "bg-rose-800" : "bg-neutral-300"}  px-3 py-1 rounded-lg text-neutral-950 font-thin cursor-pointer`}
      >
        {status === "active" ? "End" : "Start"}
      </button>
    </li>
  );
}

export default ClassAdmin;
