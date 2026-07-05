import type { DisplaySponsor, TieredDisplaySponsors } from "@lib/directus/sponsors";
import { cn } from "@/lib/utils";

type Props = TieredDisplaySponsors;

const STANDARD_LOGO_HEIGHT = "h-8 max-h-10 md:h-10 md:max-h-12";

function topLogoSizeClass(count: number) {
  if (count <= 2) {
    return "h-14 max-h-16 w-full max-w-[160px] object-contain sm:h-16 sm:max-h-[4.25rem] sm:max-w-[200px] md:h-[4.5rem] md:max-h-20 md:max-w-[240px]";
  }
  if (count <= 4) {
    return "h-16 max-h-[4.25rem] w-full max-w-[200px] object-contain md:h-20 md:max-h-24 md:max-w-[240px]";
  }
  return "h-14 max-h-16 w-full max-w-[180px] object-contain md:h-16 md:max-h-20 md:max-w-[220px]";
}

function SponsorWall({
  sponsors,
  topTier = false,
}: {
  sponsors: DisplaySponsor[];
  topTier?: boolean;
}) {
  if (!sponsors.length) return null;

  const isCompactTopRow = topTier && sponsors.length <= 2;

  return (
    <div
      className={cn(
        isCompactTopRow
          ? "mx-auto grid max-w-3xl grid-cols-2 items-center justify-items-center gap-x-4 gap-y-4 sm:gap-x-8 md:gap-x-12"
          : topTier
            ? "flex flex-wrap items-center justify-center gap-x-8 gap-y-8 md:gap-x-10 md:gap-y-10"
            : "flex flex-wrap items-center justify-center gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 md:gap-x-8 md:gap-y-8",
      )}
    >
      {sponsors.map((sponsor) => (
        <a
          key={sponsor.id}
          href={sponsor.link}
          target="_blank"
          rel="noreferrer"
          title={sponsor.name}
          className={cn(
            "group flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5",
            isCompactTopRow ? "min-w-0 px-2 py-2 sm:px-3" : topTier ? "px-3 py-2 md:px-4" : "px-2 py-1.5",
          )}
        >
          <img
            src={sponsor.logoUrl}
            alt={sponsor.name}
            className={cn(
              "invert opacity-90 transition-opacity duration-200 group-hover:opacity-100",
              topTier ? topLogoSizeClass(sponsors.length) : cn("w-auto", STANDARD_LOGO_HEIGHT, "max-w-[120px] md:max-w-[140px] object-contain"),
            )}
          />
        </a>
      ))}
    </div>
  );
}

export default function PartnerSponsorGrid({ top, standard }: Props) {
  if (!top.length && !standard.length) return null;

  const showDivider = top.length > 0 && standard.length > 0;

  return (
    <div className="mt-12 mb-12 md:mt-16 md:mb-16 lg:mb-20">
      <SponsorWall sponsors={top} topTier />

      {showDivider && <hr className="my-8 border-0 border-t border-[#ececec] md:my-10" />}

      <SponsorWall sponsors={standard} />
    </div>
  );
}
