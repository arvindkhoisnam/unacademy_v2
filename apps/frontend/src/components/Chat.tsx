import { IoSendSharp } from "react-icons/io5";

function Chat() {
  return (
    <div className="bg-neutral-800 row-span-4 rounded-lg relative p-2">
      <div className="absolute bottom-0 left-0 w-full p-4 flex items-center gap-2">
        <div className="w-full">
          <input className="border border-neutral-300 rounded-lg h-10 w-full bg-neutral-800 px-4 py-2 text-neutral-300 text-sm font-thin" />
        </div>
        <IoSendSharp className="text-xl text-neutral-300 cursor-pointer hover:scale-110 hover:text-violet-500" />
      </div>
    </div>
  );
}

export default Chat;
