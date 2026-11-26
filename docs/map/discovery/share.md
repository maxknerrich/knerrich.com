# Share images and meta

Every page has a title, description and a share image made at build.

- Every URL in the meta, the sitemap, the feed, llms.txt and robots.txt is on `https://www.knerrich.com` (`src/lib/site.ts`), the host that doesn't redirect.
- An author can set their own image.
- Structured data, built only from what the content already says: me and the site on the landing page, each case study as a creative work, each piece as an article.
- Browser tabs, bookmarks and the iOS home screen show the K symbol.
- The 404 page isn't indexed.
