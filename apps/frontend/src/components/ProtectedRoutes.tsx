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
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/user`,
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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
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
