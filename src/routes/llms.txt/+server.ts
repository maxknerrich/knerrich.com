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
      "> I set software teams up to build with agents: feedback loops, environments and validation. I also design and engineer software, from sync engines to car dashboards. Based in Sydney, available worldwide.",
      "",
      "## Projects",
      "",
      ...projects.map(({ slug, title, description }) =>
        item(title, `${SITE}/projects/${slug}`, description),
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
