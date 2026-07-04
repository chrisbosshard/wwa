export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { fetchWishes, createWish } from "@lib/directus/queries";

export async function GET() {
  try {
    const data = await fetchWishes();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch wishes";
    console.error("GET /api/directus/wishes", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createWish(body.data);
    return NextResponse.json({ createWish: { id: result.id } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create wish";
    console.error("POST /api/directus/wishes", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
