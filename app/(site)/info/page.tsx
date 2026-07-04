import { loadStructuredPage } from "@lib/directus/load-structured-page";
import StructuredSubpageShell from "@elements/Page/StructuredSubpageShell";

export const dynamic = "force-dynamic";

export default async function InfoPage() {
  const content = await loadStructuredPage("info");
  return <StructuredSubpageShell content={content} />;
}
