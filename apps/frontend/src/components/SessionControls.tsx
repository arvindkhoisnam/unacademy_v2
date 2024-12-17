import { TbFileUpload } from "react-icons/tb";
import { MdDraw } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { FiVideoOff } from "react-icons/fi";
import { AiOutlineAudio } from "react-icons/ai";
import { MdCallEnd } from "react-icons/md";
import { Room, RoomEvent } from "livekit-client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { imageUrls, socket, toDisplay } from "../recoil";

function SessionControls({
  videoRoom,
  setVideoOff,
  videoOff,
}: {
  videoRoom: Room | null;
  setVideoOff: React.Dispatch<React.SetStateAction<boolean>>;
  videoOff: boolean;
}) {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalParticipants, setTotalParticipants] = useState<
    number | undefined
  >(0);
  const setImageUrls = useSetRecoilState(imageUrls);
  const setToDisplay = useSetRecoilState(toDisplay);
  const Socket = useRecoilValue(socket);

  useEffect(() => {
    videoRoom?.on(RoomEvent.ParticipantConnected, (participant) => {
      setTotalParticipants(videoRoom?.numParticipants);
      alert(`${participant.identity} joined`);
    });
    videoRoom?.on(RoomEvent.ParticipantDisconnected, (participant) => {
      setTotalParticipants(videoRoom?.numParticipants);
      alert(`${participant.identity} left`);
    });
  }, [videoRoom]);

  async function endClass() {
    await axios.post(
      `http://localhost:3000/api/v1/session/${sessionId}/end`,
      {},
      { withCredentials: true }
    );
    videoRoom?.localParticipant.setCameraEnabled(false);
    videoRoom?.disconnect();
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
        `http://localhost:3000/api/v1/session/${sessionId}/slides/pdf`,
        newFile,
        { withCredentials: true }
      );
      const taskId = res.data.taskId;
      const maxRetries = 5;
      let retries = 0;

      async function pollImageUrls() {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/session/task/${taskId}`,
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
          const uris = pollData.images.map((image) => image.url);
          const sortedUrls = uris.sort((a, b) => {
            const getNumber = (url) => {
              const match = url.match(/\.([\d]+)\.png/); // Match the number between "." and ".png"
              return match ? parseInt(match[1], 10) : 0; // Return the number or 0 if no match
            };
            return getNumber(a) - getNumber(b);
          });
          setImageUrls(sortedUrls);
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
    <div className="flex justify-center items-center gap-2">
      <div className="border border-neutral-600 text-xl text-neutral-200 flex px-8 py-2 justify-center gap-6 max-w-fit rounded-xl">
        <input
          onChange={(e) => setPdfFile(e.target.files![0] || null)}
          type="file"
          className="p-2 bg-neutral-800 text-neutral-300 text-sm font-thin rounded-lg w-44"
        />
        <div className="group flex flex-col items-center hover:scale-105 cursor-pointer">
          <TbFileUpload
            onClick={async () => {
              await uploadPdf();
              Socket?.send(JSON.stringify({ event: "image-open" }));
              setToDisplay("image");
            }}
          />
          <span className="text-neutral-500 text-sm group-hover:text-violet-500">
            Upload
          </span>
        </div>
        <div className="group flex flex-col items-center hover:scale-105 cursor-pointer">
          <MdDraw
            onClick={() => {
              setToDisplay("board");
              Socket?.send(JSON.stringify({ event: "whiteBoard-open" }));
            }}
          />
          <span className="text-neutral-500 text-sm group-hover:text-violet-500">
            Draw
          </span>
        </div>
        <div className="group flex flex-col items-center hover:scale-105 cursor-pointer">
          {videoOff ? (
            <IoVideocamOutline
              onClick={() => {
                setVideoOff(false);
                videoRoom?.localParticipant.setCameraEnabled(true);
              }}
            />
          ) : (
            <FiVideoOff
              onClick={() => {
                setVideoOff(true);
                videoRoom?.localParticipant.setCameraEnabled(false);
              }}
            />
          )}
          <span className="text-neutral-500 text-sm group-hover:text-violet-500">
            Video
          </span>
        </div>
        <div className="group flex flex-col items-center hover:scale-105 cursor-pointer">
          <AiOutlineAudio
            onClick={async () => {
              // videoRoom?.localParticipant.setCameraEnabled(true);
              // await videoRoom?.localParticipant.setScreenShareEnabled(true);
            }}
          />
          <span className="text-neutral-500 text-sm group-hover:text-violet-500">
            Audio
          </span>
        </div>
        <div className="group flex flex-col items-center hover:scale-105 cursor-pointer">
          <MdCallEnd className="text-rose-500" onClick={endClass} />
          <span className="text-neutral-500 text-sm group-hover:text-rose-500">
            End
          </span>
        </div>
      </div>
      <div>
        <span className="text-neutral-500 text-sm font-thin">
          Participants: {totalParticipants}
        </span>
      </div>
    </div>
  );
}

export default SessionControls;
