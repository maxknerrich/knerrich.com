<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { articleLayout, outline, pageLayout } from "#lib/styles/outline.ts";
  import { reveal } from "#lib/styles/shared.ts";
  import { onMount } from "svelte";
  import { Tween, prefersReducedMotion } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  // Side navigation for a page's sections, highlighting the one being read.
  // Used for the homepage sections and as the table of contents on article pages
  // (writing and projects); `article` keeps it clear of their full-width images.
  let { sections, article = false }: { sections: { id: string; label: string }[]; article?: boolean } =
    $props();
  const layout = $derived(article ? articleLayout : pageLayout);

  let activeSection = $state<string>();
  const activeIndex = Tween.of(
    () => Math.max(0, sections.findIndex((section) => section.id === activeSection)),
    {
      duration: () => (prefersReducedMotion.current ? 0 : 360),
      easing: cubicOut,
    },
  );

  // Keep the last section above the reading line active, including between sections.
  function updateActiveSection() {
    const readingLine = Math.max(144, window.innerHeight * 0.25);
    let current: string | undefined = sections[0]?.id;
    for (const { id } of sections) {
      const element = document.getElementById(id);
      if (element && element.getBoundingClientRect().top <= readingLine)
        current = id;
    }

    // Short final sections may never reach the reading line.
    if (
      Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight - 2
    ) {
      current = sections.at(-1)?.id;
    }
    activeSection = current;
  }

  onMount(updateActiveSection);
  // Sections change when navigating from one piece of writing to another.
  $effect(() => {
    void sections;
    updateActiveSection();
  });
</script>

<svelte:window onscroll={updateActiveSection} onresize={updateActiveSection} />

<nav
  {...stylex.attrs(outline.nav, layout.nav, reveal.fade, reveal.delay("120ms"), outline.state(activeIndex.current, sections.length))}
  aria-label="On this page"
>
  <div {...stylex.attrs(outline.track, layout.track)}>
    <ul {...stylex.attrs(outline.list, layout.list)}>
      {#each sections as section (section.id)}
        <li>
          <a
            {...stylex.attrs(outline.link, layout.link, activeSection === section.id && outline.current)}
            href={`#${section.id}`}
            aria-current={activeSection === section.id ? "location" : undefined}
            title={section.label}
          >
            <span {...stylex.attrs(outline.label)}>{section.label}</span>
          </a>
        </li>
      {/each}
    </ul>
    <span {...stylex.attrs(outline.indicator, layout.indicator)} aria-hidden="true"></span>
  </div>
</nav>
