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
    <footer className="footerPane">
      <div className="footerPane-inner">
        <div className="footerPane-main">
          <div>
            <div className="footerLogo">
              <a href="https://www.caritas-zuerich.ch/">
                <img src="logo_caritas_zh.png" alt="Caritas Zürich" style={{ width: "180px" }} />
              </a>
            </div>

            <a
              href="mailto:weihnachtswunschaktion@caritas-zuerich.ch"
              className="footerPane-cta group"
            >
              <span>weihnachtswunschaktion@caritas-zuerich.ch</span>
              <ArrowUpRightIcon className="footerPane-cta-icon transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <div className="footerPane-contact">
              <p>Caritas Zürich - KulturLegi Zürich</p>
              <p>Reitergasse 1</p>
              <p>8004 Zürich</p>
              <p>044 366 68 48</p>
            </div>
          </div>

          <div>
            <nav className="footerPane-nav" aria-label="Footer Navigation">
              {navLinks.map(({ href, label, external }) =>
                external ? (
                  <a key={href} href={href} target="_blank" rel="noreferrer" className="footerPane-nav-link group">
                    <span>{label}</span>
                    <ArrowUpRightIcon className="footerPane-nav-icon transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <Link key={href} href={href} className="footerPane-nav-link group">
                    <span>{label}</span>
                    <ArrowUpRightIcon className="footerPane-nav-icon transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ),
              )}
            </nav>

            <div className="mt-8">
              <FooterSocialIcons />
            </div>
          </div>
        </div>

        <div className="footerPane-partners">
          <p className="footerPane-label pb-6">Unterstützt von</p>
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

        <div className="footerPane-bar">
          <div className="footerPane-bar-left">
            <p>Caritas Zürich – KulturLegi Zürich</p>
            <nav className="footerPane-bar-links" aria-label="Footer Legal Navigation">
              <Link href="/impressum" className="footerPane-bar-link">
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
