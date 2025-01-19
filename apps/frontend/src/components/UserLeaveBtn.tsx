import { Room } from "livekit-client";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socket } from "../recoil";
import { TbDoorExit } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
function UserLeaveBtn({ videoRoom }: { videoRoom: Room | null }) {
  const navigate = useNavigate();
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();
  function leaveRoom() {
    if (!Socket || !videoRoom) return;
    Socket.send(
      JSON.stringify({
        event: "leave",
        payload: {
          sessionId: sessionId,
        },
      })
    );
    Socket.close();
    videoRoom.disconnect();
    navigate(-1);
  }
  return (
    <div className="flex justify-end p-4">
      <div className="group flex flex-col items-center cursor-pointer">
        <DropdownMenu>
          <DropdownMenuContent
            side="top"
            sideOffset={8}
            className="bg-red-500 border-0"
          >
            <DropdownMenuItem
              className="cursor-pointer bg-red-500 text-xs text-zinc-200 focus:bg-red-700 focus:text-zinc-200 flex justify-center"
              onClick={leaveRoom}
            >
              Leave
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DropdownMenuTrigger>
            <TbDoorExit size={18} className="text-red-600 hover:scale-110" />
          </DropdownMenuTrigger>
        </DropdownMenu>

        <span className="text-zinc-600 text-xs font-thin">Leave</span>
      </div>
    </div>
  );
}

export default UserLeaveBtn;
