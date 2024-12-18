import { GiExitDoor } from "react-icons/gi";
import { Room } from "livekit-client";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socket } from "../recoil";

function UserLeaveBtn({ videoRoom }: { videoRoom: Room | null }) {
  const navigate = useNavigate();
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();
  function leaveRoom() {
    videoRoom?.disconnect();
    Socket?.send(
      JSON.stringify({
        event: "leave",
        payload: {
          sessionId: sessionId,
        },
      })
    );
    navigate(-1);
  }
  return (
    <div className="flex justify-end p-4">
      <div className="group flex flex-col items-center cursor-pointer">
        <GiExitDoor
          className="text-xl text-rose-700 hover:scale-110"
          onClick={leaveRoom}
        />
        <span className="text-neutral-500 text-sm">Leave</span>
      </div>
    </div>
  );
}

export default UserLeaveBtn;
