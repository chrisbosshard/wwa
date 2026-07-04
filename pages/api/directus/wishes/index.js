import { fetchWishes } from "@lib/directus/queries";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await fetchWishes();
      return res.status(200).json(data);
    } catch (error) {
      console.error("GET /api/directus/wishes", error);
      return res.status(500).json({ error: error.message || "Failed to fetch wishes" });
    }
  }

  if (req.method === "POST") {
    try {
      const { createWish } = await import("@lib/directus/queries");
      const result = await createWish(req.body.data);
      return res.status(201).json({ createWish: { id: result.id } });
    } catch (error) {
      console.error("POST /api/directus/wishes", error);
      return res.status(500).json({ error: error.message || "Failed to create wish" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
