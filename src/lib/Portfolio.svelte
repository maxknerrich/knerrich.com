<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import { styles } from "$lib/styles";
  import SectionOutline from "$lib/SectionOutline.svelte";
  import SyncDiagram from "$lib/SyncDiagram.svelte";

  const year = new Date().getFullYear();
</script>

{#snippet arrow(accented: boolean = true)}
  <svg
    {...stylex.attrs(styles.linkIcon, accented && styles.arrow)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
{/snippet}

<div data-portfolio {...stylex.attrs(styles.page)}>
  <SectionOutline />

  <main id="main" tabindex="-1" {...stylex.attrs(styles.main)}>
    <section aria-labelledby="intro" {...stylex.attrs(styles.intro)}>
      <hgroup
        {...stylex.attrs(styles.heroHeading, styles.reveal)}
        style:--reveal-delay="120ms"
      >
        <p {...stylex.attrs(styles.greeting)}>Hey, I'm Max Knerrich.</p>
        <h1 id="intro" {...stylex.attrs(styles.headline)}>
          I build <span {...stylex.attrs(styles.emphasis)}>systems</span> and
          the
          <span {...stylex.attrs(styles.emphasis)}>interfaces</span> that make them
          useful.
        </h1>
      </hgroup>
      <p
        {...stylex.attrs(styles.bio, styles.reveal)}
        style:--reveal-delay="240ms"
      >
        A freelance software engineer with a strong UX background, currently
        based in Sydney, but available worldwide.
      </p>
      <a
        {...stylex.attrs(
          styles.contactButton,
          styles.introAction,
          styles.reveal,
        )}
        style:--reveal-delay="360ms"
        href="mailto:max@knerrich.com"
      >
        Let's work together {@render arrow(false)}
      </a>
    </section>

    <section
      aria-label="Selected clients"
      {...stylex.attrs(styles.section, styles.trustedSection, styles.reveal)}
      style:--reveal-delay="420ms"
    >
      <ul {...stylex.attrs(styles.trusted)}>
        <li>
          <a {...stylex.attrs(styles.trustedLink)} href="https://tldraw.dev/">
            <img
              src="/logos/tldraw.svg"
              alt="tldraw"
              width="70"
              height="18"
              {...stylex.attrs(styles.trustedLogo, styles.tldrawLogo)}
            />
          </a>
        </li>
        <li>
          <a {...stylex.attrs(styles.trustedLink)} href="https://lw.works/">
            <img
              src="/logos/lw-works.svg"
              alt="lw.works"
              width="43"
              height="24"
              {...stylex.attrs(styles.trustedLogo, styles.lwLogo)}
            />
          </a>
        </li>
        <li>
          <a
            {...stylex.attrs(styles.trustedLink)}
            href="https://www.porsche.com/"
          >
            <img
              src="/logos/porsche.svg"
              alt="Porsche"
              width="448"
              height="30"
              {...stylex.attrs(styles.trustedLogo, styles.porscheLogo)}
            />
          </a>
        </li>
      </ul>
    </section>

    <section
      id="projects"
      aria-labelledby="projects-heading"
      {...stylex.attrs(styles.section, styles.reveal, styles.borderReveal)}
      style:--reveal-delay="540ms"
    >
      <h2
        id="projects-heading"
        data-section-heading
        {...stylex.attrs(styles.sectionTitle, styles.reveal)}
        style:--reveal-delay="540ms"
      >
        Selected work
      </h2>
      <div {...stylex.attrs(styles.projects)}>
        <a
          data-project-card
          id="project-tldraw"
          href={resolve('/projects/[slug]', { slug: 'tldraw' })}
          aria-labelledby="tldraw-title"
          {...stylex.attrs(styles.project, styles.featuredProject, styles.reveal)}
          style:--reveal-delay="580ms"
        >
          <img style:view-transition-name="project-image-tldraw" class="project-image illustration" src="/projects/tldraw/multiplayer.png" alt="" width="2706" height="1464" loading="lazy" decoding="async" />
          <p class="featured-lead">A new website.<br />A canvas in three dimensions.</p>
          <h3 id="tldraw-title" data-card-title {...stylex.attrs(styles.projectTitle)}>
            <span style:view-transition-name="project-title-tldraw">tldraw</span> {@render arrow()}
          </h3>
          <p {...stylex.attrs(styles.projectKind)}>Website & 3D illustration</p>
          <p {...stylex.attrs(styles.description)}>
            Redesigned tldraw.dev with lw.works and created 3D illustrations
            to explain the infinite canvas SDK's features.
          </p>
        </a>

        <a
          data-project-card
          id="project-local-first-api-sync"
          href={resolve('/projects/[slug]', { slug: 'local-first-api-sync' })}
          aria-labelledby="sync-title"
          {...stylex.attrs(styles.project, styles.syncProject, styles.reveal)}
          style:--reveal-delay="620ms"
        >
          <div>
            <h3 id="sync-title" data-card-title {...stylex.attrs(styles.projectTitle)}>
              <span style:view-transition-name="project-title-local-first-api-sync">Local-first API sync</span> {@render arrow()}
            </h3>
            <p {...stylex.attrs(styles.projectKind)}>Software engineering · Bachelor thesis, 2025</p>
            <p {...stylex.attrs(styles.description)}>
              A two-way synchronization layer connecting local-first apps to
              existing REST APIs. Built and evaluated with a GitHub issue tracker,
              exploring offline edits, conflict resolution, and data freshness.
            </p>
          </div>
          <SyncDiagram />
        </a>

        <a
          data-project-card
          id="project-annextracker"
          href={resolve('/projects/[slug]', { slug: 'annextracker' })}
          aria-labelledby="annex-title"
          {...stylex.attrs(styles.project, styles.reveal)}
          style:--reveal-delay="660ms"
        >
          <img style:view-transition-name="project-image-annextracker" class="project-image" src="/projects/annextracker/tracker.jpg" alt="" width="1920" height="1200" loading="lazy" decoding="async" />
          <h3 id="annex-title" data-card-title {...stylex.attrs(styles.projectTitle)}>
            <span style:view-transition-name="project-title-annextracker">Annex Tracker</span> {@render arrow()}
          </h3>
          <p {...stylex.attrs(styles.projectKind)}>Product & UX design</p>
          <p {...stylex.attrs(styles.description)}>
            Making M&amp;A annex lists easier to manage. Led the UX design, from
            research and early prototypes to a design system and client-ready exports.
          </p>
        </a>

        <a
          data-project-card
          id="project-fcsl"
          href={resolve('/projects/[slug]', { slug: 'fcsl' })}
          aria-labelledby="fcsl-title"
          {...stylex.attrs(styles.project, styles.reveal)}
          style:--reveal-delay="700ms"
        >
          <img style:view-transition-name="project-image-fcsl" class="project-image" src="/projects/fcsl/identity.jpg" alt="" width="1800" height="1350" loading="lazy" decoding="async" />
          <h3 id="fcsl-title" data-card-title {...stylex.attrs(styles.projectTitle)}>
            <span style:view-transition-name="project-title-fcsl">FC Schömberg Luchse</span> {@render arrow()}
          </h3>
          <p {...stylex.attrs(styles.projectKind)}>Visual identity · Voluntary work</p>
          <p {...stylex.attrs(styles.description)}>
            A visual identity for a football club in the Black Forest. Designed
            the crest, jerseys, and club merchandise around the team's lynx namesake.
          </p>
        </a>

        <a
          data-project-card
          id="project-porsche"
          href={resolve('/projects/[slug]', { slug: 'porsche' })}
          aria-labelledby="porsche-title"
          {...stylex.attrs(styles.project, styles.wideProject, styles.reveal)}
          style:--reveal-delay="720ms"
        >
          <img style:view-transition-name="project-image-porsche" class="project-image" src="/projects/porsche/cayenne.jpg" alt="" width="1935" height="1089" loading="lazy" decoding="async" />
          <h3 id="porsche-title" data-card-title {...stylex.attrs(styles.projectTitle)}>
            <span style:view-transition-name="project-title-porsche">Porsche Driver Experience</span> {@render arrow()}
          </h3>
          <p {...stylex.attrs(styles.projectKind)}>Infotainment UX</p>
          <p {...stylex.attrs(styles.description)}>
            Redesigned infotainment interfaces for the Macan and Cayenne as part
            of the Driver Experience team. Drive screens, navigation, shared
            system elements, charging, and widgets.
          </p>
        </a>
      </div>
    </section>

    <section
      id="about"
      aria-label="About Max"
      {...stylex.attrs(styles.section, styles.about, styles.reveal)}
      style:--reveal-delay="740ms"
    >
      <p>
        At Porsche, I built prototyping design systems and worked on the Macan's
        infotainment experience. My interest in <strong
          {...stylex.attrs(styles.proseEmphasis)}>local-first software</strong
        > shaped my computer science thesis on bidirectional sync with REST APIs.
      </p>
      <p>
        Today, I work worldwide on software, interfaces, and prototypes. I'm
        also interested in
        <strong {...stylex.attrs(styles.proseEmphasis)}>open source</strong>
        and experiment with infrastructure in my
        <strong {...stylex.attrs(styles.proseEmphasis)}>homelab</strong>.
        Outside work, I play and coach American football.
      </p>
    </section>

    <details
      id="experience"
      open
      aria-labelledby="experience-heading"
      {...stylex.attrs(styles.section, styles.reveal)}
      style:--reveal-delay="800ms"
    >
      <summary data-section-heading>
        <h2 id="experience-heading" class="accordion-title">Experience</h2>
        <span class="expand-icon" aria-hidden="true"></span>
      </summary>
      <dl {...stylex.attrs(styles.experience)}>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>Dec 2025–present</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>Design Engineer</p>
            <p {...stylex.attrs(styles.experienceDetail)}>
              Freelance · Sydney, remote worldwide
            </p>
            <p {...stylex.attrs(styles.experienceDescription)}>
              Working with agencies and product teams across software
              development, UX, and interface design.
            </p>
          </dd>
        </div>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>Sep–Dec 2025</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>
              Senior Software &amp; UX Engineer
            </p>
            <p {...stylex.attrs(styles.experienceDetail)}>lw.works</p>
            <p {...stylex.attrs(styles.experienceDescription)}>
              Full-time · Germany, remote
            </p>
          </dd>
        </div>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>Aug 2023–Mar 2025</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>UX Design, Driver Experience</p>
            <p {...stylex.attrs(styles.experienceDetail)}>
              Porsche · Internship, then working student · Weissach
            </p>
            <p {...stylex.attrs(styles.experienceDescription)}>
              Contributed to UX concept development and the Macan and Cayenne
              infotainment redesign, with responsibility for maps, media, and
              shared interface elements including notifications.
            </p>
          </dd>
        </div>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>Oct 2022–Aug 2023</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>User Experience Designer</p>
            <p {...stylex.attrs(styles.experienceDetail)}>
              LITERACY GmbH · Working student · Stuttgart
            </p>
            <p {...stylex.attrs(styles.experienceDescription)}>
              Led UX design for Annex Tracker, a legaltech product for M&amp;A
              annex-list workflows. Created rapid prototypes to evaluate product
              directions and user flows.
            </p>
          </dd>
        </div>
      </dl>
    </details>

    <details
      id="education"
      open
      aria-labelledby="education-heading"
      {...stylex.attrs(styles.section, styles.reveal)}
      style:--reveal-delay="860ms"
    >
      <summary data-section-heading>
        <h2 id="education-heading" class="accordion-title">Education</h2>
        <span class="expand-icon" aria-hidden="true"></span>
      </summary>
      <dl {...stylex.attrs(styles.experience)}>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>2021–2025</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>
              B.Sc. Computer Science and Media
            </p>
            <p {...stylex.attrs(styles.experienceDetail)}>
              Hochschule der Medien, Stuttgart
            </p>
            <p {...stylex.attrs(styles.experienceDescription)}>
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
      {...stylex.attrs(styles.section, styles.contactSection, styles.reveal)}
      style:--reveal-delay="920ms"
    >
      <h2 id="connect-heading" class="contact-title" data-section-heading>
        Have a project in mind?
      </h2>
      <p class="contact-invitation">Tell me what you're working on.</p>
      <a class="contact-email" href="mailto:max@knerrich.com"
        >max@knerrich.com</a
      >
      <nav aria-label="Contact" {...stylex.attrs(styles.links)}>
        <a
          href="https://www.linkedin.com/in/maxknerrich/"
          {...stylex.attrs(styles.contactLink)}>LinkedIn</a
        >
        <a
          href="https://github.com/maxknerrich"
          {...stylex.attrs(styles.contactLink)}>GitHub</a
        >
        <a
          href="https://x.com/maxknerrich"
          {...stylex.attrs(styles.contactLink)}>X</a
        >
      </nav>
    </section>
  </main>

  <footer {...stylex.attrs(styles.section, styles.footer)}>
    <span>© {year} Max Knerrich</span>
    <span {...stylex.attrs(styles.footerLocation)}>Sydney, Australia</span>
  </footer>
</div>

<style>
  @layer portfolio {
    section,
    details {
      scroll-margin-block-start: -1rem;
    }
    main {
      scroll-margin-block-start: 1rem;
    }

    .featured-lead {
      font-family: var(--font-display);
      font-size: clamp(1.625rem, 5vw, 2.125rem);
      letter-spacing: -0.035em;
      line-height: 1.2;
      font-weight: 500;
      margin-block-end: 1.5rem;
    }

    [data-project-card] {
      scroll-margin-block-start: calc(var(--site-header-height) + 2rem);
      outline: 1px solid transparent;
      outline-offset: 0;
    }
    [data-project-card]:hover {
      color: var(--ink);
      outline-color: var(--rule);
    }
    [data-project-card]:focus-visible {
      outline: 2px solid var(--accent-ink);
      outline-offset: 4px;
    }
    [data-project-card]:is(:hover, :focus-visible) [data-card-title] {
      color: var(--accent-ink);
    }
    [data-card-title] {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.75rem;
    }
    [data-card-title] span {
      view-transition-class: project-title;
    }
    .project-image {
      view-transition-class: project-image;
      display: block;
      inline-size: 100%;
      block-size: auto;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      border-radius: 0.375rem;
      margin-block-end: 1.5rem;
    }
    .illustration {
      aspect-ratio: 2706 / 1464;
      object-fit: contain;
      background: var(--image-paper);
    }
    @media (prefers-reduced-motion: no-preference) {
      [data-project-card] {
        transition: outline-color 180ms ease;
      }
      [data-card-title] {
        transition: color 180ms ease;
      }
    }

    summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      min-block-size: 2.75rem;
      padding-block: 0.375rem;
      list-style: none;
      cursor: pointer;
    }

    summary::-webkit-details-marker {
      display: none;
    }
    summary:hover {
      color: var(--accent-ink);
    }
    summary:focus-visible {
      outline: 2px solid var(--accent-ink);
      outline-offset: 5px;
      border-radius: 2px;
    }
    details[open] > summary {
      margin-block-end: 1.5rem;
    }
    .accordion-title {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 400;
      letter-spacing: 0.025em;
      color: var(--muted);
      line-height: 1.5;
    }
    .expand-icon {
      position: relative;
      inline-size: 1rem;
      block-size: 1rem;
      flex-shrink: 0;
    }
    .expand-icon::before,
    .expand-icon::after {
      content: "";
      position: absolute;
      inset-block-start: calc(50% - 1px);
      inline-size: 1rem;
      block-size: 2px;
      background: currentColor;
    }
    .expand-icon::after {
      transform: rotate(90deg);
    }
    details[open] .expand-icon::after {
      display: none;
    }

    .contact-title {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 500;
      letter-spacing: -0.035em;
      line-height: 1.2;
      margin-block-end: 1rem;
    }
    .contact-invitation {
      color: var(--muted);
      font-size: 0.9375rem;
    }
    .contact-email {
      display: inline-block;
      font-family: var(--font-display);
      font-size: clamp(1.625rem, 6.5vw, 2.75rem);
      letter-spacing: -0.04em;
      line-height: 1.3;
      color: var(--accent-ink);
      text-decoration: none;
      margin-block: 0.625rem 1.5rem;
    }
    .contact-email:hover {
      text-decoration: underline;
    }

    @media (max-width: 1080px) {
      section,
      main,
      details {
        scroll-margin-block-start: calc(
          var(--site-header-height) + 2.75rem - var(--section-space)
        );
      }
      main {
        scroll-margin-block-start: 10rem;
      }
    }

    @media (max-width: 600px) {
      section,
      main,
      details {
        scroll-margin-block-start: 6rem;
      }
      [data-section-heading] {
        position: sticky;
        inset-block-start: var(--site-header-height);
        z-index: 3;
        margin-inline: calc(-1 * var(--section-bleed));
        padding: 0.875rem var(--section-bleed);
        background: var(--sticky-paper);
        backdrop-filter: blur(12px);
      }
    }
  }
</style>
