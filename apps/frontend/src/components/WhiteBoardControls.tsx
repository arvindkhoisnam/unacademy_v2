import { SetStateAction } from "react";
import { socket, toDisplay } from "../recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";

function WhiteBoardControls({
  action,
  setAction,
  setColor,
  clearCanvas,
}: {
  action: string | null;
  setAction: React.Dispatch<SetStateAction<"draw" | "erase" | null>>;
  setColor: React.Dispatch<SetStateAction<string>>;
  clearCanvas: () => void;
}) {
  const setToDisplay = useSetRecoilState(toDisplay);
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();

  return (
    <div className="p-2">
      <div className="flex gap-4 items-center justify-end">
        <button
          className={`px-2 py-1 rounded-lg bg-violet-800 text-neutral-30 hover:scale-105 text-neutral-300 font-thin text-[10px] ${action === "draw" && "ring ring-offset-2 ring-violet-800"}`}
          onClick={() => {
            setAction("draw");
            setColor("black");
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-draw",
                payload: {
                  sessionId: sessionId,
                },
              })
            );
          }}
        >
          draw
        </button>
        <button
          className={`px-2 py-1 rounded-lg bg-violet-800 text-neutral-30 hover:scale-105 text-neutral-300 font-thin text-[10px] ${action === "erase" && "ring ring-offset-2 ring-violet-800"}`}
          onClick={() => {
            setColor("#d4d4d4");
            setAction("erase");
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-erase",
                payload: {
                  sessionId: sessionId,
                },
              })
            );
          }}
        >
          erase
        </button>
        <select
          disabled={action === "erase"}
          className="px-2 py-1 font-thin text-[10px] rounded-lg"
          onChange={(e) => {
            setColor(e.target.value);
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-color-change",
                payload: {
                  sessionId: sessionId,
                  strokeStyle: e.target.value,
                },
              })
            );
          }}
        >
          <option value="black">black</option>
          <option value="red">red</option>
          <option value="blue">blue</option>
        </select>
        <button
          className="px-2 py-1 rounded-lg bg-violet-800 hover:scale-105 text-neutral-300 font-thin text-[10px]"
          onClick={() => {
            clearCanvas();
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-clear",
                payload: {
                  sessionId: sessionId,
                },
              })
            );
          }}
        >
          clear
        </button>
        <button
          className="px-2 py-1 rounded-lg bg-rose-800 text-neutral-30 hover:scale-105 text-neutral-300 font-thin text-[10px]"
          onClick={() => {
            console.log("close");
            setToDisplay("video");
            Socket?.send(
              JSON.stringify({
                event: "whiteBoard-close",
                payload: {
                  sessionId: sessionId,
                },
              })
            );
          }}
        >
          close
        </button>
      </div>
    </div>
  );
}

export default WhiteBoardControls;
