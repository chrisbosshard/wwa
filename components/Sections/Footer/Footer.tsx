"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import FooterSocialIcons from "@sections/Footer/FooterSocialIcons";
import type { DisplaySponsor } from "@lib/directus/sponsors";

const navLinks = [
  { href: "/contact", label: "Kontakt", external: false },
  { href: "/info", label: "Über die Aktion", external: false },
  { href: "/partner", label: "Unsere Partner", external: false },
  { href: "/impressum", label: "Impressum", external: false },
  { href: "https://www.caritas-zuerich.ch/newsletter?nlconf=1", label: "Newsletter", external: true },
];

type Props = {
  topSponsors?: DisplaySponsor[];
  otherSponsors?: DisplaySponsor[];
};

function SponsorLogo({ sponsor }: { sponsor: DisplaySponsor }) {
  return (
    <a href={sponsor.link} target="_blank" rel="noreferrer">
      <img className="max-h-10" src={sponsor.logoUrl} alt={sponsor.name} />
    </a>
  );
}

const Footer = ({ topSponsors, otherSponsors }: Props) => {
  const [top, setTop] = useState<DisplaySponsor[]>(topSponsors ?? []);
  const [others, setOthers] = useState<DisplaySponsor[]>(otherSponsors ?? []);

  useEffect(() => {
    if (topSponsors !== undefined || otherSponsors !== undefined) return;

    async function loadSponsors() {
      try {
        const response = await fetch("/api/directus/sponsors");
        if (!response.ok) return;
        const data = await response.json();
        setTop(data.footer?.top ?? []);
        setOthers(data.footer?.others ?? []);
      } catch (error) {
        console.error("Footer: failed to load sponsors", error);
      }
    }

    loadSponsors();
  }, [topSponsors, otherSponsors]);

  const hasSponsors = top.length > 0 || others.length > 0;
  const showDivider = top.length > 0 && others.length > 0;

  return (
    <footer className="relative left-1/2 right-1/2 w-screen max-w-none -translate-x-1/2 border-t-[4rem] border-white bg-[#242424] text-white">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="grid gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div>
            <div className="[&_img]:max-w-[180px]">
              <a href="https://www.caritas-zuerich.ch/">
                <img src="logo_caritas_zh.png" alt="Caritas Zürich" style={{ width: "180px" }} />
              </a>
            </div>

            <a
              href="mailto:weihnachtswunschaktion@caritas-zuerich.ch"
              className="group mt-6 inline-flex max-w-xl items-start gap-3 text-lg font-bold leading-tight text-white transition-colors hover:text-caritas-red sm:text-xl lg:text-[1.375rem]"
            >
              <span>weihnachtswunschaktion@caritas-zuerich.ch</span>
              <ArrowUpRightIcon className="mt-0.5 h-5 w-5 shrink-0 text-caritas-red transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-6 sm:w-6" />
            </a>

            <div className="mt-6 space-y-1 text-sm text-[#c5c8c8]">
              <p>Caritas Zürich - KulturLegi Zürich</p>
              <p>Reitergasse 1</p>
              <p>8004 Zürich</p>
              <p>044 366 68 48</p>
            </div>
          </div>

          <div>
            <nav className="flex flex-col gap-4 lg:gap-5" aria-label="Footer Navigation">
              {navLinks.map(({ href, label, external }) =>
                external ? (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-2xl font-medium text-white transition-colors hover:text-caritas-red lg:text-[2rem]"
                  >
                    <span>{label}</span>
                    <ArrowUpRightIcon className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    className="group inline-flex items-center gap-2 text-2xl font-medium text-white transition-colors hover:text-caritas-red lg:text-[2rem]"
                  >
                    <span>{label}</span>
                    <ArrowUpRightIcon className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ),
              )}
            </nav>

            <div className="mt-8">
              <FooterSocialIcons />
            </div>
          </div>
        </div>

        {hasSponsors && (
          <div className="border-t border-[#575656] py-10">
            <p className="pb-6 text-sm font-semibold uppercase tracking-wide text-[#c5c8c8]">Unterstützt von</p>
            <div className="flex flex-wrap items-center gap-8">
              {top.map((sponsor) => (
                <SponsorLogo key={sponsor.id} sponsor={sponsor} />
              ))}

              {showDivider && <div className="h-10 w-px shrink-0 bg-[#575656]" aria-hidden="true" />}

              {others.map((sponsor) => (
                <SponsorLogo key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-[#575656] py-6 text-base leading-[1.47] text-[#c5c8c8] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col flex-wrap lg:flex-row lg:items-center">
            <p>Caritas Zürich – KulturLegi Zürich</p>
            <nav className="flex flex-wrap items-center gap-x-10 gap-y-1 lg:ml-10" aria-label="Footer Legal Navigation">
              <Link href="/impressum" className="transition-colors hover:text-white">
                Impressum
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
