"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PresentPage() {
  const [revealing, setRevealing] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 50, y: 50 });
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/qr");
    router.prefetch("/");
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") router.push("/");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  function handleClick(e: React.MouseEvent) {
    if (revealing) return;
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setClickPos({ x, y });
    setRevealing(true);
    setTimeout(() => router.push("/qr"), 1300);
  }

  function goBack(e: React.MouseEvent) {
    e.stopPropagation();
    router.push("/");
  }

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; background: #000; overflow: hidden; height: 100%; }
        .stage {
          position: fixed; inset: 0; background: #000; cursor: pointer;
          overflow: hidden;
        }

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

        /* Color wash expanding from click point — ends in black for a
           seamless fade into the next page */
        .fill {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--x) var(--y),
            #a78bfa 0%,
            #7c3aed 8%,
            #4c1d95 18%,
            #1e003e 32%,
            #000 55%);
          opacity: 0;
          transform: scale(0);
          transform-origin: var(--x) var(--y);
          pointer-events: none;
        }
        .revealing .fill { animation: fill 1.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fill {
          0%   { transform: scale(0);   opacity: 0; }
          12%  { opacity: 1; }
          100% { transform: scale(5);   opacity: 1; }
        }

        /* Final smooth fade to black for a seamless handoff */
        .fadeout {
          position: absolute;
          inset: 0;
          background: #000;
          opacity: 0;
          pointer-events: none;
        }
        .revealing .fadeout { animation: fadeout 1.3s ease-in forwards; }
        @keyframes fadeout {
          0%, 55% { opacity: 0; }
          100%    { opacity: 1; }
        }

        /* Subtle back chevron in the top-left, only visible on hover */
        .present-back {
          position: absolute;
          top: 1.25rem;
          left: 1.5rem;
          z-index: 10;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.1);
          font-size: 1.75rem;
          line-height: 1;
          cursor: pointer;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .present-back:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }
        .revealing .present-back { opacity: 0; pointer-events: none; }
      `}</style>
      <div
        className={`stage ${revealing ? "revealing" : ""}`}
        onClick={handleClick}
        style={{ ["--x" as any]: `${clickPos.x}%`, ["--y" as any]: `${clickPos.y}%` }}
      >
        <button
          type="button"
          className="present-back"
          onClick={goBack}
          aria-label="Back to home"
        >
          ←
        </button>
        <div className="ring ring1" />
        <div className="ring ring2" />
        <div className="ring ring3" />
        <div className="fill" />
        <div className="fadeout" />
      </div>
    </>
  );
}
