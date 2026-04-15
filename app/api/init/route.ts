import { NextResponse } from "next/server";
import { getSql } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS checkins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        focus_before INT NOT NULL,
        focus_after INT NOT NULL,
        mood_before INT NOT NULL,
        mood_after INT NOT NULL,
        reflection TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    return NextResponse.json({ ok: true, message: "Table ready" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
