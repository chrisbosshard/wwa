import { loadStructuredPage } from "@lib/directus/load-structured-page";
import StructuredSubpageShell from "@elements/Page/StructuredSubpageShell";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await loadStructuredPage("contact");
  return <StructuredSubpageShell content={content} />;
}
