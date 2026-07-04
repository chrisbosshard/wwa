import { NextResponse } from "next/server";
import { createDonor } from "@lib/directus/queries";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createDonor(body.data);
    return NextResponse.json({ createDonor: { id: result.id } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create donor";
    console.error("POST /api/directus/donors", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
