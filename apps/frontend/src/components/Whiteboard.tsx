import React, { useEffect, useRef, useState } from "react";
// import { socket, toDisplay } from "../recoil";
// import { useRecoilValue, useSetRecoilState } from "recoil";
import WhiteBoardControls from "./WhiteBoardControls";
import { userRole } from "../recoil";
import { useRecoilValue } from "recoil";

function Whiteboard() {
  const CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [action, setAction] = useState<"draw" | "erase" | null>(null);
  // const setToDisplay = useSetRecoilState(toDisplay);
  // const Socket = useRecoilValue(socket);
  const Role = useRecoilValue(userRole);
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
  }, []);

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
