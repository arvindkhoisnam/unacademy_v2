import { GrNext, GrPrevious } from "react-icons/gr";
import { imageUrls, socket, toDisplay } from "../recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { SetStateAction } from "react";
import { useParams } from "react-router-dom";

function SlideControls({
  currPage,
  setCurrPage,
}: {
  currPage: number;
  setCurrPage: React.Dispatch<SetStateAction<number>>;
}) {
  const ImageUrls = useRecoilValue(imageUrls);
  const setToDisplay = useSetRecoilState(toDisplay);
  const Socket = useRecoilValue(socket);
  const { sessionId } = useParams();
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
            Socket?.send(
              JSON.stringify({
                event: "image-close",
                payload: {
                  sessionId: sessionId,
                },
              })
            );
          }}
        >
          close
        </button>
      </div>
    </div>
  );
}

export default SlideControls;
