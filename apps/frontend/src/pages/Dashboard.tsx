import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { currUser } from "../recoil";

function Dashboard() {
  const navigate = useNavigate();
  const setCurrUser = useSetRecoilState(currUser);
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/user", {
          withCredentials: true,
        });
        if (res.status === 200) {
          const username = res.data.username;
          setCurrUser(username);
        } else {
          throw new Error("Not signed in");
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    }
    fetchUser();
  }, [navigate, setCurrUser]);
  return (
    <div className="h-screen bg-neutral-950 grid grid-cols-6 p-4 gap-4">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default Dashboard;
