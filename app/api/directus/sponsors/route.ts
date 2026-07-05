import { NextResponse } from "next/server";
import { fetchSponsors } from "@lib/directus/queries";
import type { Sponsor } from "@lib/directus/schema";
import { getFooterSponsors, mapDisplaySponsors } from "@lib/directus/sponsors";

export async function GET() {
  try {
    const sponsors = ((await fetchSponsors()) ?? []) as Sponsor[];
    const footer = getFooterSponsors(sponsors);

    return NextResponse.json({
      sponsors: mapDisplaySponsors(sponsors),
      footer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch sponsors";
    console.error("GET /api/directus/sponsors", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
