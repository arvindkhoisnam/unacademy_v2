import Loading from "@/pages/Loading";
import { userRole, currUser, email } from "@/recoil";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const setUserRole = useSetRecoilState(userRole);
  const [User, setCurrUser] = useRecoilState(currUser);
  const setEmail = useSetRecoilState(email);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function init() {
      const res = await axios.get(
        "https://api-live-classes.arvindkhoisnam.com/api/v1/user",
        // "http://localhost:3000/api/v1/user",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUserRole(res.data.role);
      setCurrUser(res.data.username);
      setEmail(res.data.email);
      setLoading(false);
    }
    init();
  }, [setCurrUser, setUserRole, setEmail]);
  if (loading) {
    return <Loading />;
  }
  if (!User) {
    return <Navigate to={"/signin"} />;
  }
  return <>{children}</>;
}

export default ProtectedRoutes;
