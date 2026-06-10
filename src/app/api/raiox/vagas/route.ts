import { NextResponse } from "next/server";
import { getSupabase, CURRENT_COHORT, COHORT_LIMIT } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const { count, error } = await getSupabase()
    .from("raiox_leads")
    .select("*", { count: "exact", head: true })
    .eq("cohort", CURRENT_COHORT)
    .neq("status", "waitlist");

  if (error) {
    console.error("Supabase count error:", error);
    return NextResponse.json({ remaining: COHORT_LIMIT });
  }

  const remaining = Math.max(0, COHORT_LIMIT - (count ?? 0));
  return NextResponse.json({ remaining });
}
