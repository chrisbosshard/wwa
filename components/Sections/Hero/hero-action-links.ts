export type HeroActionLink = {
  link: string;
  image1: string;
  image2: string;
  title: string;
  text: string;
};

export const HERO_ACTION_LINKS: HeroActionLink[] = [
  {
    link: "/anmelden",
    image1: "icon1.png",
    image2: "icon1_hover.png",
    title: "Wunsch anmelden",
    text: "Melde hier den Wunsch für dein Kind an. Mitmachen kannst du, wenn du eine KulturLegi hast.",
  },
  {
    link: "/wunscherfuellen",
    image1: "icon2.png",
    image2: "icon2_hover.png",
    title: "Erfülle einen Wunsch",
    text: "Mit deiner Hilfe erfüllen wir Weihnachtswünsche von Kindern aus Familien mit schmalem Budget.",
  },
  {
    link: "/team",
    image1: "icon3.png",
    image2: "icon3_hover.png",
    title: "Erfüllt als Team Wünsche",
    text: "Ihr möchtet euch gemeinsam engagieren? Dann meldet euch bei uns!",
  },
  {
    link: "/help",
    image1: "icon4.png",
    image2: "icon4_hover.png",
    title: "Kinder unterstützen",
    text: "Du möchtest Kinder aus benachteiligten Familien auch über Weihnachten hinaus unterstützen? Wir haben da einige konkrete Angebote.",
  },
];
