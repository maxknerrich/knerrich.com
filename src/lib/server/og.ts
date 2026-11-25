import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Renderer } from "@takumi-rs/core";
import { render } from "svelte/server";
import { projects, pieces } from "./content.ts";
import OgCard from "./OgCard.svelte";

const SIZE = { width: 1200, height: 630 };

export type Card =
  | { kind: "headline"; lead: string; rest: string }
  | { kind: "title"; title: string }
  | { kind: "picture"; file: string; sticker: boolean };

export const cards = new Map<string, Card>([
  [
    "index",
    {
      kind: "headline",
      lead: "I design and engineer software,",
      rest: "from sync engines to car dashboards.",
    },
  ],
  ["writing", { kind: "title", title: "Writing" }],
  ...pieces.map(({ slug, title }): [string, Card] => [`writing/${slug}`, { kind: "title", title }]),
  ...projects.map(({ slug, hero: cover }): [string, Card] => [
    `projects/${slug}`,
    { kind: "picture", file: join("src/content/projects", slug, cover.src), sticker: true },
  ]),
]);

let ready: Promise<Renderer> | undefined;
const renderer = () =>
  (ready ??= (async () => {
    const instance = new Renderer();
    await instance.registerFont({
      name: "Switzer",
      data: readFileSync("static/fonts/switzer-variable.woff2"),
    });
    return instance;
  })());

export async function renderPage(page: string, card: Card) {
  const own = ["jpg", "png"]
    .flatMap((ext) => [`src/content/og/${page}.${ext}`, `src/content/${page}/og.${ext}`])
    .find(existsSync);
  const shown: Card = own ? { kind: "picture", file: own, sticker: false } : card;
  return (await renderer()).render(render(OgCard, { props: { card: shown } }).body, {
    ...SIZE,
    format: "jpeg",
    quality: 88,
    images: shown.kind === "picture" ? [{ src: "picture", data: readFileSync(shown.file) }] : [],
  });
}
