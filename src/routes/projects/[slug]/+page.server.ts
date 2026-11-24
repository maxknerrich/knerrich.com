import { error } from "@sveltejs/kit";
import { caseStudies } from "#lib/server/content.ts";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => caseStudies.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
  const project = caseStudies.find(({ slug }) => slug === params.slug);
  if (!project) error(404, "Project not found");
  return { project };
};
