import { useEffect, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { currUser, socket } from "../recoil";
import { useRecoilValue } from "recoil";

function Chat() {
  const [message, setMessage] = useState("");
  const [displayText, setDisplayText] = useState<
    { user: string; text: string }[]
  >([]);
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();
  const CurrUser = useRecoilValue(currUser);

  useEffect(() => {
    function msgHandler(message: MessageEvent) {
      const parsed = JSON.parse(message.data as unknown as string);
      if (parsed.event === "message") {
        setDisplayText((content) => [...content, parsed.payload.content]);
      }
    }

    Socket?.addEventListener("message", msgHandler);

    return () => {
      Socket?.removeEventListener("message", msgHandler);
    };
  }, [Socket]);

  function send() {
    setMessage("");
    Socket?.send(
      JSON.stringify({
        event: "message",
        payload: {
          sessionId: sessionId,
          content: {
            user: CurrUser,
            text: message,
          },
        },
      })
    );
  }
  return (
    <div className="bg-neutral-900 row-span-4 rounded-xl p-2 border border-neutral-700">
      <section className="h-[90%] flex flex-col justify-end overflow-y-scroll scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 scrollbar-thumb-rounded">
        {displayText.map((c, index) => (
          <div
            key={index}
            className={`${c.user === CurrUser ? "justify-end" : "justify-start"} flex items-center`}
          >
            <span
              className={`${c.user === CurrUser ? "hidden" : "flex"} size-5 rounded-full bg-neutral-300  justify-center items-center p-2 text-xs text-violet-800`}
            >
              {c.user.split("")[0].toUpperCase()}
              {c.user.split("")[1].toUpperCase()}
            </span>
            <span className={`text-xs text-violet-400 m-2`}>{c.text}</span>
          </div>
        ))}
      </section>
      <div className="w-full p-2 flex items-center gap-2">
        <div className="w-full">
          <input
            onKeyDown={(e) => {
              if (message.length > 0 && e.code === "Enter") {
                send();
              }
            }}
            value={message}
            placeholder="start typing..."
            className="border border-neutral-700 rounded-xl h-10 w-full bg-neutral-900 px-2 py-1 text-neutral-300 text-xs font-thin"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <IoSendSharp
          className="text-xl text-neutral-300 cursor-pointer hover:scale-110 hover:text-violet-500"
          onClick={send}
        />
      </div>
    </div>
  );
}

export default Chat;
