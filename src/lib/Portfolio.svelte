<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
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

<a {...stylex.attrs(styles.skip)} href="#main">Skip to content</a>

<div data-portfolio {...stylex.attrs(styles.page)}>
  <header {...stylex.attrs(styles.masthead, styles.reveal)}>
    <a
      {...stylex.attrs(styles.logoLink)}
      href="#main"
      aria-label="Max Knerrich, back to top"
    >
      <svg
        {...stylex.attrs(styles.mark)}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M2 18V6H5.54912L7.83397 15.9086H8.07768L10.4082 6H13.9573V18H11.901V7.76571L12.5864 8.53714H10.9871L11.8401 7.8L9.43336 18H6.46306L4.11729 7.78286L4.9703 8.53714H3.35567L4.04113 7.76571V18H2Z"
        />
        <path
          d="M11.901 18V6H13.9421V12.2743L18.8164 6H21.5887L16.7296 12.0171L17.0343 10.8343L22 18H19.4105L15.7852 12.5314L16.2574 12.6171L13.9421 15.4629V18H11.901Z"
        />
      </svg>
    </a>
    <fieldset aria-label="Color theme" {...stylex.attrs(styles.themeSwitch)}>
      <label data-theme-option {...stylex.attrs(styles.themeOption)}>
        <input
          id="theme-light"
          type="radio"
          name="theme"
          value="light"
          aria-label="Light theme"
          {...stylex.attrs(styles.themeInput)}
        />
        <svg
          {...stylex.attrs(styles.themeIcon)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <span data-theme-name aria-hidden="true">Light</span>
      </label>
      <label data-theme-option {...stylex.attrs(styles.themeOption)}>
        <input
          id="theme-dark"
          type="radio"
          name="theme"
          value="dark"
          aria-label="Dark theme"
          {...stylex.attrs(styles.themeInput)}
        />
        <svg
          {...stylex.attrs(styles.themeIcon)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <span data-theme-name aria-hidden="true">Dark</span>
      </label>
      <label data-theme-option {...stylex.attrs(styles.themeOption)}>
        <input
          id="theme-auto"
          type="radio"
          name="theme"
          value="auto"
          aria-label="Automatic device theme"
          checked
          {...stylex.attrs(styles.themeInput)}
        />
        <svg
          {...stylex.attrs(styles.themeIcon)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span data-theme-name aria-hidden="true">Auto</span>
      </label>
    </fieldset>
  </header>

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
        Projects
      </h2>
      <div {...stylex.attrs(styles.projects)}>
        <article
          {...stylex.attrs(
            styles.project,
            styles.featuredProject,
            styles.reveal,
          )}
          style:--reveal-delay="580ms"
        >
          <h3 class="featured-lead">
            One visual language.<br />On the web and beyond.
          </h3>
          <div class="featured-identity">
            <a href="https://tldraw.dev/" {...stylex.attrs(styles.contactLink)}
              >tldraw {@render arrow()}</a
            >
            <p {...stylex.attrs(styles.projectKind)}>
              Website & visual language
            </p>
          </div>
          <p {...stylex.attrs(styles.description)}>
            Redesigned the website and created social media and slide templates
            to give the team a consistent visual language across the web, posts,
            and presentations.
          </p>
        </article>

        <article
          {...stylex.attrs(styles.project, styles.syncProject, styles.reveal)}
          style:--reveal-delay="620ms"
        >
          <div>
            <h3 {...stylex.attrs(styles.projectTitle)}>Local-first API sync</h3>
            <span {...stylex.attrs(styles.projectKind)}
              >Bachelor thesis, 2025</span
            >
          </div>
          <p {...stylex.attrs(styles.description)}>
            A two-way synchronization layer connecting local-first apps to
            existing REST APIs. Built and evaluated with a GitHub issue tracker,
            exploring offline edits, conflict resolution, and the trade-offs
            between responsiveness and data freshness.
          </p>
          <SyncDiagram />
        </article>

        <article
          {...stylex.attrs(styles.project, styles.reveal)}
          style:--reveal-delay="660ms"
        >
          <div>
            <h3 {...stylex.attrs(styles.projectTitle)}>Annex Tracker</h3>
            <p {...stylex.attrs(styles.projectKind)}>Product & UX design</p>
          </div>
          <p {...stylex.attrs(styles.description)}>
            Making M&amp;A annex lists easier to manage. Led the UX design, from
            research and early prototypes to a design system and clear,
            client-ready exports.
          </p>
        </article>

        <article
          {...stylex.attrs(styles.project, styles.reveal)}
          style:--reveal-delay="700ms"
        >
          <div>
            <h3 {...stylex.attrs(styles.projectTitle)}>FC Schömberg Luchse</h3>
            <p {...stylex.attrs(styles.projectKind)}>Visual identity</p>
          </div>
          <p {...stylex.attrs(styles.description)}>
            A visual identity for a football club in the Black Forest. Designed
            the crest, jerseys, and club merchandise around the team's lynx
            namesake.
          </p>
        </article>
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
    [data-portfolio] {
      --site-header-height: 6rem;
    }

    section,
    details {
      scroll-margin-block-start: -1rem;
    }
    main {
      scroll-margin-block-start: 1rem;
    }

    header > a,
    header > fieldset {
      pointer-events: auto;
    }

    .featured-lead {
      font-family: var(--font-display);
      font-size: clamp(1.625rem, 5vw, 2.125rem);
      letter-spacing: -0.035em;
      line-height: 1.2;
      font-weight: 500;
      margin-block-end: 1.5rem;
    }

    .featured-identity {
      margin-block-end: 0.75rem;
    }
    .featured-identity a {
      font-size: 1rem;
      margin-block-end: 0.25rem;
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
      [data-portfolio] {
        --site-header-height: 4.75rem;
        --sticky-paper: color-mix(in srgb, var(--paper) 88%, transparent);
      }
      [data-theme-option] {
        min-block-size: 2.75rem;
        min-inline-size: 2.75rem;
      }
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
