<script lang="ts">
  import OgImage from "./OgImage.svelte";

  let {
    title,
    description,
    path,
    type,
    alt,
    modified,
  }: {
    title: string;
    description: string;
    path: string;
    type: "website" | "article";
    alt: string;
    modified?: string;
  } = $props();

  const canonical = $derived(`https://knerrich.com/${path}`);
</script>

<svelte:head>
  <title>{title} · Max Knerrich</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content={type} />
  <meta property="og:title" content={`${title} · Max Knerrich`} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <OgImage page={path} {alt} />
  {#if modified}<meta property="article:modified_time" content={modified} />{/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@maxknerrich" />
</svelte:head>
