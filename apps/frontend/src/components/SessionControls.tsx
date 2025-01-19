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
      `https://api-live-classes.arvindkhoisnam.com/api/v1/session/${sessionId}/end`,
      // `http://localhost:3000/api/v1/session/${sessionId}/end`,
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
      return;
    }

    try {
      const newFile = new FormData();
      newFile.append("file", pdfFile);

      const res = await axios.post(
        `https://api-live-classes.arvindkhoisnam.com/api/v1/session/${sessionId}/slides/pdf`,
        // `http://localhost:3000/api/v1/session/${sessionId}/slides/pdf`,
        newFile,
        { withCredentials: true }
      );
      console.log(res);
      const taskId = res.data.taskId;
      const maxRetries = 20;
      let retries = 0;

      async function pollImageUrls() {
        try {
          const response = await axios.get(
            `https://api-live-classes.arvindkhoisnam.com/api/v1/session/task/${taskId}`,
            // `http://localhost:3000/api/v1/session/task/${taskId}`,
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
      <div className="border border-neutral-600 text-xl text-neutral-200 flex px-2 py-1 justify-center gap-6 max-w-fit rounded-xl">
        <input
          onChange={(e) => setPdfFile(e.target.files![0] || null)}
          type="file"
          className="p-1 bg-neutral-800 text-neutral-300 text-xs font-thin rounded-lg w-44"
        />
        <UploadButton setToDisplay={setToDisplay} uploadPdf={uploadPdf} />
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
  );
}

export default SessionControls;
