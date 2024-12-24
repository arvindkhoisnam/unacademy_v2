import axios from "axios";
import { MdOnlinePrediction } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  imageCurrPage,
  imageUrls,
  sessionTitle,
  socket,
  toDisplay,
  userRole,
  whiteBoardState,
} from "../recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";

function ClassUser({ title, sessionId }: { title: string; sessionId: string }) {
  const Role = useRecoilValue(userRole);
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
        <span className="text-neutral-300 font-thin text-xs">{title}</span>
        <div className="text-green-600 flex items-center gap-2 font-thin text-xs">
          <MdOnlinePrediction />
          <span>Active</span>
        </div>
      </div>
      <button
        onClick={() => joinSession()}
        className="bg-neutral-300 px-3 py-1 rounded-lg text-neutral-950 font-thin text-xs"
      >
        Join
      </button>
    </li>
  );
}

export default ClassUser;
