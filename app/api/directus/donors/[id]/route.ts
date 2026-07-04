import { NextResponse } from "next/server";
import { updateDonorPayment } from "@lib/directus/queries";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await updateDonorPayment(id);
    return NextResponse.json({ id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update donor";
    console.error(`PATCH /api/directus/donors/${(await params).id}`, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
