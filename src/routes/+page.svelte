<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import Button from "#lib/Button.svelte";
  import { EMAIL, MAILTO } from "#lib/contact.ts";
  import OgImage from "#lib/OgImage.svelte";
  import Stickers from "#lib/Stickers.svelte";
  import TypeIn from "#lib/TypeIn.svelte";
  import { playInView } from "#lib/in-view.ts";
  import { easeInOut, followScroll } from "#lib/scroll-follow.ts";
  import Icon from "#lib/icons/Icon.svelte";
  import type { Attachment } from "svelte/attachments";
  import { glass, reveal, scroll, site, type } from "#lib/styles/shared.ts";
  import { cardMarker, rollMarker } from "#lib/styles/tokens.stylex.ts";
  import Roll from "#lib/Roll.svelte";
  import WritingList from "#lib/WritingList.svelte";
  import type { PageProps } from "./$types";
  import { landing } from "./landing.styles";

  let { data }: PageProps = $props();
  const headline = "I design and engineer software, from sync engines to car dashboards.";

  const experience = [
    {
      dates: "Dec 2025–present",
      role: "Design Engineer",
      org: "Freelance · Sydney, remote worldwide",
      description:
        "Working with agencies and product teams across software development, UX, and interface design.",
    },
    {
      dates: "Sep–Dec 2025",
      role: "Senior Software & UX Engineer",
      org: "lw.works · Full-time · Germany, remote",
    },
    {
      dates: "Aug 2023–Mar 2025",
      role: "UX Design, Driver Experience",
      org: "Porsche · Internship, then working student · Weissach",
      description:
        "Contributed to UX concept development and the Macan and Cayenne infotainment redesign, with responsibility for maps, media, and shared interface elements including notifications.",
    },
    {
      dates: "Oct 2022–Aug 2023",
      role: "User Experience Designer",
      org: "LITERACY GmbH · Working student · Stuttgart",
      description:
        "Led UX design for Annex Tracker, a legaltech product for M&A annex-list workflows. Created rapid prototypes to evaluate product directions and user flows.",
    },
  ];

  const education = [
    {
      dates: "2021–2025",
      role: "B.Sc. Computer Science and Media",
      org: "Hochschule der Medien, Stuttgart",
      description: "Bachelor thesis on synchronizing external APIs with local-first applications.",
    },
  ];

  const GROWN = 0.7;
  const growOnScroll: Attachment<HTMLElement> = (grid) => {
    const content = grid.parentElement;
    if (!content) return;
    let from = 1;
    let grown = 1;
    const draw = () => (grid.style.scale = String(from + (1 - from) * grown));
    const observer = new ResizeObserver(() => {
      from = content.clientWidth / grid.offsetWidth;
      draw();
    });
    observer.observe(grid);
    observer.observe(content);
    const unfollow = followScroll(
      (box) => (innerHeight - box.top) / (innerHeight * GROWN),
      (progress) => {
        grown = easeInOut(progress);
        draw();
      },
    )(grid);
    return () => {
      observer.disconnect();
      unfollow?.();
    };
  };
  const driftOnScroll: Attachment<HTMLElement> = (card) => {
    const image = card.querySelector("img");
    if (!image) return;
    let spare = 0;
    return followScroll(
      (box) => {
        spare = (image.offsetHeight - card.clientHeight) / 2;
        return (innerHeight - box.top) / (innerHeight + box.height);
      },
      (progress) => (image.style.translate = `0 ${(1 - progress * 2) * spare}px`),
    )(card);
  };
</script>

<svelte:head>
  <title>Max Knerrich · Software engineer</title>
  <meta
    name="description"
    content="{headline} Max Knerrich, freelance software engineer with a strong UX background. Based in Sydney, available worldwide. Ex-Porsche."
  />
  <link rel="canonical" href="https://knerrich.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Max Knerrich · Software engineer" />
  <meta property="og:description" content="{headline} Based in Sydney, available worldwide." />
  <meta property="og:url" content="https://knerrich.com/" />
  <OgImage page="index" alt={headline} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@maxknerrich" />
</svelte:head>

{#snippet tagList(tags: readonly string[])}
  <ul aria-label="Tags" {...stylex.attrs(site.plainList, landing.inline, landing.tags, type.small)}>
    {#each tags as tag (tag)}
      <li {...stylex.attrs(landing.tag)}>{tag}</li>
    {/each}
  </ul>
{/snippet}

{#snippet rows(items: { dates: string; role: string; org: string; description?: string }[])}
  <dl {...stylex.attrs(site.plainList, site.rows)}>
    {#each items as item (item.role)}
      <div {@attach playInView} {...stylex.attrs(site.row, landing.experience, scroll.reveal)}>
        <dt {...stylex.attrs(landing.dates, type.small, type.muted)}>{item.dates}</dt>
        <dd>
          <p {...stylex.attrs(type.lead)}>{item.role}</p>
          <p {...stylex.attrs(landing.org, type.body, type.secondary)}>{item.org}</p>
          {#if item.description}
            <p {...stylex.attrs(landing.role, type.body, type.muted)}>{item.description}</p>
          {/if}
        </dd>
      </div>
    {/each}
  </dl>
{/snippet}

<main id="main" tabindex="-1" {...stylex.attrs(site.content)}>
  <section aria-labelledby="intro" {...stylex.attrs(landing.hero)}>
    <p {...stylex.attrs(landing.statement, type.h3, scroll.reveal, scroll.now, reveal.delay("500ms"))}>
      Freelance software engineer with a strong UX background.
    </p>
    <div {...stylex.attrs(landing.heroBottom)}>
      <Stickers />
      <div {...stylex.attrs(landing.heroMeta, type.small, scroll.reveal, scroll.now, reveal.delay("650ms"))}>
        <p data-pin="place" {...stylex.attrs(landing.inline, landing.place, type.secondary)}>Sydney, AU</p>
        <div {...stylex.attrs(landing.inline, landing.heroPlace)}>
          <p {...stylex.attrs(type.secondary)}>Available worldwide</p>
          <a href="#about" {...stylex.attrs(site.link, landing.shimmer, glass.focus)}
            >Scroll to explore ↓</a
          >
        </div>
      </div>
      <h1 id="intro" {...stylex.attrs(type.display, reveal.focus)}>
        I design and engineer software, <TypeIn text="from sync engines to car dashboards." onLoad />
      </h1>
    </div>
  </section>

  <section
    id="about"
    aria-labelledby="about-heading"
    {...stylex.attrs(landing.section, landing.column)}
  >
    <h2 id="about-heading" {@attach playInView} {...stylex.attrs(type.small, type.muted, scroll.reveal)}>About</h2>
    <div {...stylex.attrs(landing.columns, landing.aboutColumns)}>
      <p {@attach playInView} {...stylex.attrs(type.lead, scroll.reveal)}>
        At Porsche, I built prototyping design systems and worked on the Macan's infotainment
        experience. <TypeIn
          text="My interest in local-first software shaped my thesis on bidirectional sync with REST APIs."
        />
      </p>
      <p {@attach playInView} {...stylex.attrs(type.body, type.secondary, scroll.reveal, scroll.later)}>
        Today, I work worldwide on software, interfaces, and prototypes. Outside work, I play and
        coach American football.
      </p>
    </div>
    <div {@attach playInView} {...stylex.attrs(landing.action, scroll.reveal)}>
      <Button href={MAILTO}>Let's work together</Button>
    </div>
    <ul
      aria-label="Companies I've worked with"
      {@attach playInView}
      {...stylex.attrs(site.plainList, landing.inline, landing.logos, landing.trusted, type.secondary, scroll.reveal)}
    >
      <li {...stylex.attrs(landing.logoItem)}>
        <Icon name="tldraw" label="tldraw" style={landing.trustedLogo} />
      </li>
      <li {...stylex.attrs(landing.logoItem)}>
        <Icon name="lwWorks" label="lw.works" style={landing.trustedLogo} />
      </li>
      <li {...stylex.attrs(landing.logoItem)}>
        <Icon name="porsche" label="Porsche" style={[landing.trustedLogo, landing.porscheLogo]} />
      </li>
    </ul>
  </section>

  <section id="work" aria-labelledby="work-heading" {...stylex.attrs(landing.section)}>
    <div {...stylex.attrs(landing.column)}>
      <h2 id="work-heading" {@attach playInView} {...stylex.attrs(type.h1, scroll.reveal)}>
        Selected work. <TypeIn text="Projects I'm proud of." />
      </h2>
      <div {...stylex.attrs(landing.columns)}>
        <p {@attach playInView} {...stylex.attrs(type.lead, scroll.reveal)}>
          I work with agencies and product teams <span {...stylex.attrs(type.secondary)}
            >across software development, UX, and interface design.</span
          >
        </p>
        <p {@attach playInView} {...stylex.attrs(type.body, type.secondary, scroll.reveal, scroll.later)}>
          From 3D illustrations for tldraw to the infotainment in a Porsche.
        </p>
      </div>
    </div>

    <ul {@attach growOnScroll} {...stylex.attrs(site.plainList, landing.grid, landing.grow)}>
      {#each data.projects as project, i (project.slug)}
        <li {@attach playInView} {...stylex.attrs(scroll.reveal, i % 2 === 1 && scroll.later)}>
          <a
            id={`project-${project.slug}`}
            href={project.caseStudy ? resolve("/projects/[slug]", { slug: project.slug }) : project.website}
            aria-labelledby={`project-${project.slug}-title`}
            aria-describedby={`project-${project.slug}-meta`}
            {@attach driftOnScroll} {...stylex.attrs(cardMarker, rollMarker, glass.edge, glass.card, landing.project, landing.imageProject)}
          >
            <enhanced:img
              src={project.hero.picture}
              alt={project.hero.alt}
              sizes="(max-width: 600px) 100vw, 50vw"
              loading="lazy"
              decoding="async"
              {...stylex.attrs(landing.image, landing.parallax)}
            />
            {@render tagList(project.services)}
            <div {...stylex.attrs(landing.caption)}>
              <h3 id={`project-${project.slug}-title`} {...stylex.attrs(type.h3)}>
                <Roll hover={project.caseStudy ? "Open case study" : "Visit website"}>{project.title}</Roll>
              </h3>
              <p id={`project-${project.slug}-meta`} {...stylex.attrs(type.small, type.secondary)}>
                {project.industry} · {project.year}
              </p>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  </section>

  <section
    id="writing"
    aria-labelledby="writing-heading"
    {...stylex.attrs(landing.section, landing.column)}
  >
    <h2 id="writing-heading" {@attach playInView} {...stylex.attrs(type.h2, scroll.reveal)}>
      Writing. <TypeIn text="Notes I keep tending." />
    </h2>
    {#if data.recent.length}<WritingList entries={data.recent} />{/if}
    <div {@attach playInView} {...stylex.attrs(!data.recent.length && landing.action, scroll.reveal)}>
      <Button href={resolve("/writing")}>All writing</Button>
    </div>
  </section>

  <section
    id="experience"
    aria-labelledby="experience-heading"
    {...stylex.attrs(landing.section, landing.column)}
  >
    <h2 id="experience-heading" {@attach playInView} {...stylex.attrs(type.h2, scroll.reveal)}>
      Experience. <TypeIn text="Where I've worked." />
    </h2>
    {@render rows(experience)}
    <h3 {@attach playInView} {...stylex.attrs(landing.education, type.h3, scroll.reveal)}>Education</h3>
    {@render rows(education)}
  </section>

  <section id="contact" aria-labelledby="contact-heading" {...stylex.attrs(landing.contact)}>
    <p {...stylex.attrs(landing.inline, landing.place, type.small, type.secondary)}>Sydney, AU</p>
    <h2 id="contact-heading" {...stylex.attrs(landing.contactHeading, type.h2)}>
      Have a project in mind? <span {...stylex.attrs(type.secondary)}>Tell me what you're working on.</span>
    </h2>
    <div {...stylex.attrs(landing.contactAction)}>
      <Button href={MAILTO} variant="primary">{EMAIL}</Button>
    </div>
  </section>
</main>
