<script lang="ts">
  import OgImage from "./OgImage.svelte";
  import { jsonLd, NAME, ogImage, person, SITE } from "./site.ts";

  let {
    title,
    description,
    path,
    type,
    alt,
    modified,
    work,
  }: {
    title: string;
    description: string;
    path: string;
    type: "website" | "article";
    alt: string;
    modified?: string;
    work?: { kind: "project"; year: number | string } | { kind: "piece"; created?: string };
  } = $props();

  const canonical = $derived(`${SITE}/${path}`);
  const structured = $derived(
    work &&
      jsonLd({
        ...(work.kind === "project"
          ? { "@type": "CreativeWork", name: title, dateCreated: String(work.year).split("–")[0] }
          : { "@type": "Article", headline: title, datePublished: work.created, dateModified: modified }),
        description,
        url: canonical,
        image: ogImage(path),
        author: person,
      }),
  );
</script>

<svelte:head>
  <title>{title} · {NAME}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:site_name" content={NAME} />
  <meta property="og:type" content={type} />
  <meta property="og:title" content={`${title} · ${NAME}`} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <OgImage page={path} {alt} />
  {#if modified}<meta property="article:modified_time" content={modified} />{/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@maxknerrich" />
  {#if structured}{@html structured}{/if}
</svelte:head>
