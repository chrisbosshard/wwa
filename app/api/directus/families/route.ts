import { NextResponse } from "next/server";
import { createFamilyWithKids } from "@lib/directus/queries";

export async function POST(request: Request) {
  try {
    const { data, kids, imageId } = await request.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Family data is required" }, { status: 400 });
    }
    if (!Array.isArray(kids) || kids.length === 0) {
      return NextResponse.json({ error: "At least one child is required" }, { status: 400 });
    }

    const family = await createFamilyWithKids(data, kids, imageId);
    return NextResponse.json({ createFamily: { id: family.id } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create family";
    console.error("POST /api/directus/families", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
