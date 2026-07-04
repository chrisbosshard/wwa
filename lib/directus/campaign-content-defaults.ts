import type { CampaignContent, CampaignContentState } from "./schema";
import {
  CAMPAIGN_CONTENT_DEFAULTS,
  CAMPAIGN_CONTENT_STATES,
} from "../../scripts/campaign-content-data.mjs";

export { CAMPAIGN_CONTENT_DEFAULTS, CAMPAIGN_CONTENT_STATES };

export function getDefaultCampaignContent(state: string): Omit<CampaignContent, "id"> {
  const key = state as CampaignContentState;
  return CAMPAIGN_CONTENT_DEFAULTS[key] ?? CAMPAIGN_CONTENT_DEFAULTS.registration;
}

function definedCmsFields(fromCms: Partial<CampaignContent>): Partial<CampaignContent> {
  return Object.fromEntries(
    Object.entries(fromCms).filter(([, value]) => value !== null && value !== undefined && value !== "")
  ) as Partial<CampaignContent>;
}

export function mergeCampaignContent(
  state: string,
  fromCms: Partial<CampaignContent> | null | undefined
): Omit<CampaignContent, "id"> {
  const defaults = getDefaultCampaignContent(state);
  if (!fromCms) return defaults;
  return { ...defaults, ...definedCmsFields(fromCms), state: defaults.state };
}
