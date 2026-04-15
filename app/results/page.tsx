import Link from "next/link";
import { getSql } from "../../lib/db";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const sql = getSql();
    const statsRows = await sql`
      SELECT 
        COUNT(*)::int AS total,
        AVG(focus_before)::float AS avg_focus_before,
        AVG(focus_after)::float AS avg_focus_after,
        AVG(mood_before)::float AS avg_mood_before,
        AVG(mood_after)::float AS avg_mood_after
      FROM checkins
    `;
    const reflectionRows = await sql`
      SELECT name, reflection, created_at
      FROM checkins
      WHERE reflection IS NOT NULL AND reflection != ''
      ORDER BY created_at DESC
      LIMIT 10
    `;
    return { stats: statsRows[0], reflections: reflectionRows };
  } catch (err) {
    return { stats: null, reflections: [] };
  }
}

export default async function ResultsPage() {
  const { stats, reflections } = await getStats();

  return (
    <div className="container">
      <div className="hero">
        <h1>Class results</h1>
        <p className="subtitle">Live data from everyone who took the challenge.</p>
      </div>

      {!stats || stats.total === 0 ? (
        <div className="card">
          <p style={{ textAlign: "center" }}>No responses yet. Be the first.</p>
          <div className="cta-row">
            <Link href="/checkin" className="btn">Take the challenge</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Participants</div>
            </div>
            <div className="stat">
              <div className="stat-number">
                +{(stats.avg_focus_after - stats.avg_focus_before).toFixed(1)}
              </div>
              <div className="stat-label">Avg focus change</div>
            </div>
            <div className="stat">
              <div className="stat-number">
                +{(stats.avg_mood_after - stats.avg_mood_before).toFixed(1)}
              </div>
              <div className="stat-label">Avg mood change</div>
            </div>
          </div>

          <div className="card">
            <h2>The numbers</h2>
            <p>Focus: {stats.avg_focus_before.toFixed(1)} → {stats.avg_focus_after.toFixed(1)}</p>
            <p>Mood: {stats.avg_mood_before.toFixed(1)} → {stats.avg_mood_after.toFixed(1)}</p>
          </div>

          {reflections.length > 0 && (
            <div className="card">
              <h2>What people said</h2>
              {reflections.map((r: any, i: number) => (
                <div key={i} style={{ padding: "1rem 0", borderBottom: i < reflections.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <p style={{ color: "var(--text)" }}>&ldquo;{r.reflection}&rdquo;</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    — {r.name || "Anonymous"}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="cta-row">
            <Link href="/checkin" className="btn">Submit your own</Link>
            <Link href="/" className="btn btn-secondary">Back to start</Link>
          </div>
        </>
      )}
    </div>
  );
}
