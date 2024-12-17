import { useRecoilValue } from "recoil";
import { userRole } from "../recoil";
import { Link, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { LiaSchoolSolid } from "react-icons/lia";
function Sidebar({ currUser }: { currUser: string }) {
  const Role = useRecoilValue(userRole);
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
    <div className="relative h-full bg-neutral-900 col-span-1 rounded-xl p-2">
      <div className="flex items-end gap-2 text-violet-400 justify-start p-4">
        <LiaSchoolSolid className="text-4xl " />
        <span className="text-2xl">LiveClasses</span>
      </div>
      <div className="flex flex-col text-neutral-300 gap-4 px-4 mt-10">
        <Link to="" />
        <Link
          to="/dashboard/all-classes"
          className="hover:bg-neutral-800 rounded-lg py-2 px-3 font-thin"
        >
          All Classes
        </Link>
        {Role === "admin" && (
          <Link
            to="/dashboard/admin"
            className="hover:bg-neutral-800 rounded-lg py-2 px-3 font-thin"
          >
            Admin
          </Link>
        )}
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <CiLogout
          className="text-neutral-300 text-2xl cursor-pointer hover:scale-110"
          onClick={logout}
        />
        <span className="text-neutral-300 font-thin">{currUser}</span>
      </div>
    </div>
  );
}

export default Sidebar;
