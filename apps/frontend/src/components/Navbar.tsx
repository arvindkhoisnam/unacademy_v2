import { LiaSchoolSolid } from "react-icons/lia";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navbarHeight, userRole } from "@/recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef } from "react";

function Navbar() {
  const Role = useRecoilValue(userRole);
  const navigate = useNavigate();
  const setNavbarHeight = useSetRecoilState(navbarHeight);
  const ref = useRef<HTMLDivElement | null>(null);
  async function logout() {
    await axios.post(
      `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/logout`,
      {},
      { withCredentials: true }
    );
    navigate("/signin");
  }
  useEffect(() => {
    if (ref.current) {
      setNavbarHeight(ref.current.offsetHeight);
    }
  }, [setNavbarHeight]);
  return (
    <div
      className="xl:hidden sticky top-0 flex justify-between items-center z-50 bg-zinc-900 px-2 rounded-lg w-full"
      ref={ref}
    >
      <div className="flex gap-2 text-blue-200 justify-start items-center p-4">
        <LiaSchoolSolid className="text-xl" />
        <span className="text-sm font-extralight">LiveClasses</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <RxHamburgerMenu fontSize={20} color="#bfdbfe" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-zinc-800 m-2 border-none">
          <DropdownMenuItem
            className="text-[10px] font-extralight text-zinc-300"
            onClick={() => navigate("/dashboard/all-classes")}
          >
            All Classes
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-700" />
          {Role === "admin" && (
            <>
              <DropdownMenuItem
                className="text-[10px] font-extralight text-zinc-300"
                onClick={() => navigate("/dashboard/admin")}
              >
                Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-700" />
            </>
          )}

          <DropdownMenuItem
            className="text-[10px] font-extralight text-zinc-300"
            onClick={() => navigate("/dashboard/profile")}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-700" />
          <DropdownMenuItem
            className="text-[10px] font-extralight text-zinc-300"
            onClick={logout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Navbar;
