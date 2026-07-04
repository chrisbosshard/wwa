import { loadStructuredPage } from "@lib/directus/load-structured-page";
import StructuredSubpageShell from "@elements/Page/StructuredSubpageShell";

export const dynamic = "force-dynamic";

export default async function HelpPage() {
  const content = await loadStructuredPage("help");
  return <StructuredSubpageShell content={content} />;
}
