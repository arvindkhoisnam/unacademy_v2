import { useRecoilValue } from "recoil";
import { currUser, userRole } from "../recoil";
import { Link, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { LiaSchoolSolid } from "react-icons/lia";
function Sidebar() {
  const Role = useRecoilValue(userRole);
  const CurrUser = useRecoilValue(currUser);
  const navigate = useNavigate();
  async function logout() {
    await axios.post(
      "http://localhost:3000/api/v1/logout",
      {},
      { withCredentials: true }
    );
    navigate("/signin");
  }
  return (
    <div className="hidden lg:block relative h-full bg-neutral-900 col-span-1 rounded-xl p-2 min-w-44">
      <div className="flex items-end gap-2 text-violet-400 justify-start p-4">
        <LiaSchoolSolid className="text-3xl md:text-3xl" />
        <span className="text-xl md:text-xl">LiveClasses</span>
      </div>
      <div className="flex flex-col text-neutral-300 gap-4 px-4 mt-10">
        <Link
          to="/dashboard/all-classes"
          className="hover:bg-neutral-800 rounded-lg py-2 px-3 font-thin text-xs"
        >
          All Classes
        </Link>
        {Role === "admin" && (
          <Link
            to="/dashboard/admin"
            className="hover:bg-neutral-800 rounded-lg py-2 px-3 font-thin text-xs"
          >
            Admin
          </Link>
        )}
        <Link
          to="/dashboard/profile"
          className="hover:bg-neutral-800 rounded-lg py-2 px-3 font-thin text-xs"
        >
          Profile
        </Link>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <CiLogout
          className="text-neutral-300 text-2xl cursor-pointer hover:scale-110"
          onClick={logout}
        />
        <span className="text-neutral-300 font-thin text-xs">{CurrUser}</span>
      </div>
    </div>
  );
}

export default Sidebar;
