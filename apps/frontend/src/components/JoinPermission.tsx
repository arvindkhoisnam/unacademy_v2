import { ToastAction } from "@/components/ui/toast";

function JoinPermission({ Socket }: { Socket: WebSocket }) {
  return (
    <div className="flex gap-2">
      <ToastAction
        altText="Deny"
        className="bg-red-500 text-white hover:bg-red-700 border-0 text-xs font-extralight"
        onClick={() =>
          Socket.send(
            JSON.stringify({
              event: "join-permission",
              payload: "denied",
            })
          )
        }
      >
        Deny
      </ToastAction>
      <ToastAction
        altText="Accept"
        className="bg-green-500 text-white hover:bg-green-700 border-0 text-xs font-extralight"
        onClick={() =>
          Socket.send(
            JSON.stringify({ event: "join-permission", payload: "allowed" })
          )
        }
      >
        Accept
      </ToastAction>
    </div>
  );
}

export default JoinPermission;
