import { loadEmbeds } from "#lib/embeds/index.ts";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ data }) => {
  await loadEmbeds(data.piece.blocks);
  return data;
};
