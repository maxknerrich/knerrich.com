<script lang="ts">
  import { resolve } from "$app/paths";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const project = $derived(data.project);
  const canonical = $derived(`https://knerrich.com/projects/${project.slug}`);
  const backHref = $derived(`${resolve('/')}#project-${project.slug}`);
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

<main id="main" tabindex="-1" class="project-page">
  <nav aria-label="Back to selected work" class="back-link">
    <a href={backHref}>← Selected work</a>
  </nav>
  <article aria-labelledby="project-title">
    <h1 id="project-title">
      <span style:view-transition-name={`project-title-${project.slug}`}>{project.title}</span>
    </h1>
    {#if project.tags.length}
      <ul class="tags" aria-label="Work type">
        {#each project.tags as tag (tag)}
          <li>{tag}</li>
        {/each}
      </ul>
    {/if}
    {#if project.hero}
      <img
        class="hero-image"
        data-project-hero
        style:view-transition-name={`project-image-${project.slug}`}
        src={project.hero.src}
        alt={project.hero.alt}
        decoding="async"
        fetchpriority="high"
      />
    {/if}
    <!-- HTML comes only from our repository's Markdown, never visitor input. -->
    <div class="prose">{@html project.html}</div>
  </article>
  <footer>
    <a href={backHref}>← Selected work</a>
    <a href="mailto:max@knerrich.com">Get in touch ↗</a>
  </footer>
</main>

<style>
  @layer portfolio {
    .project-page {
      --media-space: clamp(3rem, 6vw, 5rem);
      max-inline-size: 64rem;
      margin-inline: auto;
      padding: 12rem 2rem 4rem;
      scroll-margin-block-start: var(--site-header-height);
    }

    .back-link,
    h1,
    .tags,
    footer,
    .prose :global(> :not(p:has(> img))) {
      max-inline-size: 39rem;
      margin-inline: auto;
    }

    .back-link {
      margin-block-end: 3rem;
      color: var(--muted);
      font-family: var(--font-mono);
      font-size: 0.75rem;
    }

    h1 {
      font-family: var(--font-display);
      font-size: clamp(2.625rem, 6.5vw, 3.625rem);
      font-weight: 400;
      line-height: 1.08;
      letter-spacing: -0.025em;
      text-wrap: balance;
      margin-block-end: 2rem;
    }

    h1 span {
      display: inline-block;
      view-transition-class: project-title;
    }

    .hero-image {
      view-transition-class: project-image;
      display: block;
      inline-size: 100%;
      block-size: auto;
      border-radius: 0.625rem;
      background: var(--image-paper);
      margin-block: 0 var(--media-space);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
      padding: 0;
      margin-block: 0 3.5rem;
      list-style: none;
    }
    .tags li {
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--rule);
      border-radius: 2rem;
      color: var(--muted);
      font-family: var(--font-mono);
      font-size: 0.75rem;
    }

    .prose {
      color: var(--muted);
      font-size: 1.0625rem;
      line-height: 1.85;
      overflow-wrap: anywhere;
    }

    .prose :global(> * + *) {
      margin-block-start: 2rem;
    }

    .prose :global(> p:first-child) {
      font-size: 1.25rem;
      line-height: 1.7;
      color: var(--ink);
      margin-block-end: 3rem;
    }

    .prose :global(h2),
    .prose :global(h3) {
      color: var(--ink);
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 500;
      line-height: 1.3;
      margin-block-start: 4rem;
    }

    .prose :global(strong),
    .prose :global(a) {
      color: var(--ink);
    }

    .prose :global(a:hover) {
      color: var(--accent-ink);
    }

    .prose :global(p:has(> img)) {
      margin-block: var(--media-space);
    }

    .prose :global(img) {
      display: block;
      inline-size: 100%;
      block-size: auto;
      border-radius: 0.625rem;
      background: var(--image-paper);
    }

    .prose :global(p:has(> img) + p:has(> em:only-child)) {
      margin-block-start: calc(1rem - var(--media-space));
      font-size: 0.8125rem;
    }

    footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
      border-block-start: 1px solid var(--rule);
      margin-block-start: 5rem;
      padding-block-start: 2rem;
      font-size: 0.875rem;
    }

    @media (max-width: 600px) {
      .project-page {
        padding: 9rem 1.5rem 3rem;
      }
    }
  }
</style>
