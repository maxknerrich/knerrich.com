<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { Attachment } from "svelte/attachments";
  import Icon from "#lib/icons/Icon.svelte";
  import { rail } from "#lib/ReadingRail.styles.ts";
  import { glass, reveal, site } from "#lib/styles/shared.ts";

  let { sections, minutes }: { sections: { id: string; label: string; depth: number }[]; minutes: number } = $props();

  let activeSection = $state<string>();
  let progress = $state(0);
  let barOpen = $state(false);

  const current = $derived(sections.find(({ id }) => id === activeSection) ?? sections[0]);
  const time = $derived(
    progress < 0.02
      ? `${minutes} min read`
      : progress >= 1
        ? "Finished"
        : `${Math.ceil(minutes * (1 - progress))} min left`,
  );

  function measure() {
    const readingLine = Math.max(144, window.innerHeight * 0.25);
    const tops = sections.map(({ id }) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top }));
    const page = document.documentElement;
    const atEnd = Math.ceil(window.scrollY + window.innerHeight) >= page.scrollHeight - 2;
    activeSection = atEnd
      ? sections.at(-1)?.id
      : (tops.find(({ top }) => top !== undefined && top >= -1 && top <= readingLine) ??
          tops.findLast(({ top }) => top !== undefined && top < -1) ??
          tops[0])?.id;

    const main = document.getElementById("main")?.getBoundingClientRect();
    const scrollable = main ? main.height - window.innerHeight : 0;
    progress = atEnd || !main ? 1 : scrollable > 0 ? Math.min(1, Math.max(0, -main.top / scrollable)) : 1;
  }

  let frame = 0;
  function schedule() {
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      measure();
    });
  }

  const track: Attachment = () => {
    measure();
    return () => cancelAnimationFrame(frame);
  };

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key === "Escape" && barOpen) barOpen = false;
  }
</script>

<svelte:window onscroll={schedule} onresize={schedule} onkeydown={closeOnEscape} />

{#snippet contents(inBar: boolean)}
  <ol {...stylex.attrs(site.plainList, !inBar && rail.railList)}>
    {#each sections as section (section.id)}
      {@const isCurrent = section.id === current?.id}
      {@const isSub = section.depth > 2}
      <li>
        <a
          {...stylex.attrs(rail.link, inBar && rail.barLink, isSub && rail.sub, isCurrent && rail.currentLink, glass.focus)}
          href={`#${section.id}`}
          aria-current={isCurrent ? "location" : undefined}
          title={section.label}
          onclick={() => (barOpen = false)}
        >
          {section.label}
        </a>
      </li>
    {/each}
  </ol>
{/snippet}

<nav {@attach track} {...stylex.attrs(rail.nav, stylex.defaultMarker(), rail.fade, reveal.delay("120ms"))} aria-label="Table of contents">
  <span {...stylex.attrs(rail.track)} aria-hidden="true">
    <span {...stylex.attrs(rail.fill, rail.progress(progress))}></span>
  </span>
  <div {...stylex.attrs(rail.body)}>
    <p {...stylex.attrs(rail.time)}>{time}</p>
    <div {...stylex.attrs(rail.fold, rail.closing)} aria-hidden="true">
      <p {...stylex.attrs(rail.folded, rail.current)}>{current?.label}</p>
    </div>
    <div {...stylex.attrs(rail.fold, rail.opening)}>
      <div {...stylex.attrs(rail.folded)}>
        {@render contents(false)}
      </div>
    </div>
  </div>
</nav>

<nav {...stylex.attrs(rail.bar)} aria-label="Table of contents">
  <details bind:open={barOpen}>
    <summary {...stylex.attrs(rail.summary, glass.focus)}>
      <span {...stylex.attrs(rail.summaryLabel)}>{current?.label}</span>
      <span {...stylex.attrs(rail.summaryTime)}>{time}</span>
      <Icon name="pixelExpand" style={[rail.chevron, barOpen && rail.chevronOpen]} />
    </summary>
    <div {...stylex.attrs(rail.panel)}>
      {@render contents(true)}
    </div>
  </details>
  <span {...stylex.attrs(rail.line, rail.lineProgress(progress))} aria-hidden="true"></span>
</nav>
