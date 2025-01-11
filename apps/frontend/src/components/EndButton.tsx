import { MdCallEnd } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
function EndButton({ endClass }: { endClass: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuContent
        side="top"
        sideOffset={8}
        className="bg-rose-600 border-0"
      >
        <DropdownMenuItem
          onClick={endClass}
          className="cursor-pointer bg-rose-600 text-xs text-zinc-200 focus:bg-rose-700 focus:text-zinc-200 flex justify-center"
        >
          End Class
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DropdownMenuTrigger>
        <div className="group flex flex-col items-center cursor-pointer">
          <MdCallEnd className="text-rose-500 text-sm" />
          <span className="text-zinc-600 text-xs group-hover:text-rose-500 font-thin">
            End
          </span>
        </div>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}

export default EndButton;
