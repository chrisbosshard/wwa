import { NextResponse } from "next/server";
import { fetchCampaignContent, fetchCampaignContentByState } from "@lib/directus/queries";
import { CAMPAIGN_CONTENT_DEFAULTS } from "@lib/directus/campaign-content-defaults";
import type { CampaignContentState } from "@lib/directus/schema";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");

    if (state) {
      const item = await fetchCampaignContentByState(state);
      return NextResponse.json(
        { content: item },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const items = await fetchCampaignContent();
    return NextResponse.json(
      { content: items },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET /api/directus/campaign-content", error);
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    if (state && state in CAMPAIGN_CONTENT_DEFAULTS) {
      return NextResponse.json({
        content: CAMPAIGN_CONTENT_DEFAULTS[state as CampaignContentState],
      });
    }
    return NextResponse.json({ content: Object.values(CAMPAIGN_CONTENT_DEFAULTS) });
  }
}
