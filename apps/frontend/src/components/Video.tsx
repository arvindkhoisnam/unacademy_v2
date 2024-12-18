import axios from "axios";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Room, RoomEvent, Track } from "livekit-client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sessionTitle, socket, toDisplay, userRole } from "../recoil";

function Video({
  setVideoRoom,
}: {
  setVideoRoom: React.Dispatch<React.SetStateAction<Room | null>>;
}) {
  const { sessionId } = useParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoRoomRef = useRef<Room | null>(null);
  const Role = useRecoilValue(userRole);
  const setSocket = useSetRecoilState(socket);
  const setToDisplay = useSetRecoilState(toDisplay);
  const setSessionTitle = useSetRecoilState(sessionTitle);

  useEffect(() => {
    if (videoRoomRef.current) {
      return;
    }
    const newRoom = new Room();
    setVideoRoom(newRoom);
    videoRoomRef.current = newRoom;
    async function startSession() {
      const res = await axios.post(
        Role === "admin"
          ? `http://localhost:3000/api/v1/session/${sessionId}/start`
          : `http://localhost:3000/api/v1/session/${sessionId}/join`,
        {},
        {
          withCredentials: true,
        }
      );

      setSessionTitle(res.data.sessionTitle);
      const ws = new WebSocket("ws://localhost:3001");

      ws.onopen = () => {
        console.log("connected to ws");
        ws.send(
          JSON.stringify({
            event: "join",
            payload: {
              role: Role,
              sessionId: sessionId,
              jwtToken: res.data.jwtToken,
            },
          })
        );
        setSocket(ws);
      };

      ws.onmessage = (message) => {
        const parsed = JSON.parse(message.data as unknown as string);
        console.log(parsed.event);
        switch (parsed.event) {
          case "image-open":
            setToDisplay("image");
            break;
          case "image-close":
            setToDisplay("video");
            break;
          case "whiteBoard-open":
            setToDisplay("board");
            break;
          case "whiteBoard-close":
            setToDisplay("video");
            break;
          default:
            break;
        }
      };
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
  }, [sessionId, setVideoRoom, Role, setSessionTitle, setSocket, setToDisplay]);
  return (
    <video
      className="h-[90%] max-w-full bg-neutral-950 rounded-xl mb-2"
      ref={videoRef}
    />
  );
}

export default Video;
