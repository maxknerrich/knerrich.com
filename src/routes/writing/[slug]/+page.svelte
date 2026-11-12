<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import PlantIcon from "#lib/PlantIcon.svelte";
  import Prose from "#lib/Prose.svelte";
  import SectionOutline from "#lib/SectionOutline.svelte";
  import { tableOfContents } from "#lib/table-of-contents.ts";
  import { STAGE_NAMES } from "#lib/writing/sprites.ts";
  import { article } from "#lib/styles/article.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const piece = $derived(data.piece);
  const canonical = $derived(`https://knerrich.com/writing/${piece.slug}`);
  const sections = $derived(tableOfContents(piece.headings));

  const format = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
</script>

<svelte:head>
  <title>{piece.title} · Max Knerrich</title>
  <meta name="description" content={piece.description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={`${piece.title} · Max Knerrich`} />
  <meta property="og:description" content={piece.description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content="https://knerrich.com/og.jpg" />
  <meta property="article:modified_time" content={piece.tended} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@maxknerrich" />
</svelte:head>

{#if sections.length}
  <SectionOutline {sections} article />
{/if}

<main
  id="main"
  tabindex="-1"
  {...stylex.attrs(article.page)}
>
  <nav
    aria-label="Back to writing"
    {...stylex.attrs(article.column, article.backLink)}
  ><a href={resolve('writing')}>← Writing</a></nav>

  <article aria-labelledby="piece-title">
    <header {...stylex.attrs(article.column, article.header)}>
      <p {...stylex.attrs(article.stage)}><PlantIcon stage={piece.stage} />{STAGE_NAMES[piece.stage]}</p>
      <h1 id="piece-title" {...stylex.attrs(article.title)}>
        {piece.title}
      </h1>
      <p {...stylex.attrs(article.dates)}>
        <span>Planted <time {...stylex.attrs(article.date)} datetime={piece.planted}>{format(piece.planted)}</time></span>
        {#if piece.tended !== piece.planted}
          <span>Last tended <time {...stylex.attrs(article.date)} datetime={piece.tended}>{format(piece.tended)}</time></span>
        {/if}
      </p>
      {#if piece.tags.length}
        <ul {...stylex.attrs(article.tags, article.pieceTags)} aria-label="Topics">
          {#each piece.tags as tag (tag)}<li {...stylex.attrs(article.tag)}>{tag}</li>{/each}
        </ul>
      {/if}
    </header>

    <Prose blocks={piece.blocks} />
  </article>

  <footer {...stylex.attrs(article.column, article.footer)}>
    <a href={resolve('writing')}>← Writing</a>
    <a href="mailto:max@knerrich.com">Get in touch ↗</a>
  </footer>
</main>
