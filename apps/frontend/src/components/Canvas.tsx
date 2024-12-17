import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { imageUrls, socket, toDisplay } from "../recoil";
import { useState } from "react";
function Canvas() {
  const ImageUrls = useRecoilValue(imageUrls);
  const setToDisplay = useSetRecoilState(toDisplay);
  const [currPage, setCurrPage] = useState(0);
  const Socket = useRecoilValue(socket);
  function nextPage() {
    if (currPage < ImageUrls.length - 1) {
      setCurrPage((currPage) => currPage + 1);
    }
  }
  function prevPage() {
    if (currPage > 0) {
      setCurrPage((currPage) => currPage - 1);
    }
  }

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
      <div className="p-2 flex justify-between gap-2">
        <div className="flex gap-4 items-center">
          <GrPrevious
            className="p-2  text-violet-800 text-3xl hover:bg-neutral-600 hover:text-violet-100 rounded-full"
            onClick={prevPage}
          />
          <GrNext
            className="p-2  text-violet-800 text-3xl hover:bg-neutral-600 hover:text-violet-100 rounded-full"
            onClick={nextPage}
          />
        </div>
        <div className="flex gap-4 items-center">
          <button className="px-2 py-1 rounded-lg bg-violet-800 text-neutral-30 hover:scale-105 text-neutral-300 font-thin text-sm">
            annotate
          </button>
          <span className="text-violet-500">
            {currPage + 1}/{ImageUrls.length}
          </span>
          <button
            className="px-2 py-1 rounded-lg bg-rose-800 text-neutral-30 hover:scale-105 text-neutral-300 font-thin text-sm"
            onClick={() => {
              setToDisplay("video");
              Socket?.send(JSON.stringify({ event: "image-close" }));
            }}
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Canvas;
