import Navbar from "@/components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div
      className={`h-screen bg-zinc-950 flex flex-col justify-start items-center xl:grid grid-cols-6 p-4 gap-4 relative`}
    >
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default Dashboard;
