import type { PageButton, PageLayout, PageSection, PageStateBlock, StructuredPageContent } from "./schema";

function sortSections(sections: PageSection[]) {
  return [...sections].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.title.localeCompare(b.title));
}

function sortButtons(buttons: PageButton[]) {
  return [...buttons].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.label.localeCompare(b.label));
}

function hasText(value: string | null | undefined): value is string {
  return Boolean(value?.trim());
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

export type EffectivePageContent = {
  title: string;
  lead: string | null;
  body: string | null;
  notification: string | null;
  leadFromStateBlock: boolean;
  bodyFromStateBlock: boolean;
};

/** Page fields with optional per-phase overrides from the matching state block. */
export function resolveEffectivePageContent(
  content: StructuredPageContent,
  appState: string | null | undefined
): EffectivePageContent {
  const stateBlock = getStateBlockForAppState(content, appState);

  const leadFromStateBlock = hasText(stateBlock?.lead);
  const bodyFromStateBlock = hasText(stateBlock?.body);

  return {
    title: hasText(stateBlock?.title) ? stateBlock.title.trim() : content.title,
    lead: leadFromStateBlock ? stateBlock!.lead!.trim() : content.lead ?? null,
    body: bodyFromStateBlock ? stateBlock!.body!.trim() : content.body ?? null,
    notification: hasText(stateBlock?.notification) ? stateBlock!.notification!.trim() : null,
    leadFromStateBlock,
    bodyFromStateBlock,
  };
}
