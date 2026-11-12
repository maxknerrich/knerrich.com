<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import LwWorks from "#lib/logos/LwWorks.svelte";
  import Porsche from "#lib/logos/Porsche.svelte";
  import Tldraw from "#lib/logos/Tldraw.svelte";
  import type { WritingEntry } from "#lib/server/writing.ts";
  import { home } from "#lib/styles/home.ts";
  import { cardMarker, detailsMarker } from "#lib/styles/markers.stylex.ts";
  import { reveal } from "#lib/styles/shared.ts";
  import SectionOutline from "#lib/SectionOutline.svelte";
  import SyncDiagram from "#lib/SyncDiagram.svelte";
  import WritingList from "#lib/WritingList.svelte";

  /** The most recently tended writing, shown below the selected work. */
  let { recent }: { recent: WritingEntry[] } = $props();

  const sections = $derived([
    { id: "main", label: "Intro" },
    { id: "projects", label: "Selected work" },
    ...(recent.length ? [{ id: "writing", label: "Writing" }] : []),
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "connect", label: "Contact" },
  ]);

  const year = new Date().getFullYear();
</script>

{#snippet arrow(accented: boolean = true)}
  <svg
    {...stylex.attrs(home.linkIcon, accented && home.arrow)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
{/snippet}

<div {...stylex.attrs(home.page)}>
  <SectionOutline sections={sections} />

  <main id="main" tabindex="-1" {...stylex.attrs(home.main)}>
    <section aria-labelledby="intro" {...stylex.attrs(home.intro)}>
      <!-- No entrance here: the headline is the page's largest paint (LCP), so it shows at once. -->
      <hgroup
        {...stylex.attrs(home.heroHeading)}
      >
        <p {...stylex.attrs(home.greeting)}>Hey, I'm Max Knerrich.</p>
        <h1 id="intro" {...stylex.attrs(home.headline)}>
          I build <span {...stylex.attrs(home.emphasis)}>systems</span> and
          the
          <span {...stylex.attrs(home.emphasis)}>interfaces</span> that make them
          useful.
        </h1>
      </hgroup>
      <p
        {...stylex.attrs(home.bio, reveal.enter, reveal.delay("240ms"))}
      >
        A freelance software engineer with a strong UX background, currently
        based in Sydney, but available worldwide.
      </p>
      <a
        {...stylex.attrs(
          home.button,
          home.introAction,
          reveal.enter, reveal.delay("360ms"),
        )}
        href="mailto:max@knerrich.com"
      >
        Let's work together {@render arrow(false)}
      </a>
    </section>

    <section
      aria-label="Selected clients"
      {...stylex.attrs(home.section, home.trustedSection, reveal.enter, reveal.delay("420ms"))}
    >
      <ul {...stylex.attrs(home.trusted)}>
        <li>
          <a {...stylex.attrs(home.trustedLink)} href="https://tldraw.dev/">
            <Tldraw {...stylex.attrs(home.trustedLogo, home.tldrawLogo)} />
          </a>
        </li>
        <li>
          <a {...stylex.attrs(home.trustedLink)} href="https://lw.works/">
            <LwWorks {...stylex.attrs(home.trustedLogo, home.lwLogo)} />
          </a>
        </li>
        <li>
          <a
            {...stylex.attrs(home.trustedLink)}
            href="https://www.porsche.com/"
          >
            <Porsche {...stylex.attrs(home.trustedLogo, home.porscheLogo)} />
          </a>
        </li>
      </ul>
    </section>

    <section
      id="projects"
      aria-labelledby="projects-heading"
      {...stylex.attrs(home.section, reveal.enter, reveal.delay("540ms"), reveal.rule)}
    >
      <h2
        id="projects-heading"
        {...stylex.attrs(home.sectionTitle, home.stickyHeading, reveal.enter, reveal.delay("540ms"))}
      >
        Selected work
      </h2>
      <div {...stylex.attrs(home.projects)}>
        <a
          id="project-tldraw"
          href={resolve('/projects/[slug]', { slug: 'tldraw' })}
          {...stylex.attrs(cardMarker, home.project, home.featuredProject, reveal.enter, reveal.delay("580ms"))}
        >
          <enhanced:img {...stylex.attrs(home.projectImage, home.illustration)} src="#lib/assets/projects/tldraw/multiplayer.png" alt="" sizes="(max-width: 600px) 100vw, 46rem" loading="lazy" decoding="async" />
          <p {...stylex.attrs(home.featuredLead)}>A new website.<br />A canvas in three dimensions.</p>
          <h3 {...stylex.attrs(home.projectTitle)}>
            tldraw {@render arrow()}
          </h3>
          <p {...stylex.attrs(home.projectKind)}>Website & 3D illustration</p>
          <p {...stylex.attrs(home.description)}>
            Redesigned tldraw.dev with lw.works and created 3D illustrations
            to explain the infinite canvas SDK's features.
          </p>
        </a>

        <a
          id="project-local-first-api-sync"
          href={resolve('/projects/[slug]', { slug: 'local-first-api-sync' })}
          {...stylex.attrs(cardMarker, home.project, home.syncProject, reveal.enter, reveal.delay("620ms"))}
        >
          <div>
            <h3 {...stylex.attrs(home.projectTitle)}>
              Local-first API sync {@render arrow()}
            </h3>
            <p {...stylex.attrs(home.projectKind)}>Software engineering · Bachelor thesis, 2025</p>
            <p {...stylex.attrs(home.description)}>
              A two-way synchronization layer connecting local-first apps to
              existing REST APIs. Built and evaluated with a GitHub issue tracker,
              exploring offline edits, conflict resolution, and data freshness.
            </p>
          </div>
          <SyncDiagram />
        </a>

        <a
          id="project-annextracker"
          href={resolve('/projects/[slug]', { slug: 'annextracker' })}
          {...stylex.attrs(cardMarker, home.project, reveal.enter, reveal.delay("660ms"))}
        >
          <enhanced:img {...stylex.attrs(home.projectImage)} src="#lib/assets/projects/annextracker/tracker.jpg" alt="" sizes="(max-width: 600px) 100vw, 22rem" loading="lazy" decoding="async" />
          <h3 {...stylex.attrs(home.projectTitle)}>
            Annex Tracker {@render arrow()}
          </h3>
          <p {...stylex.attrs(home.projectKind)}>Product & UX design</p>
          <p {...stylex.attrs(home.description)}>
            Making M&A annex lists easier to manage. Led the UX design, from research and early prototypes to a design system and client-ready exports.
          </p>
        </a>

        <a
          id="project-fcsl"
          href={resolve('/projects/[slug]', { slug: 'fcsl' })}
          {...stylex.attrs(cardMarker, home.project, reveal.enter, reveal.delay("700ms"))}
        >
          <enhanced:img {...stylex.attrs(home.projectImage)} src="#lib/assets/projects/fcsl/identity.jpg" alt="" sizes="(max-width: 600px) 100vw, 22rem" loading="lazy" decoding="async" />
          <h3 {...stylex.attrs(home.projectTitle)}>
            FC Schömberg Luchse {@render arrow()}
          </h3>
          <p {...stylex.attrs(home.projectKind)}>Visual identity · Voluntary work</p>
          <p {...stylex.attrs(home.description)}>
            A visual identity for a football club in the Black Forest. Designed
            the crest, jerseys, and club merchandise around the team's lynx namesake.
          </p>
        </a>

        <a
          id="project-porsche"
          href={resolve('/projects/[slug]', { slug: 'porsche' })}
          {...stylex.attrs(cardMarker, home.project, home.wideProject, reveal.enter, reveal.delay("720ms"))}
        >
          <enhanced:img {...stylex.attrs(home.projectImage)} src="#lib/assets/projects/porsche/cayenne.jpg" alt="" sizes="(max-width: 600px) 100vw, 46rem" loading="lazy" decoding="async" />
          <h3 {...stylex.attrs(home.projectTitle)}>
            Porsche Driver Experience {@render arrow()}
          </h3>
          <p {...stylex.attrs(home.projectKind)}>Infotainment UX</p>
          <p {...stylex.attrs(home.description)}>
            Redesigned infotainment interfaces for the Macan and Cayenne as part
            of the Driver Experience team. Drive screens, navigation, shared
            system elements, charging, and widgets.
          </p>
        </a>
      </div>
    </section>

    {#if recent.length}
    <section
      id="writing"
      aria-labelledby="writing-heading"
      {...stylex.attrs(home.section, reveal.enter, reveal.delay("730ms"))}
    >
      <h2
        id="writing-heading"
        {...stylex.attrs(home.sectionTitle, home.stickyHeading)}
      >
        Recently tended writing
      </h2>
      <WritingList entries={recent} />

      <a
        {...stylex.attrs(home.allWriting)}
        href={resolve('writing')}
      >All writing {@render arrow()}</a>
    </section>
    {/if}

    <section
      id="about"
      aria-label="About Max"
      {...stylex.attrs(home.section, home.about, reveal.enter, reveal.delay("740ms"))}
    >
      <p>
        At Porsche, I built prototyping design systems and worked on the Macan's
        infotainment experience. My interest in <strong
          {...stylex.attrs(home.aboutEmphasis)}>local-first software</strong
        > shaped my computer science thesis on bidirectional sync with REST APIs.
      </p>
      <p>
        Today, I work worldwide on software, interfaces, and prototypes. I'm
        also interested in
        <strong {...stylex.attrs(home.aboutEmphasis)}>open source</strong>
        and experiment with infrastructure in my
        <strong {...stylex.attrs(home.aboutEmphasis)}>homelab</strong>.
        Outside work, I play and coach American football.
      </p>
    </section>

    <details
      id="experience"
      open
      aria-labelledby="experience-heading"
      {...stylex.attrs(detailsMarker, home.section, reveal.enter, reveal.delay("800ms"))}
    >
      <summary
        {...stylex.attrs(home.summary, home.stickyHeading)}
      >
        <h2
          id="experience-heading"
          {...stylex.attrs(home.accordionTitle)}
        >Experience</h2>

        <svg
          {...stylex.attrs(home.expandIcon)}
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M0 8h16"></path>
          <path {...stylex.attrs(home.expandIconBar)} d="M8 0v16"></path>
        </svg>
      </summary>
      <dl {...stylex.attrs(home.experience)}>
        <div {...stylex.attrs(home.experienceRow)}>
          <dt {...stylex.attrs(home.experienceLabel)}>Dec 2025–present</dt>
          <dd>
            <p {...stylex.attrs(home.role)}>Design Engineer</p>
            <p {...stylex.attrs(home.experienceDetail)}>
              Freelance · Sydney, remote worldwide
            </p>
            <p {...stylex.attrs(home.experienceDescription)}>
              Working with agencies and product teams across software
              development, UX, and interface design.
            </p>
          </dd>
        </div>
        <div {...stylex.attrs(home.experienceRow)}>
          <dt {...stylex.attrs(home.experienceLabel)}>Sep–Dec 2025</dt>
          <dd>
            <p {...stylex.attrs(home.role)}>Senior Software & UX Engineer</p>
            <p {...stylex.attrs(home.experienceDetail)}>lw.works</p>
            <p {...stylex.attrs(home.experienceDescription)}>
              Full-time · Germany, remote
            </p>
          </dd>
        </div>
        <div {...stylex.attrs(home.experienceRow)}>
          <dt {...stylex.attrs(home.experienceLabel)}>Aug 2023–Mar 2025</dt>
          <dd>
            <p {...stylex.attrs(home.role)}>UX Design, Driver Experience</p>
            <p {...stylex.attrs(home.experienceDetail)}>
              Porsche · Internship, then working student · Weissach
            </p>
            <p {...stylex.attrs(home.experienceDescription)}>
              Contributed to UX concept development and the Macan and Cayenne
              infotainment redesign, with responsibility for maps, media, and
              shared interface elements including notifications.
            </p>
          </dd>
        </div>
        <div {...stylex.attrs(home.experienceRow)}>
          <dt {...stylex.attrs(home.experienceLabel)}>Oct 2022–Aug 2023</dt>
          <dd>
            <p {...stylex.attrs(home.role)}>User Experience Designer</p>
            <p {...stylex.attrs(home.experienceDetail)}>
              LITERACY GmbH · Working student · Stuttgart
            </p>
            <p {...stylex.attrs(home.experienceDescription)}>
              Led UX design for Annex Tracker, a legaltech product for M&A annex-list workflows. Created rapid prototypes to evaluate product directions and user flows.
            </p>
          </dd>
        </div>
      </dl>
    </details>

    <details
      id="education"
      open
      aria-labelledby="education-heading"
      {...stylex.attrs(detailsMarker, home.section, reveal.enter, reveal.delay("860ms"))}
    >
      <summary
        {...stylex.attrs(home.summary, home.stickyHeading)}
      >
        <h2
          id="education-heading"
          {...stylex.attrs(home.accordionTitle)}
        >Education</h2>

        <svg
          {...stylex.attrs(home.expandIcon)}
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M0 8h16"></path>
          <path {...stylex.attrs(home.expandIconBar)} d="M8 0v16"></path>
        </svg>
      </summary>
      <dl {...stylex.attrs(home.experience)}>
        <div {...stylex.attrs(home.experienceRow)}>
          <dt {...stylex.attrs(home.experienceLabel)}>2021–2025</dt>
          <dd>
            <p {...stylex.attrs(home.role)}>
              B.Sc. Computer Science and Media
            </p>
            <p {...stylex.attrs(home.experienceDetail)}>
              Hochschule der Medien, Stuttgart
            </p>
            <p {...stylex.attrs(home.experienceDescription)}>
              Bachelor thesis on synchronizing external APIs with local-first
              applications.
            </p>
          </dd>
        </div>
      </dl>
    </details>

    <section
      id="connect"
      aria-labelledby="connect-heading"
      {...stylex.attrs(home.section, home.contactSection, reveal.enter, reveal.delay("920ms"))}
    >
      <h2 id="connect-heading" {...stylex.attrs(home.contactTitle, home.stickyHeading)}>
        Have a project in mind?
      </h2>
      <p {...stylex.attrs(home.contactInvitation)}>Tell me what you're working on.</p>
      <a {...stylex.attrs(home.contactEmail)} href="mailto:max@knerrich.com"
        >max@knerrich.com</a
      >
      <nav aria-label="Contact" {...stylex.attrs(home.links)}>
        <a
          href="https://www.linkedin.com/in/maxknerrich/"
          {...stylex.attrs(home.contactLink)}>LinkedIn</a
        >
        <a
          href="https://github.com/maxknerrich"
          {...stylex.attrs(home.contactLink)}>GitHub</a
        >
        <a
          href="https://x.com/maxknerrich"
          {...stylex.attrs(home.contactLink)}>X</a
        >
      </nav>
    </section>
  </main>

  <footer {...stylex.attrs(home.section, home.footer)}>
    <span>© {year} Max Knerrich</span>
    <span {...stylex.attrs(home.footerLocation)}>Sydney, Australia</span>
  </footer>
</div>

