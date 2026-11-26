<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import BrandGlow from "#lib/BrandGlow.svelte";
  import Button from "#lib/Button.svelte";
  import { EMAIL, MAILTO } from "#lib/contact.ts";
  import OgImage from "#lib/OgImage.svelte";
  import { homeJsonLd, NAME, SITE } from "#lib/site.ts";
  import Stickers from "#lib/Stickers.svelte";
  import TypeIn from "#lib/TypeIn.svelte";
  import { playInView } from "#lib/in-view.ts";
  import { easeInOut, followScroll } from "#lib/scroll-follow.ts";
  import Icon from "#lib/icons/Icon.svelte";
  import HoloSticker from "#lib/HoloSticker.svelte";
  import type { Attachment } from "svelte/attachments";
  import { glass, reveal, scroll, site, type } from "#lib/styles/shared.ts";
  import { cardMarker, rollMarker } from "#lib/styles/tokens.stylex.ts";
  import Roll from "#lib/Roll.svelte";
  import WritingList from "#lib/WritingList.svelte";
  import type { PageProps } from "./$types";
  import { landing } from "./landing.styles";

  let { data }: PageProps = $props();
  const headline = "I design and engineer software, from sync engines to car dashboards.";
  const also = headline.replace("I design", "I also design");

  const offers = [
    {
      id: "agents",
      kicker: "Consulting",
      title: "Building with agents",
      pitch: "Your team wants to move faster with agents, but isn't sure how to use them well. I work with your developers and your setup until they can.",
      points: [
        { term: "Feedback loops", text: "every change is checked as soon as it's written." },
        { term: "Environments", text: "each agent works in its own copy of the project." },
        { term: "Validation", text: "types, tests and a real browser before anyone reviews." },
        { term: "Coaching", text: "what to hand an agent, how to ask, how to check the result." },
      ],
      subject: "Consulting: building with agents",
      icon: "pixelSparkle",
      tilt: -9,
    },
    {
      id: "design",
      kicker: "Product",
      title: "Design engineering",
      pitch: "You have an idea and need someone to make it real. I design it, build it, or both, from first sketch to shipped product.",
      points: [
        { term: "", text: "Product and interface design" },
        { term: "", text: "Design systems and prototypes" },
        { term: "", text: "Front-end and local-first engineering" },
        { term: "", text: "Websites and 3D illustration" },
      ],
      subject: "Project: design engineering",
      icon: "pixelBrush",
      tilt: 8,
    },
  ] as const;

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
  <title>Max Knerrich · Building with agents, design engineering</title>
  <meta
    name="description"
    content="I set software teams up to build with agents. {also} Sydney, worldwide. Ex-Porsche."
  />
  <link rel="canonical" href="{SITE}/" />
  <meta property="og:site_name" content={NAME} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Max Knerrich · Building with agents, design engineering" />
  <meta
    property="og:description"
    content="I set software teams up to build with agents. {also} Based in Sydney, available worldwide."
  />
  <meta property="og:url" content="{SITE}/" />
  <OgImage page="index" alt={headline} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@maxknerrich" />
  {@html homeJsonLd}
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
      I set teams up to build with agents. Freelance design engineer.
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
        Today, I set teams up to build with agents, and I design and build software for clients worldwide.
      </p>
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
            href={resolve("/projects/[slug]", { slug: project.slug })}
            aria-labelledby={`project-${project.slug}-title`}
            aria-describedby={`project-${project.slug}-meta`}
            {@attach driftOnScroll} {...stylex.attrs(cardMarker, rollMarker, glass.edge, glass.card, landing.project, landing.imageProject)}
          >
            <enhanced:img
              src={project.card}
              alt=""
              sizes="(max-width: 600px) 100vw, 50vw"
              loading="lazy"
              decoding="async"
              {...stylex.attrs(landing.image, landing.parallax)}
            />
            {@render tagList(project.services)}
            <div {...stylex.attrs(landing.caption)}>
              <h3 id={`project-${project.slug}-title`} {...stylex.attrs(type.h3)}>
                <Roll hover="Open case study">{project.title}</Roll>
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
    {#if data.recent.length}
      <WritingList entries={data.recent} />
      <div {@attach playInView} {...stylex.attrs(scroll.reveal)}>
        <Button href={resolve("/writing")}>All writing</Button>
      </div>
    {:else}
      <p {@attach playInView} {...stylex.attrs(landing.action, type.lead, type.secondary, scroll.reveal)}>
        The first pieces are coming soon.
      </p>
    {/if}
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

  <section id="contact" aria-labelledby="contact-heading" {...stylex.attrs(landing.contact, landing.column)}>
    <div {...stylex.attrs(landing.glow)}><BrandGlow /></div>
    <h2 id="contact-heading" {@attach playInView} {...stylex.attrs(type.h1, scroll.reveal)}>
      Work with me. <TypeIn text="Two ways to start." />
    </h2>
    <ul {...stylex.attrs(site.plainList, landing.offers)}>
      {#each offers as offer, i (offer.id)}
        <li {@attach playInView} {...stylex.attrs(landing.offerItem, scroll.reveal, i % 2 === 1 && scroll.later)}>
          <a
            href={`${MAILTO}?subject=${encodeURIComponent(offer.subject)}`}
            aria-labelledby={`offer-${offer.id} offer-${offer.id}-action`}
            aria-describedby={`offer-${offer.id}-pitch`}
            {...stylex.attrs(cardMarker, rollMarker, glass.edge, glass.card, landing.offer)}
          >
            <HoloSticker icon={offer.icon} tilt={offer.tilt} style={landing.sticker} />
            <p {...stylex.attrs(landing.tag, landing.offerTag, type.small)}>{offer.kicker}</p>
            <h3 id={`offer-${offer.id}`} {...stylex.attrs(type.h3)}>{offer.title}</h3>
            <p id={`offer-${offer.id}-pitch`} {...stylex.attrs(type.body, type.secondary)}>{offer.pitch}</p>
            <ul {...stylex.attrs(site.plainList, landing.points)}>
              {#each offer.points as point (point.text)}
                <li {...stylex.attrs(landing.point, type.body, type.secondary)}>
                  <Icon name="pixelCopied" style={landing.check} />
                  <span>{#if point.term}<span {...stylex.attrs(landing.term)}>{point.term}:</span>{" "}{/if}{point.text}</span>
                </li>
              {/each}
            </ul>
            <span id={`offer-${offer.id}-action`} {...stylex.attrs(landing.offerAction, type.body)}>
              <Icon name="arrow" style={glass.icon} />
              <Roll hover={EMAIL}>Contact me</Roll>
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
</main>
