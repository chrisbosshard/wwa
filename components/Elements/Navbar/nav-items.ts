export type NavItem = {
  label: string;
  href: string;
};

export const mainNavItems: NavItem[] = [
  { label: "Wunsch anmelden", href: "/anmelden" },
  { label: "Erfüllt als Team Wünsche", href: "/team" },
  { label: "Kinder unterstützen", href: "/help" },
];

/* Meta nav order matches Regio pattern: info links first, Kontakt last */
export const metaNavItems: NavItem[] = [
  { label: "Über die Aktion", href: "/info" },
  { label: "Unsere Partner", href: "/partner" },
  { label: "Impressum", href: "/impressum" },
  { label: "Kontakt", href: "/contact" },
];

export const ctaNavItem: NavItem = {
  label: "Wunsch erfüllen",
  href: "/wunscherfuellen",
};
