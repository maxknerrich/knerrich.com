<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import Icon from "#lib/icons/Icon.svelte";
  import { tick } from "svelte";
  import { onNavigate } from "$app/navigation";
  import { prefersReducedMotion } from "svelte/motion";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { EMAIL, MAILTO, SOCIAL } from "#lib/contact.ts";
  import { presetKey, warm, whoosh } from "#lib/sound.svelte.ts";
  import { newTab } from "#lib/links.ts";
  import Roll from "#lib/Roll.svelte";
  import { nav } from "#lib/BottomBar.styles.ts";
  import { glass } from "#lib/styles/shared.ts";
  import { rollMarker } from "#lib/styles/tokens.stylex.ts";

  const pages = [
    { routes: ["/", "/projects"], href: resolve("/"), label: "Work" },
    { routes: ["/writing"], href: resolve("/writing"), label: "Writing" },
  ];
  const sectionOf = (route: string | null | undefined) =>
    pages.find(({ routes }) => routes.some((id) => route === id || (id !== "/" && route?.startsWith(`${id}/`))))?.href;

  const lit = $derived(sectionOf(page.route.id));
  let releasing = $state<string>();
  onNavigate(({ from, to }) => {
    const before = sectionOf(from?.route.id);
    if (before === sectionOf(to?.route.id)) return;
    presetKey();
    releasing = before;
  });

  let contactOpen = $state(false);
  let card = $state<HTMLElement>();
  let button = $state<HTMLElement>();
  let origin = $state(0);
  let hoverOpened = false;
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;
  const LEAVE = 250;

  async function shootUp() {
    if (!card || !button || prefersReducedMotion.current) return;
    const from = button.getBoundingClientRect();
    origin = from.left + from.width / 2 - card.getBoundingClientRect().left;
    await tick();
    card.animate(
      [
        { opacity: 0, scale: "0.3 0.15" },
        { opacity: 1, offset: 0.4 },
        { opacity: 1, scale: "1" },
      ],
      { duration: 360, easing: "cubic-bezier(0.2, 1.3, 0.35, 1)" },
    );
    for (const [index, row] of [...card.querySelectorAll("dl > div")].entries())
      row.animate([{ opacity: 0, translate: "0 0.5rem" }, { opacity: 1, translate: "0 0" }], {
        duration: 240,
        delay: 80 + index * 35,
        easing: "ease-out",
        fill: "backwards",
      });
  }

  function hoverIn(event: PointerEvent) {
    warm();
    if (event.pointerType !== "mouse") return;
    clearTimeout(leaveTimer);
    if (contactOpen) return;
    card?.showPopover();
    hoverOpened = true;
  }

  function hoverOut(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !hoverOpened) return;
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => card?.hidePopover(), LEAVE);
  }
  let copied = $state(false);
  let copiedTimer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }
    copied = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied = false), 1600);
  }
</script>

{#snippet arrow()}
  <Icon name="arrow" style={glass.icon} />
{/snippet}

<nav aria-label="Main" {...stylex.attrs(nav.bar)}>
  <div {...stylex.attrs(nav.panel)}>
    <ul {...stylex.attrs(nav.list)}>
      {#each pages as { href, label } (href)}
        {@const current = href === lit}
        {@const released = href === releasing}
        <li>
          <a
            {href}
            aria-current={current ? "page" : undefined}
            onpointerenter={warm}
            onfocus={warm}
            ontransitionrun={() => released && (releasing = undefined)}
            {...stylex.attrs(glass.focus, glass.edge, nav.item, current && nav.current, released && nav.releasing, rollMarker)}
          >
            <Roll>{label}</Roll>
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <button
    type="button"
    popovertarget="contact-card"
    bind:this={button}
    onpointerenter={hoverIn}
    onpointerleave={hoverOut}
    onfocus={warm}
    onclick={(event) => hoverOpened && event.detail && event.preventDefault()}
    {...stylex.attrs(glass.button, glass.edge, glass.primary, nav.floating)}>
    Contact
  </button>
</nav>

<section
  id="contact-card"
  popover="auto"
  aria-label="Contact"
  bind:this={card}
  onpointerenter={hoverIn}
  onpointerleave={hoverOut}
  ontoggle={(event) => {
    contactOpen = event.newState === "open";
    whoosh(contactOpen);
    if (contactOpen) void shootUp();
    else hoverOpened = false;
  }}
  {...stylex.attrs(nav.panel, nav.contact, nav.contactOrigin(origin))}
>
  <dl {...stylex.attrs(nav.contactList)}>
    <div {...stylex.attrs(nav.contactRow)}>
      <dt {...stylex.attrs(nav.contactLabel)}>
        <Icon name="email" label="Email" style={nav.contactGlyph} />
      </dt>
      <dd {...stylex.attrs(nav.contactValue)}>
        <a href={MAILTO} {...stylex.attrs(nav.contactLink, glass.focus, rollMarker)}><Roll>{EMAIL}</Roll></a>
      </dd>
      <dd {...stylex.attrs(nav.contactAction)}>
        <button type="button" onclick={copy} {...stylex.attrs(nav.copy, glass.focus)}>
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </dd>
    </div>
    {#each SOCIAL as { label, handle, href, icon } (href)}
      <div {...stylex.attrs(nav.contactRow)}>
        <dt {...stylex.attrs(nav.contactLabel)}>
          <Icon name={icon} {label} style={nav.contactGlyph} />
        </dt>
        <dd {...stylex.attrs(nav.contactValue)}>
          <a {href} {...newTab(href)} {...stylex.attrs(nav.contactLink, nav.contactStretch, glass.focus, rollMarker)}><Roll>{handle}</Roll></a>
        </dd>
        <dd {...stylex.attrs(nav.contactAction)}>{@render arrow()}</dd>
      </div>
    {/each}
  </dl>
</section>
