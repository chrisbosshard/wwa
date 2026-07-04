import { loadStructuredPage } from "@lib/directus/load-structured-page";
import WunscherfuellenPageClient from "./WunscherfuellenPageClient";

export const dynamic = "force-dynamic";

export default async function WunscherfuellenPage() {
  const content = await loadStructuredPage("wunscherfuellen");
  return <WunscherfuellenPageClient content={content} />;
}
