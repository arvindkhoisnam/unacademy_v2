import React, { useEffect, useRef, useState } from "react";
import { socket, toDisplay, whiteBoardState } from "../recoil";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
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
  const [WhiteBoardState, setWhiteBoardState] = useRecoilState(whiteBoardState);

  useEffect(() => {
    const canvas = CanvasRef.current;
    if (!canvas) return;

    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ContextRef.current = ctx;
    }

    if (WhiteBoardState.length > 0) {
      const canvas = CanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { height, width } = canvas.getBoundingClientRect();

      const xTimes = width / WhiteBoardState[0].adminWidth;
      const yTimes = height / WhiteBoardState[0].adminHeight;
      let xStart = WhiteBoardState[0].x * xTimes;
      let yStart = WhiteBoardState[0].y * yTimes;
      for (let i = 1; i < WhiteBoardState.length; i++) {
        const newX = xTimes * WhiteBoardState[i].x;
        const newY = yTimes * WhiteBoardState[i].y;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(newX, newY);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        xStart = newX;
        yStart = newY;
      }
    }

    function handleEvents(event: MessageEvent) {
      const parsed = JSON.parse(event.data);
      const canvas = CanvasRef.current;
      const ctx = canvas?.getContext("2d");
      const { height, width } = canvas!.getBoundingClientRect();

      if (!ctx) return;

      switch (parsed.event) {
        case "whiteBoard-draw":
          setAction("draw");
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          break;
        case "start-drawing-board": {
          const xTimes = Number(width) / Number(parsed.payload.adminWidth);
          const yTimes = Number(height) / Number(parsed.payload.adminHeight);
          const newX = xTimes * parsed.payload.x;
          const newY = yTimes * parsed.payload.y;
          ctx.beginPath();
          ctx.moveTo(newX, newY);
          break;
        }
        case "move-drawing-board": {
          const xTimes = Number(width) / Number(parsed.payload.adminWidth);
          const yTimes = Number(height) / Number(parsed.payload.adminHeight);
          const newX = xTimes * parsed.payload.x;
          const newY = yTimes * parsed.payload.y;
          ctx.lineTo(newX, newY);
          ctx.stroke();
          break;
        }
        case "whiteBoard-color-change":
          ctx.strokeStyle = parsed.payload.strokeStyle;
          break;
        case "whiteBoard-erase":
          ctx.strokeStyle = "#d4d4d4";
          ctx.lineWidth = 20;
          break;
        case "whiteBoard-clear":
          clearCanvas();
          break;
        case "whiteBoard-close":
          setWhiteBoardState([]);
          setToDisplay("video");
          break;
        default:
          break;
      }
    }

    Socket?.addEventListener("message", handleEvents);

    return () => {
      Socket?.removeEventListener("message", handleEvents);
    };
  }, [Socket, setToDisplay, WhiteBoardState, setWhiteBoardState]);

  function start(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const canvas = CanvasRef.current;
    const ctx = ContextRef.current;
    if (!canvas || !ctx) return;

    setIsDrawing(true);
    const { left, top, height, width } = canvas.getBoundingClientRect();
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
          adminHeight: height,
          adminWidth: width,
        },
      })
    );
  }
  function draw(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!isDrawing || action === null) return;

    const canvas = CanvasRef.current;
    const ctx = ContextRef.current;
    if (!canvas || !ctx) return;
    const { left, top, height, width } = canvas.getBoundingClientRect();
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
          adminHeight: height,
          adminWidth: width,
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
