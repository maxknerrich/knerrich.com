import { error } from "@sveltejs/kit";
import { cards, renderPage } from "#lib/server/og.ts";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;

export const entries: EntryGenerator = () =>
  [...cards.keys()].map((page) => ({ page: `${page}.jpg` }));

export const GET: RequestHandler = async ({ params }) => {
  const page = params.page.replace(/\.jpg$/, "");
  const card = params.page.endsWith(".jpg") ? cards.get(page) : undefined;
  if (!card) error(404, "No preview image here");
  return new Response(await renderPage(page, card), { headers: { "content-type": "image/jpeg" } });
};
