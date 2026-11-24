import { caseStudies, entries } from "#lib/server/content.ts";

export const prerender = true;

const SITE = "https://knerrich.com";

export const GET = () => {
  const paths = [
    "/",
    ...caseStudies.map(({ slug }) => `/projects/${slug}`),
    "/writing",
    ...entries.map(({ slug }) => `/writing/${slug}`),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${SITE}${path}</loc></url>`).join("\n")}
</urlset>
`,
    { headers: { "content-type": "application/xml" } },
  );
};
