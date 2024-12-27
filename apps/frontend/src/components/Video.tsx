import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Room, RoomEvent, Track } from "livekit-client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { socket, toDisplay, userRole } from "../recoil";
import axios from "axios";

function Video({
  setVideoRoom,
}: {
  setVideoRoom: React.Dispatch<React.SetStateAction<Room | null>>;
}) {
  const { sessionId } = useParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoRoomRef = useRef<Room | null>(null);
  const Role = useRecoilValue(userRole);
  const setToDisplay = useSetRecoilState(toDisplay);
  const Socket = useRecoilValue(socket);

  useEffect(() => {
    if (videoRoomRef.current) {
      return;
    }
    const newRoom = new Room();
    setVideoRoom(newRoom);
    videoRoomRef.current = newRoom;

    async function startSession() {
      const res = await axios.get(
        ` http://localhost:3000/api/v1/session/${sessionId}/videoToken`,
        { withCredentials: true }
      );
      await newRoom.connect("ws://localhost:7880", res.data.token);
      const p = newRoom.localParticipant;
      if (Role === "admin") {
        await p.setCameraEnabled(true);
        const videoTrack = p.getTrackPublication(Track.Source.Camera);
        if (videoTrack && videoTrack.videoTrack) {
          videoTrack.videoTrack.attach(videoRef.current as HTMLMediaElement);
          await newRoom.localParticipant.publishTrack(videoTrack.videoTrack, {
            name: "mytrack",
            simulcast: true,
            source: Track.Source.Camera,
          });
        }
      }
      newRoom.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind === "video") {
          track.attach(videoRef.current as HTMLMediaElement);
        }
      });
    }

    startSession();
    return () => {
      newRoom.localParticipant.setCameraEnabled(false);
      newRoom.disconnect();
    };
  }, [sessionId, setVideoRoom, Role]);

  useEffect(() => {
    function handleEvents(message: MessageEvent) {
      if (!Socket) return;
      const parsed = JSON.parse(message.data as unknown as string);
      switch (parsed.event) {
        case "image-open":
          setToDisplay("image");
          break;
        case "whiteBoard-open":
          setToDisplay("board");
          break;
        default:
          break;
      }
    }
    Socket?.addEventListener("message", handleEvents);

    return () => {
      Socket?.removeEventListener("message", handleEvents);
    };
  }, [Socket, setToDisplay]);
  return (
    <video
      className="h-[90%] max-w-full bg-neutral-950 rounded-xl mb-1"
      ref={videoRef}
    />
  );
}

export default Video;
