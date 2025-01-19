import { useRecoilValue } from "recoil";
import { currUser, userRole } from "../recoil";
import { Link, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { LiaSchoolSolid } from "react-icons/lia";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
function Sidebar() {
  const Role = useRecoilValue(userRole);
  const CurrUser = useRecoilValue(currUser);
  const navigate = useNavigate();
  async function logout() {
    await axios.post(
      "https://api-live-classes.arvindkhoisnam.com/api/v1/logout",
      {},
      { withCredentials: true }
    );
    navigate("/signin");
  }
  return (
    <div className="hidden lg:block relative h-full bg-zinc-950 col-span-1 p-2 min-w-44 border-r border-zinc-900">
      <div className="flex items-end gap-2 text-blue-200 justify-start p-4">
        <LiaSchoolSolid className="text-3xl md:text-3xl" />
        <span className="text-xl md:text-xl">LiveClasses</span>
      </div>
      <div className="flex flex-col text-zinc-200 gap-4 px-4 mt-10">
        <Link
          to="/dashboard/all-classes"
          className="hover:bg-zinc-900 rounded-lg py-2 px-3 font-thin text-xs"
        >
          All Classes
        </Link>
        {Role === "admin" && (
          <Link
            to="/dashboard/admin"
            className="hover:bg-zinc-900 rounded-lg py-2 px-3 font-thin text-xs"
          >
            Admin
          </Link>
        )}
        <Link
          to="/dashboard/profile"
          className="hover:bg-zinc-900 rounded-lg py-2 px-3 font-thin text-xs"
        >
          Profile
        </Link>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuContent
            side="top"
            sideOffset={8}
            className="bg-blue-100 border-0"
          >
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer bg-blue-100 text-xs text-zinc-950 focus:bg-blue-200 focus:text-zinc-950 flex justify-center"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DropdownMenuTrigger>
            <CiLogout className="text-neutral-300 text-2xl cursor-pointer hover:scale-110" />
          </DropdownMenuTrigger>
        </DropdownMenu>
        <span className="text-neutral-300 font-thin text-xs">{CurrUser}</span>
      </div>
    </div>
  );
}

export default Sidebar;
