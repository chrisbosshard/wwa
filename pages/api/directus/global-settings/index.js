import { fetchGlobalSettings } from "@lib/directus/queries";
import { getAssetUrl } from "@lib/directus/client";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const settings = await fetchGlobalSettings();
    return res.status(200).json({
      ...settings,
      siteLogoUrl: getAssetUrl(settings.site_logo),
      heroLogoUrl: getAssetUrl(settings.hero_logo),
      siteLogoWhiteUrl: getAssetUrl(settings.site_logo_white),
    });
  } catch (error) {
    console.error("GET /api/directus/global-settings", error);
    return res.status(500).json({ error: error.message || "Failed to fetch settings" });
  }
}
