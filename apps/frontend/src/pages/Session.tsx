import { useRecoilValue } from "recoil";
import { sessionTitle, socket, toDisplay, userRole } from "../recoil";
import Video from "../components/Video";
import { useEffect, useState } from "react";
import Canvas from "../components/Canvas";
import { Room } from "livekit-client";
import SessionControls from "../components/SessionControls";
import UserLeaveBtn from "../components/UserLeaveBtn";
import Whiteboard from "../components/Whiteboard";
import { ToastContainer } from "react-toastify";
import SecondarySessControl from "../components/SecondarySessControl";
import { useNavigate } from "react-router-dom";
import ParticipantControl from "@/components/ParticipantControl";
function Session() {
  const SessionTitle = useRecoilValue(sessionTitle);
  const [videoRoom, setVideoRoom] = useState<Room | null>(null);
  const Role = useRecoilValue(userRole);
  const ToDisplayValue = useRecoilValue(toDisplay);
  const Socket = useRecoilValue(socket);

  const navigate = useNavigate();
  useEffect(() => {
    if (!Socket) {
      return;
    }

    function handleEvent(message: MessageEvent) {
      const parsed = JSON.parse(message.data as unknown as string);
      if (parsed.event === "removed") {
        console.log("remove");
        alert("You have been removed by the admin.");
        navigate("/dashboard/all-classes");
      }
    }
    Socket.addEventListener("message", handleEvent);

    return () => {
      Socket.removeEventListener("message", handleEvent);
    };
  }, [Socket, navigate]);

  return (
    <>
      <div className="bg-zinc-950 h-screen ">
        <div className="bg-zinc-950 h-full p-4 relative">
          <h1 className="text-2xl text-zinc-200 font-thin">{SessionTitle}</h1>
          {ToDisplayValue === "video" ? (
            <Video setVideoRoom={setVideoRoom} />
          ) : ToDisplayValue === "image" ? (
            <Canvas />
          ) : (
            <Whiteboard />
          )}
          <div className=" flex justify-center gap-2">
            {Role === "admin" ? (
              <div className="flex items-center gap-2">
                <SessionControls videoRoom={videoRoom} />
                <ParticipantControl />
                <SecondarySessControl />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <UserLeaveBtn videoRoom={videoRoom} />
                <SecondarySessControl />
              </div>
            )}
          </div>
          {ToDisplayValue === "board" || ToDisplayValue === "image" ? (
            <div className="h-44 w-60 bg-zinc-950 absolute top-16 right-6 rounded-lg">
              <Video setVideoRoom={setVideoRoom} />
            </div>
          ) : null}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default Session;
