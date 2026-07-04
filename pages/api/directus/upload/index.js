import { IncomingForm } from "formidable";
import fs from "fs";
import { createDirectusClient, uploadFiles } from "@lib/directus/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  const form = new IncomingForm({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, _fields, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const files = await parseForm(req);
    const uploaded = files.file || files.fileUpload;
    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    if (!file?.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = fs.readFileSync(file.filepath);
    const formData = new FormData();
    const blob = new Blob([buffer], { type: file.mimetype || "application/octet-stream" });
    formData.append("file", blob, file.originalFilename || "upload.jpg");

    const client = createDirectusClient();
    const result = await client.request(uploadFiles(formData));
    const record = Array.isArray(result) ? result[0] : result;

    if (file.filepath) fs.unlinkSync(file.filepath);

    return res.status(200).json({
      id: record.id,
      filename: record.filename_download || file.originalFilename,
    });
  } catch (error) {
    console.error("POST /api/directus/upload", error);
    return res.status(500).json({ error: error.message || "Upload failed" });
  }
}
