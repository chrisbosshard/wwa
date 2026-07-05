import type { ProgressValueSource } from "./schema";

export type ProgressDisplayConfig = {
  show_progress?: boolean;
  progress_title?: string | null;
  progress_value_source?: ProgressValueSource;
  progress_fixed_value?: number | null;
};

export function getSubpageProgressConfig(
  pageSlug: string,
  appState: string | null | undefined
): ProgressDisplayConfig | null {
  if (!appState) return null;

  if (appState === "registration" || appState === "post_registration") {
    if (pageSlug !== "anmelden") return null;
    return {
      show_progress: true,
      progress_title: "Wünsche angemeldet:",
      progress_value_source: "registered_kids",
    };
  }

  if (
    (appState === "wish_fulfilment" || appState === "closed" || appState === "done") &&
    pageSlug === "wunscherfuellen"
  ) {
    return {
      show_progress: true,
      progress_title: "Wünsche erfüllt:",
      progress_value_source: "completed_kids",
    };
  }

  return null;
}

export function resolveProgressValue(
  config: ProgressDisplayConfig,
  completedKids: number,
  registeredKids: number,
  wishLimit = 0,
  fixedWishCount: number | null = null
) {
  switch (config.progress_value_source) {
    case "completed_kids":
    case "fixed":
      if (fixedWishCount != null) return fixedWishCount;
      return completedKids;
    case "registered_kids":
      return registeredKids;
    default:
      return 0;
  }
}

export function shouldShowProgress(config: ProgressDisplayConfig | null | undefined, wishLimit: number) {
  return Boolean(config?.show_progress && config.progress_title && wishLimit > 0);
}

type KidWithDonor = {
  completed?: boolean;
  donor?: { paymentSuccessful?: string | boolean; manualUpload?: boolean } | null;
};

export function isGrantedWish(kid: KidWithDonor): boolean {
  if (!kid.donor) return false;
  if (kid.donor.manualUpload) return true;
  const payment = kid.donor.paymentSuccessful;
  return payment === true || payment === "Yes";
}

export function countGrantedWishes(kids: KidWithDonor[]) {
  return kids.reduce((count, kid) => count + (isGrantedWish(kid) ? 1 : 0), 0);
}

/** @deprecated Use countGrantedWishes */
export function countCompletedKids(kids: KidWithDonor[]) {
  return countGrantedWishes(kids);
}
