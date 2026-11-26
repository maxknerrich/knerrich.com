import { EMAIL, SOCIAL } from "./contact.ts";

export const SITE = "https://www.knerrich.com";
export const NAME = "Max Knerrich";

export const ogImage = (page: string) => `${SITE}/og/${page}.jpg`;

export const person = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: NAME,
  url: `${SITE}/`,
  email: EMAIL,
  sameAs: SOCIAL.map(({ href }) => href),
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: `${SITE}/`,
  name: NAME,
  author: { "@id": person["@id"] },
};

export const jsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...data }).replaceAll("<", "\\u003c")}</script>`;
export const homeJsonLd = jsonLd({ "@graph": [person, website] });
