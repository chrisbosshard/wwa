import { createDonor, updateDonorPayment } from "@lib/directus/queries";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const result = await createDonor(req.body.data);
      return res.status(201).json({ createDonor: { id: result.id } });
    } catch (error) {
      console.error("POST /api/directus/donors", error);
      return res.status(500).json({ error: error.message || "Failed to create donor" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
