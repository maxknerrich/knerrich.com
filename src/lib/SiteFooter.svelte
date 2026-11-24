<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { color, layout, media, motion, radius, rollMarker, space, surface } from "#lib/styles/tokens.stylex.ts";

  const iconBox = "2.75rem";
  const glyph = space["--space-20"];

  const footer = stylex.create({
    root: {
      position: "sticky",
      insetBlockEnd: 0,
      zIndex: -1,
      paddingInline: layout["--page-margin"],
      paddingBlockStart: { default: space["--space-96"], [media.phone]: space["--space-64"] },
      paddingBlockEnd: layout["--nav-clearance"],
      backgroundColor: color["--night"],
      backgroundImage: surface.graphPaper,
      backgroundSize: surface.graphPaperSize,
    },
    top: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "start",
      gap: space["--space-48"],
    },
    sign: {
      display: "grid",
      justifyItems: "start",
      gap: space["--space-8"],
    },
    wordmark: {
      display: "block",
      inlineSize: "auto",
      blockSize: "1.5rem",
      marginBlockEnd: space["--space-16"],
    },
    nav: {
      display: "grid",
      justifyItems: { default: "end", [media.phone]: "start" },
      gap: space["--space-24"],
    },
    pages: {
      display: "flex",
      gap: space["--space-32"],
    },
    icons: {
      display: "flex",
      marginInline: `calc((${glyph} - ${iconBox}) / 2)`,
    },
    link: {
      color: { default: color["--text-secondary"], ":hover": color["--text"] },
      textDecoration: "none",
      transitionProperty: { default: "none", [media.motion]: "color" },
      transitionDuration: motion["--duration-base"],
    },
    icon: {
      display: "grid",
      placeItems: "center",
      inlineSize: iconBox,
      blockSize: iconBox,
      borderRadius: radius["--radius-md"],
    },
    glyph: {
      inlineSize: glyph,
      blockSize: glyph,
    },
  });
</script>

<script lang="ts">
  import Icon from "#lib/icons/Icon.svelte";
  import { resolve } from "$app/paths";
  import { SOCIAL } from "#lib/contact.ts";
  import { newTab } from "#lib/links.ts";
  import Roll from "#lib/Roll.svelte";
  import { presetKey, soundSetting, warm } from "#lib/sound.svelte.ts";
  import { glass, site, type } from "#lib/styles/shared.ts";

  const year = new Date().getFullYear();
  const pages = [
    { label: "Work", href: resolve("/") },
    { label: "Writing", href: resolve("/writing") },
  ];
  const FEED = { label: "RSS feed", href: "/rss.xml", icon: "rss" } as const;

  function toggleSound() {
    soundSetting.toggle();
    if (soundSetting.quiet) return;
    warm();
    presetKey();
  }
</script>

<footer {...stylex.attrs(footer.root)}>
  <div {...stylex.attrs(site.content, footer.top)}>
    <div {...stylex.attrs(footer.sign)}>
      <Icon name="knerrich" style={footer.wordmark} />
      <p {...stylex.attrs(type.small, type.muted)}>© {year} Max Knerrich</p>
      <a href="#main" {...stylex.attrs(footer.link, type.small, glass.focus, rollMarker)}><Roll>Back to top ↑</Roll></a>
    </div>

    <nav aria-label="Footer" {...stylex.attrs(footer.nav)}>
      <ul {...stylex.attrs(site.plainList, footer.pages)}>
        {#each pages as { label, href } (href)}
          <li><a {href} {...stylex.attrs(footer.link, type.body, glass.focus, rollMarker)}><Roll>{label}</Roll></a></li>
        {/each}
      </ul>
      <ul {...stylex.attrs(site.plainList, footer.icons)}>
        {#each [...SOCIAL, FEED] as { label, href, icon } (href)}
          <li>
            <a {href} {...newTab(href)} aria-label={label} title={label} {...stylex.attrs(footer.link, footer.icon, glass.focus)}>
              <Icon name={icon} style={footer.glyph} />
            </a>
          </li>
        {/each}
        <li>
          <button
            type="button"
            aria-label="Sound"
            aria-pressed={!soundSetting.quiet}
            title={soundSetting.quiet ? "Sound off" : "Sound on"}
            onclick={toggleSound}
            {...stylex.attrs(footer.link, footer.icon, glass.focus)}
          >
            <Icon name={soundSetting.quiet ? "soundOff" : "soundOn"} style={footer.glyph} />
          </button>
        </li>
      </ul>
    </nav>
  </div>
</footer>
