import type { CampaignContent, CampaignContentState } from "./schema";

export function normalizeCampaignContent(
  state: string,
  fromCms: Partial<CampaignContent> | null | undefined
): Omit<CampaignContent, "id"> {
  if (!fromCms?.state) {
    throw new Error(`Campaign content for state "${state}" not found in CMS`);
  }

  return {
    state: fromCms.state as CampaignContentState,
    show_page_title: fromCms.show_page_title ?? true,
    page_title: fromCms.page_title ?? null,
    lead: fromCms.lead ?? null,
    body: fromCms.body ?? null,
    show_progress: fromCms.show_progress ?? false,
    progress_title: fromCms.progress_title ?? null,
    progress_value_source: fromCms.progress_value_source ?? null,
    progress_fixed_value: fromCms.progress_fixed_value ?? null,
    button_1_label: fromCms.button_1_label ?? null,
    button_1_url: fromCms.button_1_url ?? null,
    button_1_external: fromCms.button_1_external ?? false,
    button_1_style: fromCms.button_1_style ?? "primary",
    button_2_label: fromCms.button_2_label ?? null,
    button_2_url: fromCms.button_2_url ?? null,
    button_2_external: fromCms.button_2_external ?? false,
    button_2_style: fromCms.button_2_style ?? "outline",
    button_3_label: fromCms.button_3_label ?? null,
    button_3_url: fromCms.button_3_url ?? null,
    button_3_external: fromCms.button_3_external ?? false,
    button_3_style: fromCms.button_3_style ?? "outline",
  };
}
