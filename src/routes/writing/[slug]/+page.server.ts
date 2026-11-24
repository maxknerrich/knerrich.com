import { error } from "@sveltejs/kit";
import { pieces } from "#lib/server/content.ts";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => pieces.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
  const piece = pieces.find(({ slug }) => slug === params.slug);
  if (!piece) error(404, "Writing not found");
  return { piece };
};
