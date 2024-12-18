import { useRecoilValue } from "recoil";
import { sessionTitle, toDisplay, userRole } from "../recoil";
import Video from "../components/Video";
import { useState } from "react";
import Canvas from "../components/Canvas";
import { Room } from "livekit-client";
import SessionControls from "../components/SessionControls";
import UserLeaveBtn from "../components/UserLeaveBtn";
import Chat from "../components/Chat";
import Whiteboard from "../components/Whiteboard";

function Session() {
  const SessionTitle = useRecoilValue(sessionTitle);
  const [videoRoom, setVideoRoom] = useState<Room | null>(null);
  const [videoOff, setVideoOff] = useState(false);
  const Role = useRecoilValue(userRole);
  const ToDisplayValue = useRecoilValue(toDisplay);
  console.log(ToDisplayValue);
  return (
    <div className="bg-neutral-950 h-screen p-4 grid grid-cols-9 gap-4">
      <div className="bg-neutral-900 h-full col-span-7 rounded-xl p-4">
        <h1 className="text-lg text-neutral-400 mb-1 font-thin">
          {SessionTitle}
        </h1>
        {ToDisplayValue === "video" ? (
          <Video setVideoRoom={setVideoRoom} />
        ) : ToDisplayValue === "image" ? (
          <Canvas />
        ) : (
          <Whiteboard />
        )}

        {Role === "admin" ? (
          <SessionControls
            setVideoOff={setVideoOff}
            videoRoom={videoRoom}
            videoOff={videoOff}
          />
        ) : (
          <UserLeaveBtn videoRoom={videoRoom} />
        )}
      </div>
      <div className="bg-neutral-900 h-full col-span-2 rounded-xl grid grid-rows-4 p-3 gap-2">
        {ToDisplayValue === "board" || ToDisplayValue === "image" ? (
          <Video setVideoRoom={setVideoRoom} />
        ) : null}
        <Chat />
      </div>
    </div>
  );
}

export default Session;
