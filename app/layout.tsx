import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "24-Hour Stimulus Fast Challenge",
  description: "A simple, science-backed challenge to reset your focus and mental clarity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
