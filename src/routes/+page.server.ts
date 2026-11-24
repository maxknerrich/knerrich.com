import { cards, entries } from "#lib/server/content.ts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({ projects: cards, recent: entries.slice(0, 3) });
