import { loadStructuredPage } from "@lib/directus/load-structured-page";
import StructuredSubpageShell from "@elements/Page/StructuredSubpageShell";

export const dynamic = "force-dynamic";

export default async function ImpressumPage() {
  const content = await loadStructuredPage("impressum");
  return <StructuredSubpageShell content={content} />;
}
