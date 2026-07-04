import type { GlobalSetting } from "./schema";

export function resolveWishLimit(settings: GlobalSetting | null | undefined): number {
  const limit = settings?.wish_limit ?? settings?.registration_limit;
  return typeof limit === "number" && limit > 0 ? limit : 0;
}
