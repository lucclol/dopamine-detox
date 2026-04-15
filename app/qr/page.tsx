"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function QRPage() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  const qrSrc = url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=20&data=${encodeURIComponent(url)}`
    : "";

  return (
    <div className="container">
      <Link href="/" className="back-btn">Back</Link>
      <div className="hero">
        <h1>Scan to join</h1>
        <p className="subtitle">Point your phone camera at the code below.</p>
      </div>

      <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
        {qrSrc && (
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", display: "inline-block" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="QR code" style={{ display: "block", maxWidth: "100%", width: "400px", height: "400px" }} />
          </div>
        )}
        <p style={{ marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.95rem", wordBreak: "break-all" }}>
          {url}
        </p>
      </div>

      <div className="cta-row">
        <Link href="/" className="btn btn-secondary">Back to start</Link>
      </div>
    </div>
  );
}
