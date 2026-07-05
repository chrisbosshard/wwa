import { getAssetUrl } from "./client";
import { fetchSponsors } from "./queries";
import type { Sponsor } from "./schema";

export type DisplaySponsor = {
  id: string;
  name: string;
  link: string;
  logoUrl: string;
};

export type TieredDisplaySponsors = {
  top: DisplaySponsor[];
  standard: DisplaySponsor[];
};

function sortSponsors(sponsors: Sponsor[]) {
  return [...sponsors].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.name.localeCompare(b.name));
}

function isTopPartner(sponsor: Sponsor) {
  return sponsor.partner_tier === "top";
}

function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function mapDisplaySponsor(sponsor: Sponsor): DisplaySponsor | null {
  const logoUrl = getAssetUrl(sponsor.logo);
  if (!sponsor.name?.trim() || !sponsor.link?.trim() || !logoUrl) return null;

  return {
    id: sponsor.id,
    name: sponsor.name.trim(),
    link: sponsor.link.trim(),
    logoUrl,
  };
}

export function mapDisplaySponsors(sponsors: Sponsor[]): DisplaySponsor[] {
  return sponsors.map(mapDisplaySponsor).filter((sponsor): sponsor is DisplaySponsor => sponsor !== null);
}

export function mapDisplaySponsorsByTier(sponsors: Sponsor[]): TieredDisplaySponsors {
  const sorted = sortSponsors(sponsors);
  return {
    top: mapDisplaySponsors(sorted.filter(isTopPartner)),
    standard: mapDisplaySponsors(sorted.filter((sponsor) => !isTopPartner(sponsor))),
  };
}

export type FooterSponsors = {
  top: DisplaySponsor[];
  others: DisplaySponsor[];
};

export function getFooterSponsors(sponsors: Sponsor[], rotatingCount = 4): FooterSponsors {
  const sorted = sortSponsors(sponsors);
  const top = mapDisplaySponsors(sorted.filter(isTopPartner));

  const pinned = mapDisplaySponsors(sorted.filter((sponsor) => sponsor.pin_in_footer && !isTopPartner(sponsor)));

  const rotatingPool = mapDisplaySponsors(
    sorted.filter((sponsor) => sponsor.featured && !sponsor.pin_in_footer && !isTopPartner(sponsor)),
  );
  const rotating = shuffle(rotatingPool).slice(0, rotatingCount);

  return { top, others: [...pinned, ...rotating] };
}

export async function loadDisplaySponsorsByTier(): Promise<TieredDisplaySponsors> {
  try {
    const sponsors = ((await fetchSponsors()) ?? []) as Sponsor[];
    return mapDisplaySponsorsByTier(sponsors);
  } catch (error) {
    console.error("loadDisplaySponsorsByTier: failed to load sponsors", error);
    return { top: [], standard: [] };
  }
}

export async function loadDisplaySponsors() {
  const { top, standard } = await loadDisplaySponsorsByTier();
  return [...top, ...standard];
}

export async function loadFooterSponsors(rotatingCount = 4) {
  try {
    const sponsors = ((await fetchSponsors()) ?? []) as Sponsor[];
    return getFooterSponsors(sponsors, rotatingCount);
  } catch (error) {
    console.error("loadFooterSponsors: failed to load sponsors", error);
    return { top: [], others: [] };
  }
}
