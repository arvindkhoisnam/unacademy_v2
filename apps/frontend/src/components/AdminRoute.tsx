import { userRole } from "@/recoil";
import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const Role = useRecoilValue(userRole);

  if (Role !== "admin") {
    return <Navigate to={"/signin"} />;
  }
  return <>{children}</>;
}

export default AdminRoute;
