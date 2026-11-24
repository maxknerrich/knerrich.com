<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { layout, space } from "#lib/styles/tokens.stylex.ts";

  const listPage = stylex.create({
    page: {
      maxInlineSize: layout["--measure"],
      marginInline: "auto",
      paddingBlockStart: layout["--hero-space"],
    },
    intro: {
      marginBlockStart: space["--space-12"],
    },
    list: {
      marginBlockStart: space["--space-48"],
    },
  });
</script>

<script lang="ts">
  import PageHead from "#lib/PageHead.svelte";
  import WritingList from "#lib/WritingList.svelte";
  import { reveal, scroll, site, type } from "#lib/styles/shared.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const description = "Notes and essays by Max Knerrich, kept as a digital garden: pieces are tended and rewritten over time.";
</script>

<PageHead title="Writing" {description} path="writing" type="website" alt="Writing" />

<main id="main" tabindex="-1" {...stylex.attrs(site.content)}>
  <div {...stylex.attrs(listPage.page)}>
    <h1 {...stylex.attrs(type.h3, reveal.focus)}>Writing</h1>
    <p {...stylex.attrs(listPage.intro, type.body, type.secondary, scroll.reveal, scroll.now, scroll.later)}>
      A garden of things I keep rewriting. Recently tended pieces come first. Follow along with the
      <a href="/rss.xml">feed</a>.
    </p>
    <div {...stylex.attrs(listPage.list)}>
      <WritingList entries={data.entries} compact years />
    </div>
  </div>
</main>
