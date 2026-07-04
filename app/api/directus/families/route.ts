import { NextResponse } from "next/server";
import { createFamilyWithKids } from "@lib/directus/queries";

export async function POST(request: Request) {
  try {
    const { data, kids, imageId } = await request.json();
    const family = await createFamilyWithKids(data, kids, imageId);
    return NextResponse.json({ createFamily: { id: family.id } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create family";
    console.error("POST /api/directus/families", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
