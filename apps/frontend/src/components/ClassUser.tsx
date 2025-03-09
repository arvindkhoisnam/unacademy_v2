import axios from "axios";
import { MdOnlinePrediction } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  imageCurrPage,
  imageUrls,
  sessionTitle,
  socket,
  toDisplay,
  whiteBoardState,
} from "../recoil";
import { useSetRecoilState } from "recoil";
import { useState } from "react";

function ClassUser({ title, sessionId }: { title: string; sessionId: string }) {
  const navigate = useNavigate();
  const setSessionTitle = useSetRecoilState(sessionTitle);
  const setSocket = useSetRecoilState(socket);
  const setToDisplay = useSetRecoilState(toDisplay);
  const setImageUrls = useSetRecoilState(imageUrls);
  const setCurrPage = useSetRecoilState(imageCurrPage);
  const setWhiteBoardState = useSetRecoilState(whiteBoardState);
  const [loading, setLoading] = useState(false);

  async function joinSession() {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/${sessionId}/join`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.currentState.state === "image-open") {
        setImageUrls(res.data.currentState.payload[0].imgUrl);
        setCurrPage(res.data.currentState.payload[0].currPage);
        setToDisplay("image");
      } else if (res.data.currentState.state === "image-close") {
        setToDisplay("video");
      } else if (res.data.currentState.state === "board-open") {
        setWhiteBoardState(res.data.currentState.payload);
        setToDisplay("board");
      } else if (res.data.currentState.state === "board-close") {
        setToDisplay("video");
      }
      setSessionTitle(res.data.sessionTitle);
      const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}`);
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            event: "join",
            payload: {
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
        ws.onclose = () => {
          clearInterval(heartbeat);
        };
        setSocket(ws);
      };
      setLoading(false);
      navigate(`/session/${sessionId}`);
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        if (err.status === 403) {
          alert("Acces denied by admin");
        }
      } else {
        throw new Error(String(err));
      }
    }
  }
  return (
    // <li className="mb-2 px-4 py-3 rounded-xl bg-zinc-900 max-h-72 min-w-80">
    <li className="mb-2 px-4 py-3 rounded-xl max-w-80 bg-zinc-900">
      <div className="flex justify-between mb-10 flex-wrap">
        <span className="text-zinc-300 font-thin text-xl md:text-4xl tracking-tight">
          {title}
        </span>
        <div
          className={`flex items-center gap-2 font-thin text-base md:text-lg tracking-tight text-blue-300`}
        >
          <MdOnlinePrediction />
          <span>Active</span>
        </div>
      </div>
      <p className="text-zinc-300 text-[10px] md:text-sm tracking-tight leading-5 font-thin mb-10">
        <span className="text-blue-300">Description:</span> Lorem ipsum dolor
        sit amet consectetur adipisicing elit. Sed autem non tenetur! Mollitia
        illo aut voluptatum, quas, voluptas illum soluta nemo vel qui aperiam
        ducimus incidunt minima, obcaecati ex! Hic.
      </p>
      <div className="flex w-full gap-2">
        <button
          onClick={joinSession}
          className={`bg-blue-100 hover:bg-blue-200 py-3 rounded-lg text-neutral-950 font-thin w-full text-[10px] md:text-sm ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loading ? "Joining..." : "Join"}
        </button>
      </div>
    </li>
  );
}

export default ClassUser;
