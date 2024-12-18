import React, { useEffect, useRef, useState } from "react";
import { socket, toDisplay } from "../recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import WhiteBoardControls from "./WhiteBoardControls";
import { userRole } from "../recoil";
import { useParams } from "react-router-dom";

function Whiteboard() {
  const CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [action, setAction] = useState<"draw" | "erase" | null>(null);
  const Socket = useRecoilValue(socket);
  const Role = useRecoilValue(userRole);
  const { sessionId } = useParams();
  const setToDisplay = useSetRecoilState(toDisplay);

  useEffect(() => {
    const canvas = CanvasRef.current;
    if (!canvas) return;

    canvas.height = canvas?.offsetHeight;
    canvas.width = canvas?.offsetWidth;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ContextRef.current = ctx;
    }

    Socket!.onmessage = (message) => {
      const parsed = JSON.parse(message.data as unknown as string);
      const canvas = CanvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;
      switch (parsed.event) {
        case "start-drawing-board":
          setAction("draw");
          setColor("black");
          ctx.beginPath();
          ctx.moveTo(parsed.payload.x, parsed.payload.y);
          break;
        case "move-drawing-board":
          ctx.lineTo(parsed.payload.x, parsed.payload.y);
          ctx.stroke();
          break;
        case "whiteBoard-close":
          setToDisplay("video");
          break;
      }
    };
  }, [Socket, setToDisplay]);

  function start(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const canvas = CanvasRef.current;
    const ctx = ContextRef.current;
    if (!canvas || !ctx) return;

    setIsDrawing(true);
    const { left, top } = canvas.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    Socket?.send(
      JSON.stringify({
        event: "start-drawing-board",
        payload: {
          sessionId: sessionId,
          x: x,
          y: y,
        },
      })
    );
  }
  function draw(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!isDrawing || action === null) return;

    const canvas = CanvasRef.current;
    const ctx = ContextRef.current;
    if (!canvas || !ctx) return;
    const { left, top } = canvas.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    if (action === "erase") {
      ctx.lineWidth = 20;
    } else {
      ctx.lineWidth = 2;
    }
    ctx.stroke();
    Socket?.send(
      JSON.stringify({
        event: "move-drawing-board",
        payload: {
          sessionId: sessionId,
          x: x,
          y: y,
        },
      })
    );
  }

  function stop() {
    setIsDrawing(false);
  }

  const clearCanvas = () => {
    const canvas = CanvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="h-[90%] mb-2">
      <canvas
        className="h-[90%] w-full bg-neutral-300 rounded-xl cursor-crosshair mb-4"
        ref={CanvasRef}
        onMouseDown={(e) => start(e)}
        onMouseMove={(e) => draw(e)}
        onMouseUp={stop}
      />
      {Role === "admin" && (
        <WhiteBoardControls
          action={action}
          setAction={setAction}
          setColor={setColor}
          clearCanvas={clearCanvas}
        />
      )}
    </div>
  );
}

export default Whiteboard;
