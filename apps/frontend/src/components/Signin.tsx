import axios from "axios";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { currUser, userRole } from "../recoil";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { SigninType } from "@repo/validators/index";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUserRole = useSetRecoilState(userRole);
  const setCurrUser = useSetRecoilState(currUser);
  const navigate = useNavigate();

  async function signIn() {
    const body: SigninType = {
      username,
      password,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/signin",
        body,
        {
          withCredentials: true,
        }
      );
      setUserRole(res.data.role);
      setCurrUser(res.data.username);
      navigate("/dashboard/all-classes");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="flex flex-col gap-10 p-4 min-w-96">
      <h2 className="text-3xl font-thin text-neutral-300 text-center">
        Welcome back
      </h2>
      <div className="flex flex-col gap-6">
        <input
          placeholder="username"
          type="text"
          className="px-4 py-2 rounded-md bg-neutral-900 border border-neutral-600 text-neutral-300 font-thin"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          className="px-4 py-2 rounded-md bg-neutral-900 border border-neutral-600 text-neutral-300 font-thin"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-neutral-300 px-4 py-2 rounded-md"
          onClick={signIn}
        >
          Sign in
        </button>
        <div className="flex gap-2 font-thin  justify-center">
          <p className="text-neutral-500">Don't have an account?</p>
          <Link className="text-neutral-300 cursor-pointer" to="/signup">
            Sign Up
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex-1 h-[1px] bg-neutral-500"></div>
          <span className="text-neutral-500 font-thin text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-neutral-500"></div>
        </div>
        <div className="px-6 py-4 rounded-md bg-neutral-900 border border-neutral-600 flex items-center justify-start gap-3">
          <FcGoogle className="text-xl" />
          <span className="text-neutral-400 font-thin">
            Continue with Google
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signin;
