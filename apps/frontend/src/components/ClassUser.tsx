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

function ClassUser({ title, sessionId }: { title: string; sessionId: string }) {
  const navigate = useNavigate();
  const setSessionTitle = useSetRecoilState(sessionTitle);
  const setSocket = useSetRecoilState(socket);
  const setToDisplay = useSetRecoilState(toDisplay);
  const setImageUrls = useSetRecoilState(imageUrls);
  const setCurrPage = useSetRecoilState(imageCurrPage);
  const setWhiteBoardState = useSetRecoilState(whiteBoardState);

  async function joinSession() {
    const res = await axios.post(
      `http://localhost:3000/api/v1/session/${sessionId}/join`,
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
    const ws = new WebSocket("ws://localhost:3001");
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
      setSocket(ws);
    };
    navigate(`/session/${sessionId}`);
  }
  return (
    <li className="mb-2 px-4 py-3 rounded-xl bg-zinc-900 max-h-72 min-w-80">
      <div className="flex justify-between mb-10 flex-wrap">
        <span className="text-zinc-300 font-thin text-4xl tracking-tight">
          {title}
        </span>
        <div
          className={`flex items-center gap-2 font-thin text-lg tracking-tight text-blue-300`}
        >
          <MdOnlinePrediction />
          <span>Active</span>
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
          onClick={joinSession}
          className={`bg-blue-100 hover:bg-blue-200 py-3 rounded-lg text-neutral-950 font-thin cursor-pointer w-full text-sm`}
        >
          Join
        </button>
      </div>
    </li>
  );
}

export default ClassUser;
