"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PresentPage() {
  const [revealing, setRevealing] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 50, y: 50 });
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/qr");
  }, [router]);

  function handleClick(e: React.MouseEvent) {
    if (revealing) return;
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setClickPos({ x, y });
    setRevealing(true);
    setTimeout(() => router.push("/qr"), 1300);
  }

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; background: #000; overflow: hidden; height: 100%; }
        .stage {
          position: fixed; inset: 0; background: #000; cursor: pointer;
          overflow: hidden;
        }

        /* Ambient breathing dot before click */
        .pulse {
          position: absolute;
          left: 50%; top: 50%;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #7c3aed;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 60px 20px rgba(124, 58, 237, 0.35);
          animation: breathe 3.2s ease-in-out infinite;
          transition: opacity 0.15s;
        }
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.55; }
          50%      { transform: translate(-50%, -50%) scale(1.9); opacity: 1; }
        }
        .revealing .pulse { opacity: 0; }

        /* Shockwave rings out of the click point */
        .ring {
          position: absolute;
          left: var(--x); top: var(--y);
          width: 0; height: 0;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .revealing .ring1 {
          animation: ring 1.15s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
          border: 3px solid rgba(255, 255, 255, 0.95);
        }
        .revealing .ring2 {
          animation: ring 1.15s cubic-bezier(0.2, 0.7, 0.2, 1) 0.08s forwards;
          border: 2px solid rgba(124, 58, 237, 0.95);
        }
        .revealing .ring3 {
          animation: ring 1.15s cubic-bezier(0.2, 0.7, 0.2, 1) 0.16s forwards;
          border: 2px solid rgba(236, 72, 153, 0.8);
        }
        @keyframes ring {
          0%   { width: 0; height: 0; opacity: 1; }
          60%  { opacity: 1; }
          100% { width: 320vmax; height: 320vmax; opacity: 0; }
        }

        /* Color wash expanding from click point */
        .fill {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--x) var(--y),
            #ffffff 0%,
            #a78bfa 12%,
            #7c3aed 24%,
            #1e003e 48%,
            #000 70%);
          opacity: 0;
          transform: scale(0);
          transform-origin: var(--x) var(--y);
          pointer-events: none;
        }
        .revealing .fill { animation: fill 1.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fill {
          0%   { transform: scale(0);   opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: scale(4.5); opacity: 1; }
        }

        /* Final white flash + subtle chromatic shimmer */
        .flash {
          position: absolute;
          inset: 0;
          background: #fff;
          opacity: 0;
          pointer-events: none;
        }
        .revealing .flash { animation: flash 1.3s ease-in forwards; }
        @keyframes flash {
          0%, 55% { opacity: 0; }
          80%     { opacity: 0.9; }
          100%    { opacity: 1; }
        }

        /* Whole stage takes a tiny breath inward on click */
        .revealing .stage-inner {
          animation: inhale 0.4s ease-out forwards;
        }
        @keyframes inhale {
          0%   { transform: scale(1); filter: blur(0); }
          100% { transform: scale(1.04); filter: blur(1px); }
        }
        .stage-inner {
          position: absolute; inset: 0;
          will-change: transform, filter;
        }
      `}</style>
      <div
        className={`stage ${revealing ? "revealing" : ""}`}
        onClick={handleClick}
        style={{ ["--x" as any]: `${clickPos.x}%`, ["--y" as any]: `${clickPos.y}%` }}
      >
        <div className="stage-inner">
          <div className="pulse" />
        </div>
        <div className="ring ring1" />
        <div className="ring ring2" />
        <div className="ring ring3" />
        <div className="fill" />
        <div className="flash" />
      </div>
    </>
  );
}
