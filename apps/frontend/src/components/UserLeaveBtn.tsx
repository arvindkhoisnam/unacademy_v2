import { LuDoorOpen } from "react-icons/lu";
import { Room } from "livekit-client";
import { useNavigate } from "react-router-dom";

function UserLeaveBtn({ videoRoom }: { videoRoom: Room | null }) {
  const navigate = useNavigate();
  function leaveRoom() {
    videoRoom?.disconnect();
    navigate(-1);
  }
  return (
    <div className="flex justify-end p-4">
      <div className="group flex flex-col items-center cursor-pointer">
        <LuDoorOpen
          className="text-2xl text-rose-700 hover:scale-125"
          onClick={leaveRoom}
        />
        <span className="text-neutral-500 text-sm">Leave</span>
      </div>
    </div>
  );
}

export default UserLeaveBtn;
