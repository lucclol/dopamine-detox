"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const QUOTES = [
  "Average American checks their phone 144 times per day.",
  "Heavy social media users show measurable dopamine down-regulation within days.",
  "It takes 23 minutes to fully refocus after a single notification interruption.",
  "Teens now average 8+ hours of screen entertainment per day.",
  "Dopamine fasting is rooted in cognitive behavioral therapy, not a fad.",
];

export default function Home() {
  const router = useRouter();
  const [count, setCount] = useState<number | null>(null);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Hidden presenter-mode shortcut: press "P" anywhere on the home page.
  useEffect(() => {
    router.prefetch("/present");
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "p" || e.key === "P") router.push("/present");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Fetch live participant count.
  useEffect(() => {
    let alive = true;
    fetch("/api/checkins")
      .then((r) => r.json())
      .then((d) => { if (alive) setCount(d.total ?? 0); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // Rotate stat quotes every 4.5s.
  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="container">
      <div className="hero reveal" style={{ animationDelay: "0ms" }}>
        <button
          type="button"
          className="hero-dot"
          aria-label="Enter presenter mode"
          onClick={() => router.push("/present")}
        />
        <h1>24-Hour Stimulus Fast</h1>
        <p className="subtitle">
          A simple, science-backed reset for your focus, motivation, and mental clarity. One day. Three rules. See how different you feel.
        </p>
        <div className="live-row" aria-live="polite">
          <span className="live-dot" />
          <span>
            {count === null
              ? "Loading live stats…"
              : count === 0
              ? "Be the first to take the challenge"
              : `${count} ${count === 1 ? "person has" : "people have"} joined the challenge`}
          </span>
        </div>
        <div className="quote-rotator" aria-live="polite">
          {QUOTES.map((q, i) => (
            <span key={i} className={`quote ${i === quoteIdx ? "active" : ""}`}>
              {q}
            </span>
          ))}
        </div>
      </div>

      <div className="card reveal" style={{ animationDelay: "80ms" }}>
        <h2>The three rules</h2>
        <ul className="rules">
          <li>
            <div className="rule-content">
              <strong>No social media for 24 hours</strong>
              <span>Instagram, TikTok, X, Snapchat, Reddit, YouTube shorts. All of it.</span>
            </div>
          </li>
          <li>
            <div className="rule-content">
              <strong>Phone on Do Not Disturb</strong>
              <span>Calls and texts from real humans are fine. Notifications from apps are not.</span>
            </div>
          </li>
          <li>
            <div className="rule-content">
              <strong>Replace every scroll with one intentional activity</strong>
              <span>When you reach for your phone out of boredom, pick something below instead.</span>
            </div>
          </li>
        </ul>
      </div>

      <div className="card reveal" style={{ animationDelay: "160ms" }}>
        <h2>Things to do instead</h2>
        <ul className="suggestions">
          <li>Go for a walk without headphones</li>
          <li>Read a book or article you have been putting off</li>
          <li>Cook a real meal from scratch</li>
          <li>Call someone instead of texting</li>
          <li>Journal for 10 minutes</li>
          <li>Do a workout or stretch session</li>
          <li>Sit outside and just be bored for 15 minutes</li>
          <li>Work on a project you keep saying you will start</li>
        </ul>
      </div>

      <div className="card reveal" style={{ animationDelay: "240ms" }}>
        <h2>Why this works</h2>
        <p>
          Constant high-dopamine input from social media and gaming desensitizes your brain&apos;s reward system. Taking a structured break interrupts the compulsive loops and lets your baseline reset, so normal life starts feeling rewarding again.
        </p>
        <p style={{ marginTop: "0.75rem" }}>
          This is not pseudoscience. It is rooted in cognitive behavioral therapy, originally framed by UCSF clinical psychologist Dr. Cameron Sepah, and supported by research from Stanford addiction medicine.
        </p>

        <div className="meter-wrap" aria-hidden>
          <div className="meter-labels">
            <span>Dopamine baseline</span>
            <span className="meter-hint">Spike → reset → steady</span>
          </div>
          <div className="meter">
            <div className="meter-fill" />
            <div className="meter-marker meter-marker-high">High</div>
            <div className="meter-marker meter-marker-mid">Reset</div>
          </div>
        </div>
      </div>

      <div className="cta-row reveal" style={{ animationDelay: "320ms" }}>
        <Link href="/checkin" className="btn">Take the challenge</Link>
        <Link href="/results" className="btn btn-secondary">See class results</Link>
        <Link href="/qr" className="btn btn-secondary">Show QR code</Link>
      </div>

      <div className="footer">
        Created by Evan Cruz
      </div>
    </div>
  );
}
