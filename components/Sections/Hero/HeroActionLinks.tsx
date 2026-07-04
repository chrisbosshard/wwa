import Link from "next/link";
import type { HeroActionLink } from "./hero-action-links";

type Props = {
  links: HeroActionLink[];
};

export const HeroActionLinks = ({ links }: Props) => {
  return (
    <div className="titlePane-actions mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:pb-14 sm:pt-12">
      <div className="grid grid-cols-auto-md items-start gap-6">
        {links.map(({ link, image1, image2, title, text }) => (
          <Link key={link} href={link} className="group no-underline">
            <div className="mb-4 px-12">
              <img src={`/${image1}`} className="block group-hover:hidden" alt="" />
              <img src={`/${image2}`} className="hidden group-hover:block" alt="" />
            </div>
            <p className="mb-4 text-lg font-bold text-white">{title}</p>
            <p className="leading-snug text-gold-300">{text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
