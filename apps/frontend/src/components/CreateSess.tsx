import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createSession } from "../actions";

function CreateSess() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const { mutate } = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["adminClasses"] });
    },
  });
  return (
    <div className="rounded-xl p-6 h-fit">
      <h2 className="text-start mb-10 text-neutral-400 font-thin text-lg">
        Create a Session
      </h2>
      <div className=" flex flex-col gap-10">
        <input
          value={title}
          className="w-full px-4 py-3 rounded-lg font-thin bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs"
          placeholder="Give it a title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-neutral-300 py-4 rounded-lg text-neutral-950 font-thin text-xs"
          onClick={() => mutate(title)}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default CreateSess;
