import React from "react";
import Link from "next/link";
import { HeroActionLinks } from "./HeroActionLinks";
import { HERO_ACTION_LINKS } from "./hero-action-links";

type LanternConfig = {
  id: number;
  src: string;
  back?: boolean;
};

type HeroProps = {
  showActionLinks?: boolean;
  /** White corner overlap for subsites (same as homepage, without action links). */
  withCutout?: boolean;
};

const LANTERNS: LanternConfig[] = [
  { id: 1, src: "lantern1.png" },
  { id: 2, src: "lantern2.png" },
  { id: 3, src: "lantern3.png", back: true },
  { id: 4, src: "lantern4.png" },
  { id: 5, src: "lantern5.png" },
  { id: 6, src: "lantern6.png", back: true },
  { id: 7, src: "lantern7.png" },
  { id: 8, src: "lantern8.png" },
  { id: 9, src: "lantern9.png", back: true },
  { id: 10, src: "lantern10.png" },
  { id: 11, src: "lantern11.png" },
  { id: 12, src: "lantern12.png", back: true },
  { id: 13, src: "lantern13.png" },
  { id: 14, src: "lantern14.png" },
  { id: 15, src: "lantern15.png", back: true },
  { id: 16, src: "lantern16.png" },
  { id: 17, src: "lantern17.png" },
  { id: 18, src: "lantern11.png", back: true },
  { id: 19, src: "lantern16.png" },
  { id: 20, src: "lantern20.png" },
  { id: 21, src: "lantern21.png", back: true },
  { id: 22, src: "lantern22.png" },
  { id: 23, src: "lantern23.png" },
  { id: 24, src: "lantern24.png", back: true },
  { id: 25, src: "lantern25.png" },
  { id: 26, src: "lantern26.png" },
  { id: 27, src: "lantern27.png", back: true },
  { id: 28, src: "lantern28.png" },
  { id: 29, src: "lantern29.png" },
  { id: 30, src: "lantern30.png", back: true },
  { id: 31, src: "lantern31.png" },
  { id: 32, src: "lantern32.png" },
  { id: 33, src: "lantern33.png", back: true },
  { id: 34, src: "lantern34.png" },
  { id: 35, src: "lantern35.png" },
  { id: 36, src: "lantern36.png", back: true },
  { id: 37, src: "lantern37.png" },
];

const Hero = ({ showActionLinks = false, withCutout = false }: HeroProps) => {
  const hasCutout = showActionLinks || withCutout;
  const isSubpage = withCutout && !showActionLinks;

  const heroClass = [
    "titlePane",
    hasCutout && (showActionLinks ? "titlePane-with-actions" : "titlePane-with-cutout"),
    isSubpage && "titlePane-subpage",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={heroClass}>
      <div className="relative z-[300] titlePane-foreground">
        <div className="titlePane-title">
          <Link href="/">
            <img src="/WWA_Logo_gelb.png" alt="Weihnachtswunschaktion" />
          </Link>
        </div>
        {showActionLinks && <HeroActionLinks links={HERO_ACTION_LINKS} />}
      </div>
      <div className="overlay-top" aria-hidden="true" />
      {!hasCutout && <div className="overlay-bottom" aria-hidden="true" />}
      {hasCutout && <div className="overlay-actions" aria-hidden="true" />}
      <div className="animated-stars" aria-hidden="true" />
      {LANTERNS.map(({ id, src, back }) => (
        <img
          key={id}
          className={`${back ? "swingimageback" : "swingimage"} lantern${id}`}
          src={`/${src}`}
          alt=""
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default Hero;
