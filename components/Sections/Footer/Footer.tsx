import React from "react";

// IMPORT COMPONENTS
import Link from "next/link";

// IMPORT UTILS
import shuffleArray from "@utils/shuffleArray";

let sponsors = [
  {
    id: 1,
    link: "https://www.micro-scooter.com/",
    image: "micro.png",
  },
  {
    id: 2,
    link: "https://www.veloblitz.ch/",
    image: "veloblitz.png",
  },
  {
    id: 3,
    link: "https://ch.medical.canon/",
    image: "canon.png",
  },
  {
    id: 4,
    link: "https://zeb-consulting.com/de-DE",
    image: "zeb-Logo_weiss.png",
  },
  {
    id: 5,
    link: "https://privatebank.barclays.com/",
    image: "barclays.png",
  },
  {
    id: 6,
    link: "https://www.generali.ch/",
    image: "generali.png",
  },
  { id: 7, link: "https://www.google.ch/", image: "google.png" },
  {
    id: 8,
    link: "https://www.lgt.com/",
    image: "lgt-bank_weiss.png",
  },
  {
    id: 9,
    link: "https://www.energie360.ch/",
    image: "energie360.png",
  },
  {
    id: 10,
    link: "https://skope.swiss/",
    image: "skope.png",
  },
  {
    id: 11,
    link: "https://www.wienachtsdorf.ch/",
    image: "weihnachtsdorf.png",
  },
  {
    id: 12,
    link: "https://www.shl-medical.com/",
    image: "shl.png",
  },
  {
    id: 13,
    link: "https://www.iway.ch/",
    image: "iway.png",
  },
  {
    id: 14,
    link: "https://www.six-group.com",
    image: "six.png",
  },
  {
    id: 15,
    link: "https://www.belimo.com/",
    image: "belimo.png",
  },
  {
    id: 16,
    link: "https://dearfoundation.ch/",
    image: "dear.png",
  },
  {
    id: 17,
    link: "https://eqtgroup.com/",
    image: "eqt.png",
  },
  {
    id: 18,
    link: "https://www.russellreynolds.com/en/",
    image: "russell_reynolds_weiss.png",
  },
  {
    id: 19,
    link: "https://www.allianz-trade.com/de_CH.html",
    image: "logo-euler-hermes-allianz-weiss.png",
  },
  {
    id: 20,
    link: "https://www.pfizer.ch/de",
    image: "Pfizer-logo_weiss.png",
  },
  {
    id: 21,
    link: "https://switzerland.ca-indosuez.com",
    image: "indosuez.png",
  },
  {
    id: 22,
    link: "https://www.ubs.com/ch/en.html",
    image: "ubs_weiss.png",
  },
  {
    id: 23,
    link: "https://www.sh.winterhilfe.ch/",
    image: "Logo_Winterhilfe_Schaffhausen.png",
  },
  {
    id: 24,
    link: "https://www.efswiss.ch/",
    image: "ef.png",
  },
  {
    id: 25,
    link: "https://siech-cycles.com",
    image: "sic.png",
  },
];
sponsors = shuffleArray(sponsors);

const Footer = () => {
  return (
    <div className="footerPane mx-auto mt-20 max-w-[1200px]">
      <div className="grid grid-cols-auto-md gap-4 text-white">
        <div>
          <p className="pb-2 text-sm text-lightblue-300">Nimm mit uns Kontakt auf:</p>
          <p className="text-sm font-normal">Caritas Zürich - KulturLegi Zürich</p>
          <p className="text-sm font-normal">Reitergasse 1</p>
          <p className="text-sm font-normal">8004 Zürich</p>
          <p className="text-sm font-normal">044 366 68 48</p>
          <a className="text-sm font-normal hover:underline" href="mailto:weihnachtswunschaktion@caritas-zuerich.ch">
            weihnachtswunschaktion@caritas-zuerich.ch
          </a>
        </div>
        <div className="linkSection">
          <p className="pb-2 text-sm text-lightblue-300">Erfahre mehr über die Aktion:</p>
          <Link href="/contact" passHref>
            <p className="text-sm font-normal hover:underline">Kontakt</p>
          </Link>
          <Link href="/info" passHref>
            <p className="text-sm font-normal hover:underline">Über die Aktion</p>
          </Link>
          <Link href="/partner" passHref>
            <p className="text-sm font-normal hover:underline">Unsere Partner</p>
          </Link>
          <Link href="/impressum" passHref>
            <p className="text-sm font-normal hover:underline">Impressum</p>
          </Link>
        </div>

        <div>
          <p className="pb-2 text-sm text-lightblue-300">Bleibe informiert:</p>
          <div className="flex gap-2">
            <a href="https://www.facebook.com/caritaszuerich/" target="_blank" rel="noreferrer">
              <img className="h-12 w-12" src="icon_facebook.png" alt="gift" />
            </a>
            <a href="https://www.instagram.com/caritaszuerich/" target="_blank" rel="noreferrer">
              <img className="h-12 w-12" src="icon_instagram.png" alt="gift" />
            </a>
            <a href="https://www.linkedin.com/company/caritas-zürich" target="_blank" rel="noreferrer">
              <img className="h-12 w-12" src="icon_linkedin.png" alt="gift" />
            </a>
            <a href="https://www.caritas-zuerich.ch/newsletter?nlconf=1" target="_blank" rel="noreferrer">
              <img className="h-12 w-12" src="icon_newsletter.png" alt="gift" />
            </a>
          </div>
        </div>
      </div>
      <div className="mb-20 mt-8 grid w-full grid-cols-4 flex-row text-white">
        <div className="col-span-4 lg:col-span-1">
          <p className="pb-4 text-sm text-lightblue-300">Ein Engagement von:</p>
          <div className="footerLogo">
            <a href="https://www.caritas-zuerich.ch/">
              <img src="CaZuerich_Logo_weiss.png" alt="gift" style={{ width: "230px" }} />
            </a>
          </div>
        </div>
        <div className="col-span-4 lg:col-span-3">
          <p className="pb-4 text-sm text-lightblue-300">Unterstützt von:</p>
          <div className="flex flex-wrap items-center gap-8">
            <a href="https://zh.winterhilfe.ch" target="_blank" rel="noreferrer">
              <img className="max-h-12" src="Winterhilfe-Logo_weiss.png" alt="gift" />
            </a>
            <a href="https://zuerich-rietberg.lionsclub.ch/" target="_blank" rel="noreferrer">
              <img className="max-h-12" src="Lions_Club_Logo_weiss.png" alt="gift" />
            </a>
            <a href="https://www.axa.ch/" target="_blank" rel="noreferrer">
              <img className="max-h-12" src="axa.png" alt="gift" />
            </a>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            {[...Array(4)].map((i, index) => {
              return (
                <a key={sponsors[index].id} href={sponsors[index].link} target="_blank" rel="noreferrer">
                  <img className="max-h-12" src={sponsors[index].image} alt="gift" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
