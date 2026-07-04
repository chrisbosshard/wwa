import { fetchKidsPage } from "@lib/directus/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const after = parseInt(req.query.after || "0", 10);
    const time = req.query.time || process.env.CAMPAIGN_SEASON_START || "2023-08-30T00:00:00.604014+00:00";
    const data = await fetchKidsPage(after, time);
    return res.status(200).json(data);
  } catch (error) {
    console.error("GET /api/directus/kids", error);
    return res.status(500).json({ error: error.message || "Failed to fetch kids" });
  }
}
