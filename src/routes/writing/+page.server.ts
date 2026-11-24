import { entries } from "#lib/server/content.ts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({ entries });
