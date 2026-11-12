import { entries } from "#lib/server/writing.ts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({ recent: entries.slice(0, 3) });
