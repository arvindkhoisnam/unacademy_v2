import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { imageCurrPage, imageUrls, socket, toDisplay } from "../recoil";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Canvas() {
  const [ImageUrls, setImageUrls] = useRecoilState(imageUrls);
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();
  const setToDisplay = useSetRecoilState(toDisplay);
  const [currPage, setCurrPage] = useRecoilState(imageCurrPage);

  useEffect(() => {
    if (!Socket) return;
    const handleMessage = (message: MessageEvent) => {
      const parsed = JSON.parse(message.data as unknown as string);
      switch (parsed.event) {
        case "image-load":
          setImageUrls(parsed.payload.imgUrl);
          setCurrPage(0);
          break;
        case "image-close":
          setToDisplay("video");
          break;
        case "image-next-page":
          console.log(parsed.payload);
          setCurrPage(parsed.payload.currPage);
          break;
        case "image-prev-page":
          console.log(parsed.payload);
          setCurrPage(parsed.payload.currPage);
          break;
      }
    };
    Socket.addEventListener("message", handleMessage);

    return () => {
      Socket.removeEventListener("message", handleMessage);
    };
  }, [Socket, sessionId, setToDisplay, setImageUrls, setCurrPage]);
  return (
    <div className="h-full">
      <div
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "20px",
          backgroundImage: `url(${ImageUrls[currPage]})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}

export default Canvas;
