"use client";

import { useState } from "react";

export default function CompareSlider({
  focusBefore,
  focusAfter,
  moodBefore,
  moodAfter,
}: {
  focusBefore: number;
  focusAfter: number;
  moodBefore: number;
  moodAfter: number;
}) {
  const [divider, setDivider] = useState(50);

  return (
    <div className="slider-card">
      <Row label="Focus" before={focusBefore} after={focusAfter} divider={divider} />
      <Row label="Mood" before={moodBefore} after={moodAfter} divider={divider} />
      <input
        type="range"
        min={0}
        max={100}
        value={divider}
        onChange={(e) => setDivider(Number(e.target.value))}
        className="slider-range"
        aria-label="Before / after comparison"
      />
    </div>
  );
}

function Row({
  label,
  before,
  after,
  divider,
}: {
  label: string;
  before: number;
  after: number;
  divider: number;
}) {
  const beforePct = (before / 10) * 100;
  const afterPct = (after / 10) * 100;
  const delta = after - before;
  return (
    <div className="slider-row">
      <label>{label}</label>
      <div
        className="slider-track"
        style={{
          ["--before" as any]: `${beforePct}%`,
          ["--after" as any]: `${afterPct}%`,
          ["--divider" as any]: `${divider}%`,
        }}
      >
        <div className="slider-before">before {before.toFixed(1)}</div>
        <div className="slider-after">after {after.toFixed(1)}</div>
        <div className="slider-handle" />
      </div>
      <div className="slider-delta">{delta >= 0 ? "+" : ""}{delta.toFixed(1)}</div>
    </div>
  );
}
