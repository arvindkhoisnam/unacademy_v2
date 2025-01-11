import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createSession } from "../actions";
import { IoAdd } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function CreateSess() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["adminClasses"] });
      setIsOpen(false);
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-zinc-900 text-blue-300 px-4 py-2 rounded-lg flex items-center text-sm font-thin hover:bg-zinc-800 hover:text-blue-200 gap-2">
        <IoAdd size={20} />
        Create Session
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-thin text-zinc-200 mb-5">
            Create a Session
          </DialogTitle>
          <DialogDescription>
            <input
              value={title}
              className="w-full px-4 py-3 rounded-lg font-thin bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs mb-5"
              placeholder="Give it a title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              // value={title}
              className="w-full px-4 py-3 rounded-lg font-thin bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs mb-5"
              placeholder="Description"
              // onChange={(e) => setTitle(e.target.value)}
            />
            <button
              className="bg-blue-100 hover:bg-blue-200 py-4 rounded-lg text-zinc-900 font-thin text-xs w-full"
              onClick={() => mutate(title)}
            >
              Create
            </button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSess;
