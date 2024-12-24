import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { SignupType } from "@repo/validators/index";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function signUp() {
    const body: SignupType = {
      username,
      password,
      email,
    };

    try {
      await axios.post("http://localhost:3000/api/v1/signup", body, {
        withCredentials: true,
      });
      navigate("/signin");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="flex flex-col gap-10 p-4 min-w-96">
      <h2 className="text-3xl font-thin text-violet-300 text-center">
        Create an account
      </h2>
      <div className="flex flex-col gap-6">
        <input
          placeholder="Email address"
          type="text"
          className="px-4 py-2 rounded-md bg-neutral-900 border border-neutral-600 text-neutral-400 font-thin"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Username"
          type="text"
          className="px-4 py-2 rounded-md bg-neutral-900 border border-neutral-600 text-neutral-400 font-thin"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          className="px-4 py-2 rounded-md bg-neutral-900 border border-neutral-600 text-neutral-400 font-thin"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-violet-400 px-4 py-2 rounded-md" onClick={signUp}>
          Sign Up
        </button>
        <div className="flex gap-2 font-thin  justify-center">
          <p className="text-neutral-500">Already have an account?</p>
          <Link className="text-violet-400 cursor-pointer" to="/signin">
            Signin
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex-1 h-[1px] bg-neutral-500"></div>
          <span className="text-neutral-500 font-thin text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-neutral-500"></div>
        </div>
        <div className="px-6 py-4 rounded-md bg-neutral-900 border border-neutral-600 flex items-center justify-start gap-3">
          <FcGoogle className="text-xl" />
          <span className="text-violet-400 font-thin">
            Continue with Google
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
