import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { runDailyAutoGeneration } from "@/lib/server/content";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!env.cronSecret || authorization !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDailyAutoGeneration();

  return NextResponse.json({
    ok: true,
    processed: result.processed
  });
}
