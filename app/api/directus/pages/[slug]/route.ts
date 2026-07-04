import { NextResponse } from "next/server";
import { fetchPageBySlug } from "@lib/directus/queries";
import { getAssetUrl } from "@lib/directus/client";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const page = await fetchPageBySlug(slug);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...page,
      heroImageUrl: getAssetUrl(page.hero_image),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch page";
    console.error("GET /api/directus/pages", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
