import { blockKid, connectKidToDonor, updateKid } from "@lib/directus/queries";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing kid id" });
  }

  try {
    if (req.method === "PATCH") {
      const { checkout, donorId, completed, ...rest } = req.body;

      if (donorId) {
        await connectKidToDonor(id, donorId);
        return res.status(200).json({ id });
      }

      if (checkout !== undefined) {
        await blockKid(id, checkout);
        return res.status(200).json({ id });
      }

      await updateKid(id, { completed, ...rest });
      return res.status(200).json({ id });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(`PATCH /api/directus/kids/${id}`, error);
    return res.status(500).json({ error: error.message || "Failed to update kid" });
  }
}
