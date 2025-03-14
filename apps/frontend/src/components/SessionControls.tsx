import { Room, RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { imageUrls, socket, toDisplay } from "../recoil";
import { toast } from "react-toastify";
import EndButton from "./EndButton";
import AudioButton from "./AudioButton";
import VideoButton from "./VideoButton";
import DrawButton from "./DrawButton";
import UploadButton from "./UploadButton";
function SessionControls({ videoRoom }: { videoRoom: Room | null }) {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const setImageUrls = useSetRecoilState(imageUrls);
  const setToDisplay = useSetRecoilState(toDisplay);
  const Socket = useRecoilValue(socket);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    videoRoom?.on(RoomEvent.ParticipantConnected, (participant) => {
      toast.info(`${participant.identity} joined`);
    });
    videoRoom?.on(RoomEvent.ParticipantDisconnected, (participant) => {
      toast.info(`${participant.identity} left`);
    });
  }, [videoRoom]);

  async function endClass() {
    if (!Socket || !videoRoom) return;
    await axios.post(
      `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/${sessionId}/end`,
      {},
      { withCredentials: true }
    );
    videoRoom.localParticipant.setCameraEnabled(false);
    videoRoom.disconnect();
    Socket.send(
      JSON.stringify({
        event: "end-class",
        payload: {
          sessionId: sessionId,
        },
      })
    );
    Socket.close();
    navigate(-1);
  }

  async function uploadPdf() {
    if (!pdfFile) {
      alert("No file selected");
      return "No file selected";
    }

    try {
      setLoading(true);
      const newFile = new FormData();
      newFile.append("file", pdfFile);

      const res = await axios.post(
        `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/${sessionId}/slides/pdf`,
        newFile,
        { withCredentials: true }
      );
      const taskId = res.data.taskId;
      const maxRetries = 20;
      let retries = 0;

      async function pollImageUrls() {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/task/${taskId}`,
            { withCredentials: true }
          );
          if (response.data.status === "completed") {
            return response.data;
          } else if (response.data.status === "failed") {
            throw new Error("Task processing failed.");
          } else {
            console.log("Task still in progress...");
          }
        } catch (err) {
          console.error("Error polling task status:", err);
          throw err;
        }
      }

      while (retries < maxRetries) {
        const pollData = await pollImageUrls();
        if (pollData) {
          console.log(pollData);
          const uris = pollData.images.map(
            (image: {
              id: number;
              session_Id: string;
              taskId: string;
              url: string;
            }) => image.url
          );
          const sortedUrls = uris.sort((a: string, b: string) => {
            const getNumber = (url: string) => {
              const match = url.match(/\.([\d]+)\.png/); // Match the number between "." and ".png"
              return match ? parseInt(match[1], 10) : 0; // Return the number or 0 if no match
            };
            return getNumber(a) - getNumber(b);
          });
          setImageUrls(sortedUrls);
          Socket?.send(
            JSON.stringify({
              event: "image-open",
              payload: {
                sessionId: sessionId,
              },
            })
          );
          Socket?.send(
            JSON.stringify({
              event: "image-load",
              payload: {
                sessionId: sessionId,
                imgUrl: sortedUrls,
              },
            })
          );
          setLoading(false);
          setPdfFile(null);
          newFile.delete("file");
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        retries++;
      }
    } catch (err) {
      console.error("Error while uploading PDF", err);
    }
  }
  return (
    <div className="flex justify-center items-center gap-10">
      <div className="border border-neutral-600 text-neutral-200 flex flex-col md:flex-row justify-center items-center gap-2 px-2 py-1 rounded-xl">
        <input
          onChange={(e) => setPdfFile(e.target.files![0] || null)}
          type="file"
          className="bg-neutral-800 text-neutral-300 text-[10px] md:text-xs font-thin rounded-lg w-44"
        />
        <div className="flex items-center gap-4 md:gap-6">
          <UploadButton
            setToDisplay={setToDisplay}
            uploadPdf={uploadPdf}
            loading={loading}
          />
          <DrawButton
            setToDisplay={setToDisplay}
            Socket={Socket}
            sessionId={sessionId}
          />
          <VideoButton videoRoom={videoRoom} />
          <AudioButton videoRoom={videoRoom} />
          <EndButton endClass={endClass} />
        </div>
      </div>
    </div>
  );
}

export default SessionControls;
