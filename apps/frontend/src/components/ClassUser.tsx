import { MdOnlinePrediction } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function ClassUser({ title, sessionId }: { title: string; sessionId: string }) {
  const navigate = useNavigate();

  function joinSession() {
    navigate(`/session/${sessionId}`);
  }
  return (
    <li className="border border-neutral-700 mb-2 px-4 py-2 flex justify-between items-center rounded-xl">
      <div className="flex flex-col gap-3">
        <span className="text-neutral-300 font-thin">{title}</span>
        <div className="text-green-600 flex items-center gap-2 font-thin">
          <MdOnlinePrediction />
          <span>Active</span>
        </div>
      </div>
      <button
        onClick={() => joinSession()}
        className="bg-neutral-300 px-3 py-1 rounded-lg text-neutral-950 font-thin"
      >
        Join
      </button>
    </li>
  );
}

export default ClassUser;
