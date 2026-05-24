import {
    useRef,
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
  } from "react";
  
  type Point = { x: number; y: number; t: number };
  
  export type SignatureCanvasHandle = {
    clearCanvas: () => void;
    getStrokes: () => Point[][];
    getSvgPath: () => string;
    getSigningDuration: () => number;
  };
  
  type SignatureCanvasProps = {
    color?: string;
    onStrokeChange?: (hasSignature: boolean) => void;
  };
  
  const strokesToSvgPath = (strokes: Point[][]): string => {
    return strokes
      .map((stroke) => {
        if (stroke.length === 0) return "";
        const start = `M ${stroke[0].x} ${stroke[0].y}`;
        const rest = stroke.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
        return `${start} ${rest}`;
      })
      .join(" ");
  };
  
  const SignatureCanvas = forwardRef<SignatureCanvasHandle, SignatureCanvasProps>(
    ({ color = "#000000", onStrokeChange }, ref) => {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const isDrawing = useRef(false);
      const currentStroke = useRef<Point[]>([]);
      const lastPos = useRef<Point | null>(null);
      const [strokes, setStrokes] = useState<Point[][]>([]);
  
      useImperativeHandle(ref, () => ({
        clearCanvas: () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d")!;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setStrokes([]);
          onStrokeChange?.(false);
        },
        getStrokes: () => strokes,
        getSvgPath: () => strokesToSvgPath(strokes),
        getSigningDuration: () => {
          if (strokes.length === 0) return 2000;
          const firstPoint = strokes[0][0];
          const lastStroke = strokes[strokes.length - 1];
          const lastPoint = lastStroke[lastStroke.length - 1];
          return Math.max(lastPoint.t - firstPoint.t, 500);
        },
      }));
  
      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
      }, []);
  
      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.strokeStyle = color;
      }, [color]);
  
      const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top, t: Date.now() };
      };
  
      const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        isDrawing.current = true;
        currentStroke.current = [];
        const pos = getPos(e, canvas);
        lastPos.current = pos;
        currentStroke.current.push(pos);
      };
  
      const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current || !lastPos.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const pos = getPos(e, canvas);
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPos.current = pos;
        currentStroke.current.push(pos);
      };
  
      const stopDrawing = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        lastPos.current = null;
  
        if (currentStroke.current.length > 0) {
          const completed = currentStroke.current;
          setStrokes((prev) => [...prev, completed]);
          onStrokeChange?.(true);
        }
  
        currentStroke.current = [];
      };
  
      return (
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      );
    }
  );
  
  export default SignatureCanvas;