import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { CURRENT_COHORT, COHORT_LIMIT } from "@/lib/raiox-cohort";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  try {
    const [{ taken }] = await query<{ taken: number }>(
      `select count(*)::int as taken from raiox_leads where cohort = $1 and status <> 'waitlist'`,
      [CURRENT_COHORT]
    );
    return NextResponse.json({ remaining: Math.max(0, COHORT_LIMIT - taken) });
  } catch (error) {
    console.error("[api/raiox/vagas] count error:", error);
    return NextResponse.json({ remaining: COHORT_LIMIT });
  }
}
