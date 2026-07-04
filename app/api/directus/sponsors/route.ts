import { NextResponse } from "next/server";
import { fetchSponsors } from "@lib/directus/queries";
import { getAssetUrl } from "@lib/directus/client";

export async function GET() {
  try {
    const sponsors = await fetchSponsors();
    const mapped = sponsors.map((s) => ({
      id: s.id,
      name: s.name,
      link: s.link,
      featured: s.featured,
      logoUrl: getAssetUrl(s.logo),
    }));
    return NextResponse.json({ sponsors: mapped });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch sponsors";
    console.error("GET /api/directus/sponsors", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
