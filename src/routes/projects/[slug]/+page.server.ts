import { error } from "@sveltejs/kit";
import { projects } from "$lib/server/projects";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => projects.map(({ slug }) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
  const project = projects.find(({ slug }) => slug === params.slug);
  if (!project) error(404, "Project not found");
  return { project };
};
