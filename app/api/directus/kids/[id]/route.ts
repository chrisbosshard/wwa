import { NextResponse } from "next/server";
import { blockKid, connectKidToDonor, updateKid } from "@lib/directus/queries";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing kid id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { checkout, donorId, completed, ...rest } = body;

    if (donorId) {
      await connectKidToDonor(id, donorId);
      return NextResponse.json({ id });
    }

    if (checkout !== undefined) {
      await blockKid(id, checkout);
      return NextResponse.json({ id });
    }

    await updateKid(id, { completed, ...rest });
    return NextResponse.json({ id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update kid";
    console.error(`PATCH /api/directus/kids/${id}`, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
