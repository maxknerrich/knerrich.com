<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import WritingList from "#lib/WritingList.svelte";
  import { listPage } from "#lib/styles/writing.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const description = "Notes and essays by Max Knerrich, kept as a digital garden: pieces are tended and rewritten over time.";
</script>

<svelte:head>
  <title>Writing · Max Knerrich</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="https://knerrich.com/writing" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Writing · Max Knerrich" />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="https://knerrich.com/writing" />
  <meta property="og:image" content="https://knerrich.com/og.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@maxknerrich" />
</svelte:head>

<main id="main" tabindex="-1" {...stylex.attrs(listPage.page)}>
  <header {...stylex.attrs(listPage.intro)}>
    <h1 {...stylex.attrs(listPage.title)}>Writing</h1>
    <p {...stylex.attrs(listPage.text)}>A garden of things I keep rewriting. Recently tended pieces come first.</p>
  </header>

  <WritingList entries={data.entries} years />
</main>
