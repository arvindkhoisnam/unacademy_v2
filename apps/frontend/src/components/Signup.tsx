import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/actions";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate("/signin");
    },
    onError: (err) => {
      setErrorMessage(String(err.message));
    },
  });

  return (
    <div className="flex flex-col gap-10 p-4 w-60 md:min-w-96">
      <h2 className="text-lg md:text-3xl font-thin text-zinc-300 text-center">
        Create an account
      </h2>
      <div className="flex flex-col gap-6">
        <input
          placeholder="Email address"
          type="text"
          className="px-4 py-2 rounded-md bg-zinc-900 border border-neutral-600 text-neutral-400 font-thin text-xs md:text-base"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Username"
          type="text"
          className="px-4 py-2 rounded-md bg-zinc-900 border border-neutral-600 text-neutral-400 font-thin text-xs md:text-base"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          className="px-4 py-2 rounded-md bg-zinc-900 border border-neutral-600 text-neutral-400 font-thin text-xs md:text-base"
          onChange={(e) => setPassword(e.target.value)}
        />
        {isError && (
          <p className="text-red-500 font-thin text-xs md:text-base text-center">
            {errorMessage}
          </p>
        )}
        <button
          className="bg-zinc-300 px-4 py-2 rounded-md text-xs md:text-base"
          onClick={() => {
            mutate({
              username,
              password,
              email,
            });
          }}
        >
          {isPending ? "Signing up..." : "Sign Up"}
        </button>
        <div className="flex gap-2 font-thin  justify-center">
          <p className="text-neutral-500 text-xs md:text-base">
            Already have an account?
          </p>
          <Link
            className="text-zinc-300 cursor-pointer text-xs md:text-base"
            to="/signin"
          >
            Signin
          </Link>
        </div>
        {/* <div className="flex items-center justify-center space-x-2">
          <div className="flex-1 h-[1px] bg-neutral-500"></div>
          <span className="text-neutral-500 font-thin text-[10px] md:text-xs">
            OR
          </span>
          <div className="flex-1 h-[1px] bg-neutral-500"></div>
        </div>
        <div className="px-6 py-4 rounded-md bg-zinc-900 border border-neutral-600 flex items-center justify-start gap-3">
          <FcGoogle className="text-xl" />
          <span className="text-zinc-300 font-thin text-xs md:text-base">
            Continue with Google
          </span>
        </div> */}
      </div>
    </div>
  );
}

export default Signup;
