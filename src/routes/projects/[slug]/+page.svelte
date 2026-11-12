<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import Prose from "#lib/Prose.svelte";
  import SectionOutline from "#lib/SectionOutline.svelte";
  import { article } from "#lib/styles/article.ts";
  import { tableOfContents } from "#lib/table-of-contents.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const project = $derived(data.project);
  const canonical = $derived(`https://knerrich.com/projects/${project.slug}`);
  const backHref = $derived(`${resolve('/')}#project-${project.slug}`);
  const sections = $derived(tableOfContents(project.headings));
</script>

<svelte:head>
  <title>{project.title} · Max Knerrich</title>
  <meta name="description" content={project.description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={`${project.title} · Max Knerrich`} />
  <meta property="og:description" content={project.description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content="https://knerrich.com/og.jpg" />
  <meta property="og:image:alt" content="Max Knerrich. Developer & Designer. Building Systems & Interfaces." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@maxknerrich" />
</svelte:head>

{#if sections.length}
  <SectionOutline {sections} article />
{/if}

<main id="main" tabindex="-1" {...stylex.attrs(article.page)}>
  <nav aria-label="Back to selected work" {...stylex.attrs(article.column, article.backLink)}>
    <a href={backHref}>← Selected work</a>
  </nav>
  <article aria-labelledby="project-title">
    <h1 id="project-title" {...stylex.attrs(article.column, article.title, article.projectTitle)}>
      {project.title}
    </h1>
    {#if project.tags.length}
      <ul {...stylex.attrs(article.column, article.tags, article.projectTags)} aria-label="Work type">
        {#each project.tags as tag (tag)}
          <li {...stylex.attrs(article.tag)}>{tag}</li>
        {/each}
      </ul>
    {/if}
    {#if project.hero}
      <!-- The page's largest image, so it loads first rather than lazily. -->
      <enhanced:img
        {...stylex.attrs(article.hero)}
        src={project.hero.picture}
        alt={project.hero.alt}
        sizes="(max-width: 64rem) 100vw, 60rem"
        fetchpriority="high"
      />
    {/if}
    <Prose blocks={project.blocks} />
  </article>
  <footer {...stylex.attrs(article.column, article.footer)}>
    <a href={backHref}>← Selected work</a>
    <a href="mailto:max@knerrich.com">Get in touch ↗</a>
  </footer>
</main>

