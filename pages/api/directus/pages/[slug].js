import { fetchPageBySlug } from "@lib/directus/queries";
import { getAssetUrl } from "@lib/directus/client";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const page = await fetchPageBySlug(req.query.slug);
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    return res.status(200).json({
      ...page,
      heroImageUrl: getAssetUrl(page.hero_image),
    });
  } catch (error) {
    console.error("GET /api/directus/pages", error);
    return res.status(500).json({ error: error.message || "Failed to fetch page" });
  }
}
