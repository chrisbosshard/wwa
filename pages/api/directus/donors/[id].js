import { updateDonorPayment } from "@lib/directus/queries";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      await updateDonorPayment(id);
      return res.status(200).json({ id });
    } catch (error) {
      console.error(`PATCH /api/directus/donors/${id}`, error);
      return res.status(500).json({ error: error.message || "Failed to update donor" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
