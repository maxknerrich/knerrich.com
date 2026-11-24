<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import BrandGlow from "#lib/BrandGlow.svelte";
  import Button from "#lib/Button.svelte";
  import Icon from "#lib/icons/Icon.svelte";
  import PageHead from "#lib/PageHead.svelte";
  import Prose from "#lib/Prose.svelte";
  import { article, glass, reveal, site, type } from "#lib/styles/shared.ts";
  import { rollMarker } from "#lib/styles/tokens.stylex.ts";
  import Roll from "#lib/Roll.svelte";
  import type { PageProps } from "./$types";
  import { caseStudy } from "./case-study.styles";

  let { data }: PageProps = $props();
  const project = $derived(data.project);
  const backHref = $derived(`${resolve('/')}#project-${project.slug}`);
</script>

<PageHead
  title={project.title}
  description={project.description}
  path={`projects/${project.slug}`}
  type="article"
  alt={project.hero.alt}
/>

<main id="main" tabindex="-1" {...stylex.attrs(caseStudy.page, caseStudy.brand(project.color))}>
  <article aria-labelledby="project-title">
    <header {...stylex.attrs(caseStudy.hero)}>
      <BrandGlow />
      <div {...stylex.attrs(caseStudy.heroContent)}>
        <nav aria-label="Back to selected work" {...stylex.attrs(caseStudy.back, type.small, type.secondary)}>
          <a href={backHref} {...stylex.attrs(site.link, site.backLink, glass.focus, rollMarker)}><Icon name="back" style={site.backIcon} /><Roll>Selected work</Roll></a>
        </nav>
        <h1 id="project-title" {...stylex.attrs(caseStudy.title, type.display, reveal.focus)}>
          {project.title}
        </h1>
        <p {...stylex.attrs(caseStudy.meta, type.small, type.secondary)}>{project.industry} · {project.year}</p>
        <p {...stylex.attrs(caseStudy.description, type.lead, type.secondary)}>
          {project.description}
        </p>
      </div>
    </header>

    <figure {...stylex.attrs(caseStudy.fold)}>
      <enhanced:img
        {...stylex.attrs(caseStudy.cover)}
        src={project.hero.picture}
        alt={project.hero.alt}
        sizes="(max-width: 85rem) 100vw, 85rem"
        fetchpriority="high"
      />
    </figure>

    <section id="about" aria-label="About the project" {...stylex.attrs(caseStudy.about)}>
      <div>
        {#if project.services.length}
          <h2 {...stylex.attrs(caseStudy.label, type.small, type.muted)}>Services</h2>
          <ul {...stylex.attrs(caseStudy.services, type.lead)}>
            {#each project.services as service (service)}
              <li>{service}</li>
            {/each}
          </ul>
        {/if}
      </div>
      <div>
        <Prose blocks={project.about} />
        {#if project.website}
          <div {...stylex.attrs(caseStudy.website)}>
            <Button href={project.website}>Visit website</Button>
          </div>
        {/if}
      </div>
    </section>

    <div {...stylex.attrs(caseStudy.story)}>
      <Prose blocks={project.blocks} />
    </div>
  </article>
  <footer {...stylex.attrs(article.column, article.footer, project.footnotes && article.footerAfterNotes, type.small, type.secondary)}>
    <a href={backHref} {...stylex.attrs(site.link, site.backLink, glass.focus, rollMarker)}><Icon name="back" style={site.backIcon} /><Roll>Selected work</Roll></a>
  </footer>
</main>
