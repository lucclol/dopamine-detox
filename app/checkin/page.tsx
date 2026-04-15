"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckinPage() {
  const [stage, setStage] = useState<"before" | "after">("before");
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
      <div className="hero">
        <h1>Check in</h1>
        <p className="subtitle">
          Rate yourself before and after the 24-hour challenge. Takes about a minute.
        </p>
      </div>

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
