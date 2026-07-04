import React from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import shuffleArray from "@utils/shuffleArray";
import FooterSocialIcons from "@sections/Footer/FooterSocialIcons";

let sponsors = [
  { id: 1, link: "https://www.micro-scooter.com/", image: "micro.png" },
  { id: 2, link: "https://www.veloblitz.ch/", image: "veloblitz.png" },
  { id: 3, link: "https://ch.medical.canon/", image: "canon.png" },
  { id: 4, link: "https://zeb-consulting.com/de-DE", image: "zeb-Logo_weiss.png" },
  { id: 5, link: "https://privatebank.barclays.com/", image: "barclays.png" },
  { id: 6, link: "https://www.generali.ch/", image: "generali.png" },
  { id: 7, link: "https://www.google.ch/", image: "google.png" },
  { id: 8, link: "https://www.lgt.com/", image: "lgt-bank_weiss.png" },
  { id: 9, link: "https://www.energie360.ch/", image: "energie360.png" },
  { id: 10, link: "https://skope.swiss/", image: "skope.png" },
  { id: 11, link: "https://www.wienachtsdorf.ch/", image: "weihnachtsdorf.png" },
  { id: 12, link: "https://www.shl-medical.com/", image: "shl.png" },
  { id: 13, link: "https://www.iway.ch/", image: "iway.png" },
  { id: 14, link: "https://www.six-group.com", image: "six.png" },
  { id: 15, link: "https://www.belimo.com/", image: "belimo.png" },
  { id: 16, link: "https://dearfoundation.ch/", image: "dear.png" },
  { id: 17, link: "https://eqtgroup.com/", image: "eqt.png" },
  { id: 18, link: "https://www.russellreynolds.com/en/", image: "russell_reynolds_weiss.png" },
  { id: 19, link: "https://www.allianz-trade.com/de_CH.html", image: "logo-euler-hermes-allianz-weiss.png" },
  { id: 20, link: "https://www.pfizer.ch/de", image: "Pfizer-logo_weiss.png" },
  { id: 21, link: "https://switzerland.ca-indosuez.com", image: "indosuez.png" },
  { id: 22, link: "https://www.ubs.com/ch/en.html", image: "ubs_weiss.png" },
  { id: 23, link: "https://www.sh.winterhilfe.ch/", image: "Logo_Winterhilfe_Schaffhausen.png" },
  { id: 24, link: "https://www.efswiss.ch/", image: "ef.png" },
  { id: 25, link: "https://siech-cycles.com", image: "sic.png" },
];
sponsors = shuffleArray(sponsors);

const navLinks = [
  { href: "/contact", label: "Kontakt", external: false },
  { href: "/info", label: "Über die Aktion", external: false },
  { href: "/partner", label: "Unsere Partner", external: false },
  { href: "/impressum", label: "Impressum", external: false },
  { href: "https://www.caritas-zuerich.ch/newsletter?nlconf=1", label: "Newsletter", external: true },
];

const Footer = () => {
  return (
    <footer className="relative left-1/2 right-1/2 mt-12 w-screen max-w-none -translate-x-1/2 bg-[#242424] text-white">
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

        <div className="border-t border-[#575656] py-10">
          <p className="pb-6 text-sm font-semibold uppercase tracking-wide text-[#c5c8c8]">Unterstützt von</p>
          <div className="flex flex-wrap items-center gap-8">
            <a href="https://zh.winterhilfe.ch" target="_blank" rel="noreferrer">
              <img className="max-h-10" src="logo_winterhilfe.png" alt="Winterhilfe" />
            </a>
            <a href="https://zuerich-rietberg.lionsclub.ch/" target="_blank" rel="noreferrer">
              <img className="max-h-10" src="logo_lions.png" alt="Lions Club" />
            </a>
            <a href="https://www.axa.ch/" target="_blank" rel="noreferrer">
              <img className="max-h-10" src="axa.png" alt="AXA" />
            </a>
            {[...Array(4)].map((_, index) => (
              <a key={sponsors[index].id} href={sponsors[index].link} target="_blank" rel="noreferrer">
                <img className="max-h-10" src={sponsors[index].image} alt="Partner" />
              </a>
            ))}
          </div>
        </div>

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
