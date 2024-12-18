import { useRecoilValue, useSetRecoilState } from "recoil";
import { imageUrls, socket, toDisplay, userRole } from "../recoil";
import { useEffect, useState } from "react";
import SlideControls from "./SlideControls";
import { useParams } from "react-router-dom";

function Canvas() {
  const ImageUrls = useRecoilValue(imageUrls);
  const [currPage, setCurrPage] = useState(0);
  const Socket = useRecoilValue(socket);
  const Role = useRecoilValue(userRole);
  const { sessionId } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const setToDisplay = useSetRecoilState(toDisplay);
  useEffect(() => {
    console.log(ImageUrls);
    setImages(ImageUrls);
    if (!Socket) return;
    Socket.send(
      JSON.stringify({
        event: "image-load",
        payload: {
          sessionId: sessionId,
          imgUrl: ImageUrls,
        },
      })
    );

    Socket.onmessage = (message) => {
      const parsed = JSON.parse(message.data as unknown as string);
      console.log(parsed);
      switch (parsed.event) {
        case "image-load":
          // setImageUrls(parsed.payload.imgUrl);
          setImages(parsed.payload.imgUrl);
          break;
        case "image-close":
          setToDisplay("video");
          break;
      }
    };
  }, [Socket, sessionId, setImages, ImageUrls, setToDisplay]);

  return (
    <div className="h-[90%] mb-2">
      {/* <canvas className="h-[95%]  max-w-full bg-neutral-800 rounded-xl" /> */}
      <div
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "20px",
          backgroundImage: `url(${images[currPage]})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />
      {Role === "admin" && (
        <SlideControls currPage={currPage} setCurrPage={setCurrPage} />
      )}
    </div>
  );
}

export default Canvas;
