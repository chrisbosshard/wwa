import { createFamilyWithKids } from "@lib/directus/queries";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data, kids, imageId } = req.body;
    const family = await createFamilyWithKids(data, kids, imageId);
    return res.status(201).json({ createFamily: { id: family.id } });
  } catch (error) {
    console.error("POST /api/directus/families", error);
    return res.status(500).json({ error: error.message || "Failed to create family" });
  }
}
