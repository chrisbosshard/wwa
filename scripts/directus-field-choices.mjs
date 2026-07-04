/** Directus schema field choices — not page content. */

export const PAGE_LAYOUTS = [
  { text: "Einfach (Fliesstext)", value: "simple" },
  { text: "1 Spalte", value: "one_column" },
  { text: "2 Spalten", value: "two_column" },
  { text: "3 Spalten", value: "three_column" },
];

export const PAGE_STATE_CHOICES = [
  "pre_registration",
  "registration",
  "post_registration",
  "waitinglist",
  "wish_fulfilment",
  "closed",
  "done",
].map((s) => ({ text: s, value: s }));
