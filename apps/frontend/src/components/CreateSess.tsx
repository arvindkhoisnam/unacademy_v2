import axios from "axios";
import { useState } from "react";

function CreateSess() {
  const [title, setTitle] = useState("");
  async function createSession() {
    await axios.post(
      "http://localhost:3000/api/v1/session",
      {
        title: title,
      },
      { withCredentials: true }
    );
  }
  return (
    <div className="rounded-xl p-6 h-fit">
      <h2 className="text-start mb-10 text-neutral-400 font-thin text-lg">
        Create a Session
      </h2>
      <div className=" flex flex-col gap-10">
        <input
          className="w-full px-4 py-3 rounded-lg font-thin bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs"
          placeholder="Give it a title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-neutral-300 py-4 rounded-lg text-neutral-950 font-thin text-xs"
          onClick={createSession}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default CreateSess;
