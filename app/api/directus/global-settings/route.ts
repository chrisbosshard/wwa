import { NextResponse } from "next/server";
import { fetchGlobalSettings } from "@lib/directus/queries";
import { getAssetUrl } from "@lib/directus/client";

export async function GET() {
  try {
    const settings = await fetchGlobalSettings();
    return NextResponse.json({
      ...settings,
      siteLogoUrl: getAssetUrl(settings.site_logo),
      heroLogoUrl: getAssetUrl(settings.hero_logo),
      siteLogoWhiteUrl: getAssetUrl(settings.site_logo_white),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch settings";
    console.error("GET /api/directus/global-settings", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
