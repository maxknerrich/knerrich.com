<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { rollMarker, space } from "#lib/styles/tokens.stylex.ts";

  const notFound = stylex.create({
    message: {
      marginBlockStart: space["--space-24"],
    },
  });
</script>

<script lang="ts">
  import { resolve } from "$app/paths";
  import { article, type } from "#lib/styles/shared.ts";
  import Roll from "#lib/Roll.svelte";
</script>

<svelte:head>
  <title>Page not found · Max Knerrich</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main id="main" tabindex="-1" {...stylex.attrs(article.page)}>
  <div {...stylex.attrs(article.column)}>
    <h1 {...stylex.attrs(article.title, type.h2)}>This page doesn't exist</h1>
    <p {...stylex.attrs(notFound.message, type.lead, type.secondary)}>
      It may have moved. Try the <a href={resolve("/")} {...stylex.attrs(rollMarker)}><Roll>homepage</Roll></a> or the
      <a href={resolve("/writing")} {...stylex.attrs(rollMarker)}><Roll>writing</Roll></a>.
    </p>
  </div>
</main>
