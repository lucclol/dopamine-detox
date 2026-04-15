import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>24-Hour Stimulus Fast</h1>
        <p className="subtitle">
          A simple, science-backed reset for your focus, motivation, and mental clarity. One day. Three rules. See how different you feel.
        </p>
      </div>

      <div className="card">
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

      <div className="card">
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

      <div className="card">
        <h2>Why this works</h2>
        <p>
          Constant high-dopamine input from social media and gaming desensitizes your brain&apos;s reward system. Taking a structured break interrupts the compulsive loops and lets your baseline reset, so normal life starts feeling rewarding again.
        </p>
        <p style={{ marginTop: "0.75rem" }}>
          This is not pseudoscience. It is rooted in cognitive behavioral therapy, originally framed by UCSF clinical psychologist Dr. Cameron Sepah, and supported by research from Stanford addiction medicine.
        </p>
      </div>

      <div className="cta-row">
        <Link href="/checkin" className="btn">Take the challenge</Link>
        <Link href="/results" className="btn btn-secondary">See class results</Link>
        <Link href="/qr" className="btn btn-secondary">Show QR code</Link>
        <Link href="/present" className="btn btn-secondary">Presenter mode</Link>
      </div>

      <div className="footer">
        Created for Communication 120 · Persuasive speech project
      </div>
    </div>
  );
}
