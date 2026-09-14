<script lang="ts">
  import * as stylex from '@stylexjs/stylex';
  import { resolve } from '$app/paths';
  import { styles } from '$lib/styles';

  const year = new Date().getFullYear();
</script>

<svelte:head>
  <title>Max Knerrich · Software engineer</title>
  <meta
    name="description"
    content="I build systems and the interfaces that make them useful. Max Knerrich, freelance software engineer with a strong UX background. Based in Sydney, available worldwide. Ex-Porsche."
  />
  <link rel="canonical" href="https://knerrich.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Max Knerrich · Software engineer" />
  <meta
    property="og:description"
    content="I build systems and the interfaces that make them useful. Based in Sydney, available worldwide."
  />
  <meta property="og:url" content="https://knerrich.com/" />
  <meta property="og:image" content="https://knerrich.com/og.jpg" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="600" />
  <meta property="og:image:alt" content="Max Knerrich. Developer & Designer. Building Systems & Interfaces." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@maxknerrich" />
  <meta name="twitter:image" content="https://knerrich.com/og.jpg" />
  <meta name="twitter:image:alt" content="Max Knerrich. Developer & Designer. Building Systems & Interfaces." />
  <link rel="preload" href="/fonts/instrument-serif-latin-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{#snippet arrow(accented: boolean = true)}
  <svg {...stylex.attrs(styles.linkIcon, accented && styles.arrow)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
{/snippet}

<a {...stylex.attrs(styles.skip)} href="#main">Skip to content</a>

<div {...stylex.attrs(styles.page)}>
  <header {...stylex.attrs(styles.masthead, styles.reveal)}>
    <a {...stylex.attrs(styles.logoLink)} href={resolve('/')} aria-label="Max Knerrich, home">
      <svg {...stylex.attrs(styles.mark)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M2 18V6H5.54912L7.83397 15.9086H8.07768L10.4082 6H13.9573V18H11.901V7.76571L12.5864 8.53714H10.9871L11.8401 7.8L9.43336 18H6.46306L4.11729 7.78286L4.9703 8.53714H3.35567L4.04113 7.76571V18H2Z" />
        <path d="M11.901 18V6H13.9421V12.2743L18.8164 6H21.5887L16.7296 12.0171L17.0343 10.8343L22 18H19.4105L15.7852 12.5314L16.2574 12.6171L13.9421 15.4629V18H11.901Z" />
      </svg>
    </a>
    <fieldset aria-label="Color theme" {...stylex.attrs(styles.themeSwitch)}>
      <label data-theme-option {...stylex.attrs(styles.themeOption)}>
        <input id="theme-light" type="radio" name="theme" value="light" aria-label="Light theme" {...stylex.attrs(styles.themeInput)} />
        <svg {...stylex.attrs(styles.themeIcon)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
        <input id="theme-dark" type="radio" name="theme" value="dark" aria-label="Dark theme" {...stylex.attrs(styles.themeInput)} />
        <svg {...stylex.attrs(styles.themeIcon)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <span data-theme-name aria-hidden="true">Dark</span>
      </label>
      <label data-theme-option {...stylex.attrs(styles.themeOption)}>
        <input id="theme-auto" type="radio" name="theme" value="auto" aria-label="Automatic device theme" checked {...stylex.attrs(styles.themeInput)} />
        <svg {...stylex.attrs(styles.themeIcon)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span data-theme-name aria-hidden="true">Auto</span>
      </label>
    </fieldset>
  </header>

  <main id="main" tabindex="-1" {...stylex.attrs(styles.main)}>
    <section aria-labelledby="intro" {...stylex.attrs(styles.intro)}>
      <hgroup {...stylex.attrs(styles.heroHeading, styles.reveal)} style:--reveal-delay="120ms">
        <p {...stylex.attrs(styles.greeting)}>Hey, I'm Max Knerrich.</p>
        <h1 id="intro" {...stylex.attrs(styles.headline)}>
          I build <em {...stylex.attrs(styles.emphasis)}>systems</em> and the
          <em {...stylex.attrs(styles.emphasis)}>interfaces</em> that make them useful.
        </h1>
      </hgroup>
      <p {...stylex.attrs(styles.bio, styles.reveal)} style:--reveal-delay="240ms">
        A freelance software engineer with a strong UX background, currently based in Sydney,
        but available worldwide.
      </p>
      <a {...stylex.attrs(styles.contactButton, styles.introAction, styles.reveal)} style:--reveal-delay="360ms" href="mailto:max@knerrich.com">
        Let's work together {@render arrow(false)}
      </a>
    </section>

    <section aria-label="Selected clients" {...stylex.attrs(styles.section, styles.trustedSection, styles.reveal)} style:--reveal-delay="420ms">
      <ul {...stylex.attrs(styles.trusted)}>
        <li>
          <a {...stylex.attrs(styles.trustedLink)} href="https://tldraw.dev/">
            <img src="/logos/tldraw.svg" alt="tldraw" width="70" height="18" {...stylex.attrs(styles.trustedLogo, styles.tldrawLogo)} />
          </a>
        </li>
        <li>
          <a {...stylex.attrs(styles.trustedLink)} href="https://lw.works/">
            <img src="/logos/lw-works.svg" alt="lw.works" width="43" height="24" {...stylex.attrs(styles.trustedLogo, styles.lwLogo)} />
          </a>
        </li>
        <li>
          <a {...stylex.attrs(styles.trustedLink)} href="https://www.porsche.com/">
            <img src="/logos/porsche.svg" alt="Porsche" width="448" height="30" {...stylex.attrs(styles.trustedLogo, styles.porscheLogo)} />
          </a>
        </li>
      </ul>
    </section>

    <section aria-label="About Max" {...stylex.attrs(styles.section, styles.about, styles.reveal)} style:--reveal-delay="480ms">
      <p>
        At Porsche, I built prototyping design systems and worked on the Macan's infotainment
        experience. My interest in <strong {...stylex.attrs(styles.proseEmphasis)}>local-first software</strong> shaped my computer science thesis on
        bidirectional sync with REST APIs.
      </p>
      <p>
        Today, I work worldwide on software, interfaces, and prototypes. I'm also interested in
        <strong {...stylex.attrs(styles.proseEmphasis)}>open source</strong> and experiment with infrastructure in my <strong {...stylex.attrs(styles.proseEmphasis)}>homelab</strong>. Outside work, I play and
        coach American football.
      </p>
    </section>

    <section aria-labelledby="projects" {...stylex.attrs(styles.section)}>
      <h2 id="projects" {...stylex.attrs(styles.sectionTitle, styles.reveal)} style:--reveal-delay="540ms">Projects</h2>
      <div {...stylex.attrs(styles.projects)}>
        <article {...stylex.attrs(styles.project, styles.reveal)} style:--reveal-delay="580ms">
          <div {...stylex.attrs(styles.projectHeading)}>
            <h3 {...stylex.attrs(styles.projectTitle)}>
              <a href="https://tldraw.dev/" {...stylex.attrs(styles.contactLink)}>tldraw.dev {@render arrow()}</a>
            </h3>
          </div>
          <p {...stylex.attrs(styles.description)}>
            Redesigned the website and created social media and slide templates to give the
            team a consistent visual language across the web, posts, and presentations.
          </p>
        </article>

        <article {...stylex.attrs(styles.project, styles.reveal)} style:--reveal-delay="620ms">
          <div {...stylex.attrs(styles.projectHeading)}>
            <h3 {...stylex.attrs(styles.projectTitle)}>Local-first API sync</h3>
            <span {...stylex.attrs(styles.note)}>Bachelor thesis, 2025</span>
          </div>
          <p {...stylex.attrs(styles.description)}>
            A two-way synchronization layer connecting local-first apps to existing REST APIs.
            Built and evaluated with a GitHub issue tracker, exploring offline edits, conflict
            resolution, and the trade-offs between responsiveness and data freshness.
          </p>
        </article>

        <article {...stylex.attrs(styles.project, styles.reveal)} style:--reveal-delay="660ms">
          <h3 {...stylex.attrs(styles.projectTitle)}>Annex Tracker</h3>
          <p {...stylex.attrs(styles.description)}>
            Making M&amp;A annex lists easier to manage. Led the UX design, from research and early
            prototypes to a design system and clear, client-ready exports.
          </p>
        </article>

        <article {...stylex.attrs(styles.project, styles.reveal)} style:--reveal-delay="700ms">
          <h3 {...stylex.attrs(styles.projectTitle)}>FC Schömberg Luchse</h3>
          <p {...stylex.attrs(styles.description)}>
            A visual identity for a football club in the Black Forest. Designed the crest,
            jerseys, and club merchandise around the team's lynx namesake.
          </p>
        </article>
      </div>
    </section>

    <section aria-labelledby="experience" {...stylex.attrs(styles.section, styles.reveal)} style:--reveal-delay="740ms">
      <h2 id="experience" {...stylex.attrs(styles.sectionTitle)}>Experience</h2>
      <dl {...stylex.attrs(styles.experience)}>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>Dec 2025–present</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>Design Engineer</p>
            <p {...stylex.attrs(styles.experienceDetail)}>Freelance · Sydney, remote worldwide</p>
            <p {...stylex.attrs(styles.experienceDescription)}>
              Working with agencies and product teams across software development, UX, and interface design.
            </p>
          </dd>
        </div>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>Sep–Dec 2025</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>Senior Software &amp; UX Engineer</p>
            <p {...stylex.attrs(styles.experienceDetail)}>lukaswiesehan.de</p>
            <p {...stylex.attrs(styles.experienceDescription)}>Full-time · Germany, remote</p>
          </dd>
        </div>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>Feb 2024–Mar 2025</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>UX Design, Driver Experience</p>
            <p {...stylex.attrs(styles.experienceDetail)}>Porsche · Working student · Weissach</p>
            <p {...stylex.attrs(styles.experienceDescription)}>
              Contributed to the Macan and Cayenne infotainment redesign, with responsibility for
              maps, media, and shared interface elements including notifications.
            </p>
          </dd>
        </div>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>Aug 2023–Feb 2024</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>UX Design, Driver Experience</p>
            <p {...stylex.attrs(styles.experienceDetail)}>Porsche · Internship · Weissach</p>
            <p {...stylex.attrs(styles.experienceDescription)}>
              Contributed to UX concept development for in-car interfaces in the Driver Experience team.
            </p>
          </dd>
        </div>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>Oct 2022–Aug 2023</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>User Experience Designer</p>
            <p {...stylex.attrs(styles.experienceDetail)}>LITERACY GmbH · Working student · Stuttgart</p>
            <p {...stylex.attrs(styles.experienceDescription)}>
              Led UX design for Annex Tracker, a legaltech product for M&amp;A annex-list workflows.
              Created rapid prototypes to evaluate product directions and user flows.
            </p>
          </dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="education" {...stylex.attrs(styles.section, styles.reveal)} style:--reveal-delay="800ms">
      <h2 id="education" {...stylex.attrs(styles.sectionTitle)}>Education</h2>
      <dl {...stylex.attrs(styles.experience)}>
        <div {...stylex.attrs(styles.experienceRow)}>
          <dt {...stylex.attrs(styles.experienceLabel)}>2021–2025</dt>
          <dd>
            <p {...stylex.attrs(styles.role)}>B.Sc. Computer Science and Media</p>
            <p {...stylex.attrs(styles.experienceDetail)}>Hochschule der Medien, Stuttgart</p>
            <p {...stylex.attrs(styles.experienceDescription)}>
              Bachelor thesis on synchronizing external APIs with local-first applications.
            </p>
          </dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="connect" {...stylex.attrs(styles.section, styles.contactSection, styles.reveal)} style:--reveal-delay="860ms">
      <h2 id="connect" {...stylex.attrs(styles.connectText)}>
        Have something <em {...stylex.attrs(styles.emphasis)}>in mind?</em>
      </h2>
      <nav aria-label="Contact" {...stylex.attrs(styles.links)}>
        <a href="mailto:max@knerrich.com" {...stylex.attrs(styles.contactLink)}>
          max@knerrich.com {@render arrow()}
        </a>
        <a href="https://www.linkedin.com/in/maxknerrich/" {...stylex.attrs(styles.contactLink)}>
          LinkedIn {@render arrow()}
        </a>
        <a href="https://github.com/maxknerrich" {...stylex.attrs(styles.contactLink)}>
          GitHub {@render arrow()}
        </a>
        <a href="https://x.com/maxknerrich" {...stylex.attrs(styles.contactLink)}>
          X {@render arrow()}
        </a>
      </nav>
    </section>
  </main>

  <footer {...stylex.attrs(styles.section, styles.footer)}>
    <span>© {year} Max Knerrich</span>
    <span {...stylex.attrs(styles.footerLocation)}>Sydney, Australia</span>
  </footer>
</div>
