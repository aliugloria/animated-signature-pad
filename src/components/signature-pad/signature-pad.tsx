import { AnimatePresence, motion } from "framer-motion";
import { CirclePlay, Eraser, PenLine } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import type { SignatureCanvasHandle } from "./signature-canvas";
import SignatureCanvas from "./signature-canvas";

const colorOptions = [
  { id: 1, color: "#FF0000" },
  { id: 2, color: "#00FF00" },
  { id: 3, color: "#0000FF" },
  { id: 4, color: "#00FFFF" },
  { id: 5, color: "#FF00FF" },
  { id: 6, color: "#FFFF00" },
  { id: 7, color: "#000000" },
];

const DEFAULT_COLOR = "#000000";
const REWIND_DURATION = 600;
const SIGNED_COLOR = "#000";  

const SignaturePad = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [svgPath, setSvgPath] = useState("");
  const [showSvg, setShowSvg] = useState(false);

  const canvasRef = useRef<SignatureCanvasHandle>(null);
  const coloredPathRef = useRef<SVGPathElement>(null);

  const buttonFillRef = useRef<HTMLDivElement>(null);

  const animFrameRef = useRef<number | null>(null);
  const currentOffsetRef = useRef(0);
  const pathLengthRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const sigDurationRef = useRef(2000);
  const isHoldingRef = useRef(false);

  const cancelAnimation = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    lastTimeRef.current = null;
  };

  const applyProgress = (progress: number) => {
    if (coloredPathRef.current) {
      const offset = pathLengthRef.current * (1 - progress);
      coloredPathRef.current.style.strokeDashoffset = `${offset}`;
    }
    if (buttonFillRef.current) {
      buttonFillRef.current.style.transform = `scaleX(${progress})`;
    }
  };

  const startForwardAnimation = () => {
    const step = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const speed = pathLengthRef.current / sigDurationRef.current;
      currentOffsetRef.current = Math.max(
        0,
        currentOffsetRef.current - speed * delta,
      );

      const progress = 1 - currentOffsetRef.current / pathLengthRef.current;
      applyProgress(progress);

      if (currentOffsetRef.current > 0) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
        setIsSigned(true);
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  };

  const startRewindAnimation = () => {
    if (pathLengthRef.current === 0) return;

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const speed = pathLengthRef.current / REWIND_DURATION;
      currentOffsetRef.current = Math.min(
        pathLengthRef.current,
        currentOffsetRef.current + speed * delta,
      );

      const progress = 1 - currentOffsetRef.current / pathLengthRef.current;
      applyProgress(progress);

      if (currentOffsetRef.current < pathLengthRef.current) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!showSvg || !svgPath) return;

    const timer = setTimeout(() => {
      if (!coloredPathRef.current) return;
      const length = coloredPathRef.current.getTotalLength();
      pathLengthRef.current = length;
      currentOffsetRef.current = length;
      coloredPathRef.current.style.strokeDasharray = `${length}`;
      coloredPathRef.current.style.strokeDashoffset = `${length}`;

      if (isHoldingRef.current) {
        lastTimeRef.current = null;
        startForwardAnimation();
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [showSvg, svgPath]);

  const handleHoldStart = () => {
    if (isSigned) return;
    isHoldingRef.current = true;

    if (!showSvg) {
      const path = canvasRef.current?.getSvgPath() ?? "";
      const duration = canvasRef.current?.getSigningDuration() ?? 2000;
      sigDurationRef.current = duration;
      setSvgPath(path);
      setShowSvg(true);
      return;
    }

    cancelAnimation();
    startForwardAnimation();
  };

  const handleHoldEnd = () => {
    if (isSigned) return;
    isHoldingRef.current = false;
    cancelAnimation();
    startRewindAnimation();
  };

  const handleErase = () => {
    cancelAnimation();
    isHoldingRef.current = false;
    canvasRef.current?.clearCanvas();
    setSelectedColor(DEFAULT_COLOR);
    setHasSignature(false);
    setIsSigned(false);
    setSvgPath("");
    setShowSvg(false);
    pathLengthRef.current = 0;
    currentOffsetRef.current = 0;
    if (buttonFillRef.current)
      buttonFillRef.current.style.transform = "scaleX(0)";
  };

  const handleReplay = () => {
    if (!hasSignature) return;

    cancelAnimation();
    isHoldingRef.current = false;

    if (!showSvg) {
      const path = canvasRef.current?.getSvgPath() ?? "";
      const duration = canvasRef.current?.getSigningDuration() ?? 2000;
      sigDurationRef.current = duration;
      setSvgPath(path);
      setShowSvg(true);
      isHoldingRef.current = true; 
      return;
    }

    if (coloredPathRef.current) {
      currentOffsetRef.current = pathLengthRef.current;
      coloredPathRef.current.style.strokeDashoffset = `${pathLengthRef.current}`;
    }
    if (buttonFillRef.current) {
      buttonFillRef.current.style.transform = "scaleX(0)";
    }

    setIsSigned(false);
    lastTimeRef.current = null;
    startForwardAnimation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-1000 flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex flex-col justify-between bg-white rounded-lg w-full max-w-2xl h-[500px] py-8 px-4 shadow-md border-2 border-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <p className="flex items-center gap-1">
                  <PenLine size={20} aria-label="draw-signature" />
                  Draw signature
                </p>
                <CirclePlay
                  size={20}
                  aria-label="replay-animation"
                  onClick={handleReplay}
                  className={`transition-opacity ${
                    hasSignature
                      ? "cursor-pointer opacity-100"
                      : "opacity-30 cursor-not-allowed"
                  }`}
                />
              
              </div>
              <div className="flex items-center gap-2">
                {colorOptions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedColor(item.color)}
                    className={`rounded-full h-6 w-6 shadow-md cursor-pointer border-2 transition-all ${
                      selectedColor === item.color
                        ? "scale-125 border-slate-400"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex-1 my-4 border border-dashed border-slate-200 rounded-md overflow-hidden">
              <div className={`w-full h-full ${showSvg ? "hidden" : "block"}`}>
                <SignatureCanvas
                  ref={canvasRef}
                  color={selectedColor}
                  onStrokeChange={setHasSignature}
                />
              </div>

              {showSvg && svgPath && (
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d={svgPath}
                    stroke="#d1d5db"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    ref={coloredPathRef}
                    d={svgPath}
                    stroke={selectedColor}
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <Eraser
                size={20}
                className="cursor-pointer"
                onClick={handleErase}
              />

              <button
                disabled={!hasSignature && !isSigned}
                onMouseDown={handleHoldStart}
                onMouseUp={handleHoldEnd}
                onMouseLeave={handleHoldEnd}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleHoldStart();
                }}
                onTouchEnd={handleHoldEnd}
                className={`relative overflow-hidden p-2 px-4 rounded-md font-medium transition-colors select-none ${
                  isSigned
                    ? "text-white"
                    : !hasSignature
                      ? "cursor-not-allowed pointer-events-none text-white"
                      : "cursor-pointer text-white"
                }`}
                style={{
                  backgroundColor: isSigned ? SIGNED_COLOR : "#e5e7eb",
                }}
              >
                {!isSigned && (
                  <div
                    ref={buttonFillRef}
                    className="absolute inset-0 origin-left"
                    style={{
                      backgroundColor: SIGNED_COLOR,
                      transform: "scaleX(0)",
                    }}
                  />
                )}

                <span className="relative z-10">
                  {isSigned ? "Signed ✓" : "Hold to confirm"}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignaturePad;
