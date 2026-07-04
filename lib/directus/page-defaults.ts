import type { PageButton, PageLayout, PageSection, PageStateBlock, StructuredPageContent } from "./schema";

function sortSections(sections: PageSection[]) {
  return [...sections].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.title.localeCompare(b.title));
}

function sortButtons(buttons: PageButton[]) {
  return [...buttons].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.label.localeCompare(b.label));
}

export function normalizeStructuredPage(
  slug: string,
  fromCms: Partial<StructuredPageContent> | null | undefined
): StructuredPageContent {
  if (!fromCms?.title || !fromCms?.slug) {
    throw new Error(`Structured page "${slug}" not found in CMS`);
  }

  return {
    title: fromCms.title,
    slug: fromCms.slug,
    layout: (fromCms.layout as PageLayout) || "simple",
    icon: fromCms.icon ?? null,
    lead: fromCms.lead ?? null,
    body: fromCms.body ?? null,
    footnote: fromCms.footnote ?? null,
    sections: sortSections(fromCms.sections ?? []),
    state_blocks: fromCms.state_blocks ?? [],
    buttons: sortButtons(fromCms.buttons ?? []),
  };
}

export function getStateBlockForAppState(
  content: StructuredPageContent,
  appState: string | null | undefined
): PageStateBlock | null {
  if (!appState) return null;
  return content.state_blocks.find((block) => block.state === appState) ?? null;
}
