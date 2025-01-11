import { SetStateAction } from "react";
import { TbFileUpload } from "react-icons/tb";
import { imageCurrPage } from "../recoil";
import { useSetRecoilState } from "recoil";

function UploadButton({
  setToDisplay,
  uploadPdf,
}: {
  setToDisplay: React.Dispatch<SetStateAction<"video" | "image" | "board">>;
  uploadPdf: () => Promise<void>;
}) {
  const setCurrPage = useSetRecoilState(imageCurrPage);
  return (
    <div className="group flex flex-col items-center cursor-pointer">
      <TbFileUpload
        className="text-sm"
        onClick={async () => {
          await uploadPdf();
          setCurrPage(0);
          setToDisplay("image");
        }}
      />
      <span className="text-zinc-600 text-xs group-hover:text-blue-200 font-thin">
        Upload
      </span>
    </div>
  );
}

export default UploadButton;
