import { normalizeStructuredPage } from "./page-defaults";
import { fetchPageWithSections } from "./queries";
import type { StructuredPageContent } from "./schema";

function formatDirectusError(error: unknown, slug: string): Error {
  const directusErrors = (error as { errors?: { message?: string }[] })?.errors;
  const message = directusErrors?.[0]?.message || (error instanceof Error ? error.message : "Unknown Directus error");
  return new Error(`Failed to load structured page "${slug}" from CMS: ${message}`);
}

export async function loadStructuredPage(slug: string): Promise<StructuredPageContent> {
  let cmsPage;

  try {
    cmsPage = await fetchPageWithSections(slug);
  } catch (error) {
    throw formatDirectusError(error, slug);
  }

  return normalizeStructuredPage(
    slug,
    cmsPage
      ? {
          title: cmsPage.title,
          slug: cmsPage.slug,
          layout: cmsPage.layout,
          icon: cmsPage.icon,
          lead: cmsPage.lead,
          body: cmsPage.body,
          footnote: cmsPage.footnote,
          sections: cmsPage.sections,
          state_blocks: cmsPage.state_blocks,
          buttons: cmsPage.buttons,
        }
      : null
  );
}
