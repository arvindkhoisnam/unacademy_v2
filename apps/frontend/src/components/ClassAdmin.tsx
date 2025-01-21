import axios from "axios";
import { MdOnlinePrediction } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { sessionTitle, socket, userRole } from "../recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import CheckHair from "./CheckHair";
import { useToast } from "@/hooks/use-toast";
import JoinPermission from "./JoinPermission";
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
  const { toast } = useToast();
  async function startSession() {
    const res = await axios.post(
      `https://api-live-classes.arvindkhoisnam.com/api/v1/session/${sessionId}/start`,
      // `http://localhost:3000/api/v1/session/${sessionId}/start`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log(res);
    setSessionTitle(res.data.sessionTitle);
    const ws = new WebSocket("wss://ws-api.arvindkhoisnam.com");
    ws.onopen = () => {
      console.log("connected to ws");
      console.log(new Date().toTimeString());
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
      const heartbeat = setInterval(() => {
        ws.send(
          JSON.stringify({
            event: "heartbeat",
          })
        );
      }, 55000);

      ws.onclose = (event) => {
        console.log(event);
        console.warn("WebSocket disconnected:", event.reason);
        console.log(new Date().toTimeString());
        clearInterval(heartbeat);
      };
      ws.onmessage = (message) => {
        const parsed = JSON.parse(message.data as unknown as string);
        // alert(parsed.user);
        toast({
          title: `${parsed.user} wants to join.`,
          action: <JoinPermission Socket={ws} />,
          duration: 100000000000,
        });
      };
      setSocket(ws);
    };
    navigate(`/session/${sessionId}`);
  }
  return (
    <li className="mb-2 px-4 py-3 rounded-xl bg-zinc-900 h-72">
      <div className="flex justify-between mb-10 flex-wrap">
        <span className="text-zinc-300 font-thin text-4xl tracking-tight">
          {title}
        </span>
        <div
          className={`${status === "active" ? "text-blue-300" : "text-zinc-600"} flex items-center gap-2 font-thin text-lg tracking-tight`}
        >
          {status === "active" && <MdOnlinePrediction />}
          <span>{status}</span>
        </div>
      </div>
      <p className="text-zinc-300 text-sm tracking-tight leading-5 font-thin mb-10">
        <span className="text-blue-300">Description:</span> Lorem ipsum dolor
        sit amet consectetur adipisicing elit. Sed autem non tenetur! Mollitia
        illo aut voluptatum, quas, voluptas illum soluta nemo vel qui aperiam
        ducimus incidunt minima, obcaecati ex! Hic.
      </p>
      <div className="flex w-full gap-2">
        <button
          className={`${status === "active" ? "hidden" : "block"} bg-zinc-700 hover:bg-zinc-600 py-3 rounded-lg text-zinc-300 font-thin cursor-pointer w-full text-sm`}
        >
          Delete
        </button>

        <Dialog>
          <DialogTrigger
            className={`${status === "active" ? "bg-rose-800" : "bg-blue-100 hover:bg-blue-200"} py-3 rounded-lg text-neutral-950 font-thin cursor-pointer w-full text-sm`}
          >
            {status === "active" ? "End" : "Start"}
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 flex justify-center items-center">
            <CheckHair startSession={startSession} />
          </DialogContent>
        </Dialog>
      </div>
    </li>
  );
}

export default ClassAdmin;
