import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { imageUrls, socket, toDisplay, userRole } from "../recoil";
import { useState } from "react";
import SlideControls from "./SlideControls";
function Canvas() {
  const ImageUrls = useRecoilValue(imageUrls);
  const setToDisplay = useSetRecoilState(toDisplay);
  const [currPage, setCurrPage] = useState(0);
  const Socket = useRecoilValue(socket);
  const Role = useRecoilValue(userRole);
  return (
    <div className="h-[90%] mb-2">
      {/* <canvas className="h-[95%]  max-w-full bg-neutral-800 rounded-xl" /> */}
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
      {Role === "admin" && (
        <SlideControls currPage={currPage} setCurrPage={setCurrPage} />
      )}
    </div>
  );
}

export default Canvas;
