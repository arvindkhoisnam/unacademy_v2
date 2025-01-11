import { useEffect, useRef, useState } from "react";
import { DialogTitle } from "./ui/dialog";
import { IoVideocamOutline } from "react-icons/io5";
import { PiMicrophoneLight } from "react-icons/pi";
import { PiMicrophoneSlashLight } from "react-icons/pi";
import { IoVideocamOffOutline } from "react-icons/io5";
function CheckHair({ startSession }: { startSession: () => Promise<void> }) {
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cam, setCam] = useState(true);
  const [mic, setMic] = useState(false);
  useEffect(() => {
    async function init() {
      if (!vidRef || !vidRef.current) {
        return;
      }

      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: mic ? true : false,
        video: cam ? { width: 1280, height: 720 } : false,
      });
      vidRef.current.srcObject = streamRef.current;
      vidRef.current.play();
    }
    init();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [cam, mic]);
  return (
    <div>
      <DialogTitle className="text-2xl font-thin text-zinc-200 mb-5">
        Check camera and mic
      </DialogTitle>
      <video ref={vidRef} className="h-72 w-96 bg-zinc-900" />
      <div className="flex justify-center items-center gap-2 mb-2">
        {!cam ? (
          <div className="hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-300">
            <IoVideocamOutline size={20} onClick={() => setCam(true)} />
          </div>
        ) : (
          <div className="hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-300">
            <IoVideocamOffOutline size={20} onClick={() => setCam(false)} />
          </div>
        )}

        {!mic ? (
          <div className="hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-300">
            <PiMicrophoneLight size={20} onClick={() => setMic(true)} />
          </div>
        ) : (
          <div className="hover:bg-zinc-700 p-2 rounded-full cursor-pointer text-zinc-300">
            <PiMicrophoneSlashLight size={20} onClick={() => setMic(false)} />
          </div>
        )}
      </div>
      <button
        className="bg-blue-100 hover:bg-blue-200 w-full py-2 rounded font-thin"
        onClick={startSession}
      >
        Start
      </button>
    </div>
  );
}

export default CheckHair;
