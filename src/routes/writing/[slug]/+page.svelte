<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { color, font, radius, space } from "#lib/styles/tokens.stylex.ts";

  const piecePage = stylex.create({
    back: {
      marginBlockEnd: space["--space-48"],
    },
    header: {
      marginBlockEnd: space["--space-64"],
    },
    stage: {
      display: "flex",
      fontFamily: font["--font-pixel"],
      alignItems: "end",
      gap: space["--space-8"],
      marginBlockEnd: space["--space-16"],
    },
    dates: {
      display: "flex",
      fontFamily: font["--font-pixel"],
      flexWrap: "wrap",
      rowGap: space["--space-4"],
      columnGap: space["--space-24"],
      marginBlockStart: space["--space-24"],
    },
    date: {
      color: color["--text-secondary"],
    },
    tags: {
      display: "flex",
      flexWrap: "wrap",
      gap: space["--space-8"],
      marginBlockStart: space["--space-24"],
    },
    tag: {
      display: "flex",
      alignItems: "center",
      blockSize: "2rem",
      paddingInline: space["--space-12"],
      borderRadius: radius["--radius-md"],
    },
  });
</script>

<script lang="ts">
  import { resolve } from "$app/paths";
  import Icon from "#lib/icons/Icon.svelte";
  import PageHead from "#lib/PageHead.svelte";
  import Stage from "#lib/Stage.svelte";
  import Prose from "#lib/Prose.svelte";
  import ReadingRail from "#lib/ReadingRail.svelte";
  import { article, glass, reveal, site, type } from "#lib/styles/shared.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const piece = $derived(data.piece);
  const sections = $derived.by(() => {
    const all = [
      { id: "main", label: "Intro", depth: 2 },
      ...piece.headings.map(({ id, text, depth }) => ({ id, label: text, depth })),
    ];
    return all.filter(({ depth }) => depth === 2).length > 2 ? all : [];
  });

  const format = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
</script>

<PageHead
  title={piece.title}
  description={piece.description}
  path={`writing/${piece.slug}`}
  type="article"
  alt={piece.title}
  modified={piece.updated}
  work={{ kind: "piece", created: piece.created }}
/>

{#if sections.length}
  <ReadingRail {sections} minutes={piece.minutes} />
{/if}

<main id="main" tabindex="-1" {...stylex.attrs(article.page)}>
  <nav aria-label="Back to writing" {...stylex.attrs(article.column, piecePage.back, type.small, type.secondary)}>
    <a href={resolve('/writing')} {...stylex.attrs(site.link, site.backLink, glass.focus)}><Icon name="back" style={site.backIcon} />Writing</a>
  </nav>

  <article aria-labelledby="piece-title">
    <header {...stylex.attrs(article.column, piecePage.header)}>
      <p {...stylex.attrs(piecePage.stage, type.small, type.secondary)}><Stage stage={piece.stage} now /></p>
      <h1 id="piece-title" {...stylex.attrs(article.title, type.h2, reveal.focus)}>{piece.title}</h1>
      <p {...stylex.attrs(piecePage.dates, type.small, type.muted)}>
        {#if piece.created}
          <span>Planted <time {...stylex.attrs(piecePage.date)} datetime={piece.created}>{format(piece.created)}</time></span>
        {/if}
        {#if piece.updated && piece.updated !== piece.created}
          <span>Last tended <time {...stylex.attrs(piecePage.date)} datetime={piece.updated}>{format(piece.updated)}</time></span>
        {/if}
      </p>
      {#if piece.tags.length}
        <ul {...stylex.attrs(site.plainList, piecePage.tags, type.small, type.secondary)} aria-label="Topics">
          {#each piece.tags as tag (tag)}<li {...stylex.attrs(glass.edge, glass.card, piecePage.tag)}>{tag}</li>{/each}
        </ul>
      {/if}
    </header>

    <Prose blocks={piece.blocks} />
  </article>

  <footer {...stylex.attrs(article.column, article.footer, piece.footnotes && article.footerAfterNotes, type.small, type.secondary)}>
    <a href={resolve('/writing')} {...stylex.attrs(site.link, site.backLink, glass.focus)}><Icon name="back" style={site.backIcon} />All writing</a>
  </footer>
</main>
