import { fetchApplication } from "@lib/directus/queries";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const application = await fetchApplication();
    return res.status(200).json({ application });
  } catch (error) {
    console.error("GET /api/directus/application", error);
    return res.status(500).json({ error: error.message || "Failed to fetch application state" });
  }
}
