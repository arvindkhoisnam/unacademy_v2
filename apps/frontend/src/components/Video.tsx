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
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
        `${import.meta.env.VITE_PRIMARY_BACKEND_URL}/session/${sessionId}/videoToken`,
        { withCredentials: true }
      );
      const vidRes = await newRoom.connect(
        `${import.meta.env.VITE_LIVEKIT_URL}`,
        res.data.token
      );
      console.log(vidRes);
      const p = newRoom.localParticipant;
      // Also subscribe to tracks published before participant joined
      newRoom.remoteParticipants.forEach((participant) => {
        participant.trackPublications.forEach((publication) => {
          console.log(publication);
          publication.setSubscribed(true);
          const track = publication.track;
          if (track?.kind === "video") {
            track.attach(videoRef.current as HTMLMediaElement);
          } else if (track?.kind === "audio") {
            track.attach(audioRef.current as HTMLAudioElement);
          }
        });
      });
      if (Role === "admin") {
        await p.setCameraEnabled(true);
        await p.setMicrophoneEnabled(true);

        const videoTrack = p.getTrackPublication(Track.Source.Camera);
        if (videoTrack && videoTrack.videoTrack) {
          videoTrack.videoTrack.attach(videoRef.current as HTMLMediaElement);
          await newRoom.localParticipant.publishTrack(videoTrack.videoTrack, {
            name: "mytrack",
            simulcast: true,
            source: Track.Source.Camera,
          });
        }
        const audioTrack = p.getTrackPublication(Track.Source.Microphone);
        if (audioTrack && audioTrack.audioTrack) {
          audioTrack.audioTrack.attach(audioRef.current as HTMLAudioElement);
          audioRef.current!.muted = true;
          await newRoom.localParticipant.publishTrack(audioTrack.audioTrack, {
            name: "audio",
            simulcast: true,
            source: Track.Source.Microphone,
          });
        }
      } else {
        newRoom.on(RoomEvent.TrackSubscribed, (track) => {
          console.log("new sub");
          if (track.kind === "video") {
            track.attach(videoRef.current as HTMLMediaElement);
          }
          if (track.kind === "audio") {
            track.attach(audioRef.current as HTMLAudioElement);
          }
        });
      }
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
    <>
      <video
        // className="h-full w-full bg-neutral-950 rounded-lg"
        className="flex-1 min-h-0 w-full bg-neutral-950 rounded-lg"
        ref={videoRef}
      />
      <audio ref={audioRef} />
    </>
  );
}

export default Video;
