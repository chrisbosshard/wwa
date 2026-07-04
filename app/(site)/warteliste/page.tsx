import { loadStructuredPage } from "@lib/directus/load-structured-page";
import WartelistePageClient from "./WartelistePageClient";

export const dynamic = "force-dynamic";

export default async function WartelistePage() {
  const content = await loadStructuredPage("warteliste");
  return <WartelistePageClient content={content} />;
}
