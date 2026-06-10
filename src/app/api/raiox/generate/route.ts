import { NextResponse } from "next/server";

/**
 * POST /api/raiox/generate
 *
 * STUB — will be implemented in the report pipeline phase.
 *
 * Expected flow:
 * 1. Receives { leadId: string }
 * 2. Fetches the lead from raiox_leads
 * 3. Runs raiox-collect.mjs to gather blockF.json (7-pillar audit data)
 * 4. Combines blockF.json + manual notes
 * 5. Calls Claude API with raiox-report-prompt.md to generate the PDF report
 * 6. Sends the PDF via Evolution API WhatsApp
 * 7. Updates lead status to 'delivered'
 *
 * TODO: Implement collector integration
 * TODO: Implement Claude API call with report prompt
 * TODO: Implement PDF generation
 * TODO: Implement WhatsApp PDF delivery
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Not implemented",
      message:
        "Report generation stub. Will integrate raiox-collect.mjs + raiox-report-prompt.md in the next phase.",
    },
    { status: 501 }
  );
}
