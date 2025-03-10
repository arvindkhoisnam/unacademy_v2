import { BsChatLeftText } from "react-icons/bs";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { socket } from "@/recoil";

function SecondarySessControl() {
  const [open, setOpen] = useState(false);
  const [newMsgs, setNewMsgs] = useState(0);
  const Socket = useRecoilValue(socket);
  useEffect(() => {
    if (open) {
      setNewMsgs(0);
    }
    function handleNotification(message: MessageEvent) {
      const parsed = JSON.parse(message.data as unknown as string);
      if (parsed.event === "message") {
        if (!open) {
          setNewMsgs((n) => n + 1);
        }
      }
    }

    Socket?.addEventListener("message", handleNotification);

    return () => {
      Socket?.removeEventListener("message", handleNotification);
    };
  }, [Socket, open]);
  return (
    <div className="flex flex-col items-center border border-neutral-600 px-1 py-1 rounded-lg group cursor-pointer">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <div className="relative">
            <BsChatLeftText
              size={12}
              className="text-zinc-300 cursor-pointer"
            />
            {newMsgs > 0 && (
              <span className="bg-red-600 size-5 flex justify-center items-center text-[10px] text-zinc-200 rounded-full absolute -top-4 -right-3">
                {newMsgs}
              </span>
            )}
          </div>
        </SheetTrigger>

        <SheetContent className="bg-zinc-950 border-0 pb-16">
          <SheetTitle className="text-zinc-400 font-thin mb-2">
            Messages
          </SheetTitle>
          <Chat />
        </SheetContent>
      </Sheet>
      <span className="text-zinc-600 text-[8px] md:text-xs font-extralight group-hover:text-blue-200">
        Message
      </span>
    </div>
  );
}

export default SecondarySessControl;
