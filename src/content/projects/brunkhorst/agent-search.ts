import type { IconName } from "#lib/icons/glyphs.ts";

export const actors: { name: string; icon: IconName }[] = [
  { name: "Visitor", icon: "pixelUser" },
  { name: "Agent", icon: "pixelZap" },
  { name: "Website", icon: "pixelLaptop" },
];

export const steps: {
  title: string;
  detail: string;
  from: number;
  to: number;
  label: string;
}[] = [
  {
    title: "A visitor asks",
    detail: "the agent in their browser",
    from: 0,
    to: 1,
    label: "asks",
  },
  {
    title: "The agent calls the site",
    detail: "a WebMCP tool, plain names in",
    from: 1,
    to: 2,
    label: "search_cars()",
  },
  {
    title: "It gets data back",
    detail: "the same 19 as on /fahrzeuge",
    from: 2,
    to: 1,
    label: "19 cars",
  },
];

export const rows: { actor: number; step: number; key: string; value: string }[] = [
  { actor: 0, step: 0, key: "asks", value: "Dacia, Automatik, max. 20.000 €" },
  { actor: 1, step: 1, key: "tool", value: "search_cars" },
  { actor: 1, step: 1, key: "brand", value: "Dacia" },
  { actor: 1, step: 1, key: "gearbox", value: "Automatik" },
  { actor: 1, step: 1, key: "maxPrice", value: "20000" },
  { actor: 2, step: 2, key: "hits", value: "19" },
  { actor: 2, step: 2, key: "cars", value: "the first 4, with price, km, fuel and branch" },
  { actor: 2, step: 2, key: "allResults", value: "/fahrzeuge?…" },
];
