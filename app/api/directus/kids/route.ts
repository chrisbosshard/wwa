export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { fetchKidsPage } from "@lib/directus/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const after = parseInt(searchParams.get("after") || "0", 10);
    const time =
      searchParams.get("time") || process.env.CAMPAIGN_SEASON_START || "2023-08-30T00:00:00.604014+00:00";
    const data = await fetchKidsPage(after, time);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch kids";
    console.error("GET /api/directus/kids", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
