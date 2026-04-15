"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const START_KEY = "scrollfast:startedAt";
const DURATION_MS = 24 * 60 * 60 * 1000;

function formatRemaining(ms: number) {
  const clamped = Math.max(0, ms);
  const h = Math.floor(clamped / 3_600_000);
  const m = Math.floor((clamped % 3_600_000) / 60_000);
  const s = Math.floor((clamped % 60_000) / 1000);
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
    done: clamped === 0,
  };
}

function Countdown() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const stored = localStorage.getItem(START_KEY);
    if (stored) {
      const n = Number(stored);
      if (!Number.isNaN(n)) setStartedAt(n);
    }
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = useMemo(() => {
    if (!startedAt) return null;
    return formatRemaining(startedAt + DURATION_MS - now);
  }, [startedAt, now]);

  function start() {
    const t = Date.now();
    localStorage.setItem(START_KEY, String(t));
    setStartedAt(t);
  }

  function reset() {
    localStorage.removeItem(START_KEY);
    setStartedAt(null);
  }

  if (!startedAt) {
    return (
      <div className="card countdown-card">
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Start the clock now and come back in 24 hours to fill out the &ldquo;after&rdquo; scores.
        </p>
        <button type="button" className="btn" onClick={start} style={{ marginTop: "0.75rem" }}>
          Start my 24 hours
        </button>
      </div>
    );
  }

  return (
    <div className="card countdown-card">
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {remaining?.done ? "24 hours complete" : "Time remaining"}
      </p>
      <div className={`countdown ${remaining?.done ? "countdown-done" : ""}`}>
        <span>{remaining?.h}</span><small>h</small>
        <span>{remaining?.m}</span><small>m</small>
        <span>{remaining?.s}</span><small>s</small>
      </div>
      <button
        type="button"
        onClick={reset}
        style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline" }}
      >
        reset timer
      </button>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 60 });
  const colors = ["#7c3aed", "#a78bfa", "#10b981", "#f59e0b", "#ec4899", "#ffffff"];
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const dx = (Math.random() - 0.5) * 300;
        const delay = Math.random() * 0.4;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              background: color,
              animationDelay: `${delay}s`,
              ["--dx" as any]: `${dx}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function CheckinPage() {
  const [focusBefore, setFocusBefore] = useState<number | null>(null);
  const [focusAfter, setFocusAfter] = useState<number | null>(null);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (focusBefore === null || focusAfter === null || moodBefore === null || moodAfter === null) {
      setError("Please rate all four scales.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Anonymous",
          focusBefore,
          focusAfter,
          moodBefore,
          moodAfter,
          reflection,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="container">
        <Confetti />
        <div className="card success">
          <div className="success-icon">✓</div>
          <h2>Submitted</h2>
          <p style={{ marginTop: "0.5rem" }}>
            Thanks for participating. Your response has been recorded.
          </p>
          <div className="cta-row">
            <Link href="/results" className="btn">See class results</Link>
            <Link href="/" className="btn btn-secondary">Back to start</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href="/" className="back-btn">Back</Link>
      <div className="hero">
        <h1>Check in</h1>
        <p className="subtitle">
          Rate yourself before and after the 24-hour challenge. Takes about a minute.
        </p>
      </div>

      <Countdown />

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="field">
            <label htmlFor="name">Name (optional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name only is fine"
            />
          </div>

          <div className="field">
            <label>Before the fast — rate your focus (1 = scattered, 10 = locked in)</label>
            <RatingScale value={focusBefore} onChange={setFocusBefore} />
          </div>

          <div className="field">
            <label>Before the fast — rate your mood (1 = anxious or low, 10 = great)</label>
            <RatingScale value={moodBefore} onChange={setMoodBefore} />
          </div>

          <div className="field">
            <label>After the fast — rate your focus (1 = scattered, 10 = locked in)</label>
            <RatingScale value={focusAfter} onChange={setFocusAfter} />
          </div>

          <div className="field">
            <label>After the fast — rate your mood (1 = anxious or low, 10 = great)</label>
            <RatingScale value={moodAfter} onChange={setMoodAfter} />
          </div>

          <div className="field">
            <label htmlFor="reflection">What surprised you? (optional)</label>
            <textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Anything you noticed, struggled with, or enjoyed."
            />
          </div>

          {error && <p style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</p>}

          <button type="submit" className="btn btn-block" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit response"}
          </button>
        </div>
      </form>
    </div>
  );
}

function RatingScale({ value, onChange }: { value: number | null; onChange: (n: number) => void }) {
  return (
    <div className="rating-group">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <button
          key={n}
          type="button"
          className={`rating-btn ${value === n ? "selected" : ""}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
