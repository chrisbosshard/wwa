import { NextResponse } from "next/server";
import { fetchApplication } from "@lib/directus/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const application = await fetchApplication();
    return NextResponse.json(
      { application },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET /api/directus/application", error);
    const message = error instanceof Error ? error.message : "Failed to fetch application state";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
