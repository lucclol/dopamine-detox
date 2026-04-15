import { NextResponse } from "next/server";
import { getSql } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`SELECT COUNT(*)::int AS total FROM checkins`;
    return NextResponse.json({ total: rows[0]?.total ?? 0 });
  } catch (err) {
    return NextResponse.json({ total: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, focusBefore, focusAfter, moodBefore, moodAfter, reflection } = body;

    if (
      typeof focusBefore !== "number" ||
      typeof focusAfter !== "number" ||
      typeof moodBefore !== "number" ||
      typeof moodAfter !== "number"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const safeName = String(name || "Anonymous").slice(0, 50);
    const safeReflection = String(reflection || "").slice(0, 1000);

    const sql = getSql();
    await sql`
      INSERT INTO checkins (name, focus_before, focus_after, mood_before, mood_after, reflection)
      VALUES (${safeName}, ${focusBefore}, ${focusAfter}, ${moodBefore}, ${moodAfter}, ${safeReflection})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
