import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="h-screen bg-neutral-900 grid grid-cols-6 p-4 gap-4">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default Dashboard;
