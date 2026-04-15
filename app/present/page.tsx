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
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setClickPos({ x, y });
    setRevealing(true);
    setTimeout(() => router.push("/qr"), 1200);
  }

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; background: #000; overflow: hidden; height: 100%; }
        .stage {
          position: fixed; inset: 0; background: #000; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .reveal {
          position: fixed; inset: 0; pointer-events: none;
          background: radial-gradient(circle at var(--x) var(--y),
            #7c3aed 0%, #7c3aed var(--r), transparent calc(var(--r) + 1%));
          transition: --r 1.1s cubic-bezier(0.65, 0, 0.35, 1);
          --r: 0%;
        }
        .reveal.active { --r: 200%; }
        @property --r {
          syntax: '<percentage>';
          initial-value: 0%;
          inherits: false;
        }
        .hint {
          color: rgba(255, 255, 255, 0.04);
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          user-select: none;
          transition: opacity 0.3s;
        }
        .stage:hover .hint { color: rgba(255, 255, 255, 0.15); }
        .revealing .hint { opacity: 0; }
      `}</style>
      <div className={`stage ${revealing ? "revealing" : ""}`} onClick={handleClick}>
        <span className="hint">click anywhere</span>
        <div
          className={`reveal ${revealing ? "active" : ""}`}
          style={{ ["--x" as any]: `${clickPos.x}%`, ["--y" as any]: `${clickPos.y}%` }}
        />
      </div>
    </>
  );
}
