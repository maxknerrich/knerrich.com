import { projects } from "#lib/server/content.ts";

export const prerender = true;

const SITE = "https://knerrich.com";
const item = (title: string, url: string, description: string) =>
  `- [${title}](${url}): ${description}`;

export const GET = () =>
  new Response(
    [
      "# Max Knerrich",
      "",
      "> Freelance software engineer with a strong UX background, based in Sydney and available worldwide. I build systems and the interfaces that make them useful.",
      "",
      "## Projects",
      "",
      ...projects.map(({ slug, title, description, caseStudy, website }) =>
        item(title, caseStudy ? `${SITE}/projects/${slug}` : (website ?? SITE), description),
      ),
      "",
      "## Contact",
      "",
      "- [Email](mailto:max@knerrich.com)",
      "- [LinkedIn](https://www.linkedin.com/in/maxknerrich/)",
      "- [GitHub](https://github.com/maxknerrich)",
      "",
    ].join("\n"),
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
