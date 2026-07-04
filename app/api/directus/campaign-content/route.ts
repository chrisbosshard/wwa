import { NextResponse } from "next/server";
import { fetchCampaignContent, fetchCampaignContentByState } from "@lib/directus/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");

    if (state) {
      const item = await fetchCampaignContentByState(state);
      if (!item) {
        return NextResponse.json(
          { error: `Campaign content for state "${state}" not found in CMS` },
          { status: 404, headers: { "Cache-Control": "no-store" } }
        );
      }
      return NextResponse.json({ content: item }, { headers: { "Cache-Control": "no-store" } });
    }

    const items = await fetchCampaignContent();
    return NextResponse.json({ content: items }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET /api/directus/campaign-content", error);
    return NextResponse.json({ error: "Failed to load campaign content from CMS" }, { status: 502 });
  }
}
