import { useEffect, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { currUser, socket } from "../recoil";
import { useRecoilValue } from "recoil";
import axios from "axios";

function Chat() {
  const [message, setMessage] = useState("");
  const [displayText, setDisplayText] = useState<
    { user: string; text: string }[]
  >([]);
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();
  const CurrUser = useRecoilValue(currUser);

  useEffect(() => {
    async function getChat() {
      const res = await axios.get(
        `http://localhost:3000/api/v1/session/${sessionId}/chat`,
        { withCredentials: true }
      );
      const prevChat = res.data.chat.map(
        (c: { sender: string; content: string }) => ({
          user: c.sender,
          text: c.content,
        })
      );
      setDisplayText(prevChat);
    }
    getChat();
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
  }, [Socket, sessionId]);

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
    <div className="bg-zinc-900 row-span-4 rounded-xl p-2 h-full">
      <section className="flex flex-col gap-1 relative overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 scrollbar-thumb-rounded p-3 h-[93%] justify-end">
        {displayText.map((c, index) => (
          <div
            key={index}
            className={`${c.user === CurrUser ? "justify-end" : "justify-start"} flex items-center bg-zinc-300 rounded-lg px-1`}
          >
            <span
              className={`${c.user === CurrUser ? "hidden" : "flex"} size-6 rounded-full bg-zinc-500  justify-center items-center p-2 text-xs text-blue-300`}
            >
              {c.user.split("")[0].toUpperCase()}
              {c.user.split("")[1].toUpperCase()}
            </span>
            <span className={`text-sm text-zinc-950 m-2 font-thin`}>
              {c.text}
            </span>
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
            className="border border-zinc-700 rounded-xl h-10 w-full bg-zinc-900 px-2 py-1 text-zinc-300 text-sm font-thin"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <IoSendSharp
          className="text-xl text-zinc-600 cursor-pointer hover:scale-110 hover:text-blue-300"
          onClick={() => {
            if (message.length > 0) {
              send();
            }
          }}
        />
      </div>
    </div>
  );
}

export default Chat;
