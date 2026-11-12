<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import { article } from "#lib/styles/article.ts";

  // Prerendered to build/404.html, which Cloudflare Pages serves (with status 404)
  // for any path that doesn't exist. Without it, Pages answers with the homepage.
</script>

<svelte:head>
  <title>Page not found · Max Knerrich</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main id="main" tabindex="-1" {...stylex.attrs(article.page)}>
  <div {...stylex.attrs(article.column)}>
    <h1 {...stylex.attrs(article.title)}>This page doesn't exist</h1>
    <p {...stylex.attrs(article.message)}>
      It may have moved. Try the <a href={resolve("/")}>homepage</a> or the
      <a href={resolve("/writing")}>writing</a>.
    </p>
  </div>
</main>
