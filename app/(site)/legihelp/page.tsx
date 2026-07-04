import { loadStructuredPage } from "@lib/directus/load-structured-page";
import StructuredSubpageShell from "@elements/Page/StructuredSubpageShell";

export const dynamic = "force-dynamic";

export default async function LegihelpPage() {
  const content = await loadStructuredPage("legihelp");
  return <StructuredSubpageShell content={content} />;
}
