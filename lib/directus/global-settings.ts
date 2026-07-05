import type { GlobalSetting } from "./schema";

export function resolveWishLimit(settings: GlobalSetting | null | undefined): number {
  const limit = settings?.wish_limit ?? settings?.registration_limit;
  return typeof limit === "number" && limit > 0 ? limit : 0;
}

/** Returns fixed count when set in CMS, otherwise null (use live data). */
export function resolveFixedWishCount(settings: GlobalSetting | null | undefined): number | null {
  const count = settings?.fixed_wish_count;
  return typeof count === "number" && count >= 0 ? count : null;
}
