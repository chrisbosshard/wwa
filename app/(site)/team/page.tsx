import { loadStructuredPage } from "@lib/directus/load-structured-page";
import StructuredSubpageShell from "@elements/Page/StructuredSubpageShell";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const content = await loadStructuredPage("team");
  return <StructuredSubpageShell content={content} />;
}
