import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({
  currUser,
  children,
}: {
  currUser: string;
  children: React.ReactNode;
}) {
  if (!currUser) {
    return <Navigate to={"/signin"} />;
  }
  return <>{children}</>;
}

export default ProtectedRoutes;
