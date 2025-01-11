import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Participant } from "livekit-client";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socket } from "@/recoil";
function ParticipantControl() {
  const [open, setOpen] = useState(false);
  const [participants, setParticipants] = useState<
    { identity: string; isPublisher: boolean }[]
  >([]);
  const { sessionId } = useParams();
  const Socket = useRecoilValue(socket);
  async function getParticipants() {
    const res = await axios.get(
      `http://localhost:3000/api/v1/session/${sessionId}/participants`,
      { withCredentials: true }
    );
    const allParticipants = res.data.participants.map((p: Participant) => ({
      identity: p.identity,
      isPublisher: p.permission.canPublish,
    }));
    setParticipants(allParticipants);
  }
  async function removeParticiapnt(participant: string) {
    await axios.post(
      `http://localhost:3000/api/v1/session/${sessionId}/participant/remove`,
      {
        identity: participant,
      },
      { withCredentials: true }
    );
    Socket?.send(
      JSON.stringify({
        event: "remove-participant",
        payload: {
          sessionId: sessionId,
          participant: participant,
        },
      })
    );
    setParticipants((participants) =>
      participants.filter((p) => p.identity !== participant)
    );
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={getParticipants}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-zinc-300 font-thin h-8"
        >
          All Participants
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 border-0">
        <Command className="bg-zinc-200">
          <CommandList>
            <CommandGroup>
              {participants.map((participant) => (
                <CommandItem
                  key={participant.identity}
                  className="text-zinc-900 hover:bg-zinc-400 flex justify-between"
                >
                  {participant.identity}
                  {!participant.isPublisher && (
                    <button
                      className="bg-red-600 cursor-pointer px-2 py-1 rounded-lg text-zinc-200"
                      onClick={() => removeParticiapnt(participant.identity)}
                    >
                      remove
                    </button>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ParticipantControl;
