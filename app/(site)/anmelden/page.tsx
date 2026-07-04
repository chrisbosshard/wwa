import { loadStructuredPage } from "@lib/directus/load-structured-page";
import AnmeldenPageClient from "./AnmeldenPageClient";

export const dynamic = "force-dynamic";

export default async function AnmeldenPage() {
  const content = await loadStructuredPage("anmelden");
  return <AnmeldenPageClient content={content} />;
}
