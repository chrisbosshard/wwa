import { NextResponse } from "next/server";
import { createDirectusClient, uploadFiles } from "@lib/directus/client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("fileUpload");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const uploadFormData = new FormData();
    const filename = file instanceof File ? file.name : "upload.jpg";
    uploadFormData.append("file", file, filename);

    const client = createDirectusClient();
    const result = await client.request(uploadFiles(uploadFormData));
    const record = Array.isArray(result) ? result[0] : result;

    return NextResponse.json({
      id: record.id,
      filename: record.filename_download || filename,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("POST /api/directus/upload", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
