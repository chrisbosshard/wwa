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

  if (appState === "wish_fulfilment" && pageSlug === "wunscherfuellen") {
    return {
      show_progress: true,
      progress_title: "Wünsche erfüllt:",
      progress_value_source: "completed_kids",
    };
  }

  if ((appState === "closed" || appState === "done") && pageSlug === "wunscherfuellen") {
    return {
      show_progress: true,
      progress_title: "Wünsche erfüllt:",
      progress_value_source: "fixed",
      progress_fixed_value: null,
    };
  }

  return null;
}

export function resolveProgressValue(
  config: ProgressDisplayConfig,
  completedKids: number,
  registeredKids: number,
  wishLimit = 0
) {
  switch (config.progress_value_source) {
    case "completed_kids":
      return completedKids;
    case "registered_kids":
      return registeredKids;
    case "fixed":
      return config.progress_fixed_value ?? wishLimit;
    default:
      return 0;
  }
}

export function shouldShowProgress(config: ProgressDisplayConfig | null | undefined, wishLimit: number) {
  return Boolean(config?.show_progress && config.progress_title && wishLimit > 0);
}

type KidWithDonor = {
  donor?: { paymentSuccessful?: string | boolean; manualUpload?: boolean } | null;
};

export function countCompletedKids(kids: KidWithDonor[]) {
  return kids.reduce((count, kid) => {
    if (kid.donor && (kid.donor.paymentSuccessful || kid.donor.manualUpload)) {
      return count + 1;
    }
    return count;
  }, 0);
}
