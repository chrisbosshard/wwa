import { fetchSponsors } from "@lib/directus/queries";
import { getAssetUrl } from "@lib/directus/client";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sponsors = await fetchSponsors();
    const mapped = sponsors.map((s) => ({
      id: s.id,
      name: s.name,
      link: s.link,
      featured: s.featured,
      logoUrl: getAssetUrl(s.logo),
    }));
    return res.status(200).json({ sponsors: mapped });
  } catch (error) {
    console.error("GET /api/directus/sponsors", error);
    return res.status(500).json({ error: error.message || "Failed to fetch sponsors" });
  }
}
