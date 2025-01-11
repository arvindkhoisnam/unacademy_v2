import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { SigninType } from "@repo/validators/index";
import { getGoogleOAuthURL } from "@/lib/action";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function signIn() {
    const body: SigninType = {
      username,
      password,
    };

    try {
      await axios.post("http://localhost:3000/api/v1/signin", body, {
        withCredentials: true,
      });
      navigate("/dashboard/all-classes");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="flex flex-col gap-10 p-4 min-w-96">
      <h2 className="text-3xl font-thin text-zinc-300 text-center">
        Welcome back
      </h2>
      <div className="flex flex-col gap-6">
        <input
          placeholder="username"
          type="text"
          className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-600 text-zinc-300 font-thin"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-600 text-zinc-300 font-thin"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-zinc-300 px-4 py-2 rounded-md" onClick={signIn}>
          Sign in
        </button>
        <div className="flex gap-2 font-thin  justify-center">
          <p className="text-zinc-500">Don't have an account?</p>
          <Link className="text-zinc-300 cursor-pointer" to="/signup">
            Sign Up
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex-1 h-[1px] bg-zinc-500"></div>
          <span className="text-zinc-500 font-thin text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-zinc-500"></div>
        </div>
        <div className="px-6 py-4 rounded-md bg-zinc-900 border border-zinc-600 flex items-center justify-start gap-3">
          <FcGoogle className="text-xl" />
          <a className="text-zinc-400 font-thin" href={getGoogleOAuthURL()}>
            Continue with Google
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signin;
