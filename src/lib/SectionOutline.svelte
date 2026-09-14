<script lang="ts">
  import { onMount } from "svelte";
  import { Tween, prefersReducedMotion } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  const sections = [
    { id: "main", label: "Intro" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "connect", label: "Contact" },
  ];
  let activeSection = $state(sections[0].id);
  const activeIndex = Tween.of(
    () => sections.findIndex((section) => section.id === activeSection),
    {
      duration: () => (prefersReducedMotion.current ? 0 : 360),
      easing: cubicOut,
    },
  );

  // Keep the last section above the reading line active, including between sections.
  function updateActiveSection() {
    const readingLine = Math.max(144, window.innerHeight * 0.25);
    let current = sections[0].id;
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
      current = sections[sections.length - 1].id;
    }
    activeSection = current;
  }

  onMount(updateActiveSection);
</script>

<svelte:window onscroll={updateActiveSection} onresize={updateActiveSection} />

<nav
  class="outline"
  aria-label="On this page"
  style:--active-index={activeIndex.current}
  style:--section-count={sections.length}
>
  <ul>
    {#each sections as section (section.id)}
      <li>
        <a
          href={`#${section.id}`}
          aria-current={activeSection === section.id ? "location" : undefined}
        >
          {section.label}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  @layer portfolio {
    .outline {
      --row-height: 2.25rem;
      --dot-size: 0.3125rem;
      position: fixed;
      z-index: 5;
      inset-inline-start: 2rem;
      inset-block-start: 50%;
      transform: translateY(-50%);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      line-height: 1.4;
    }

    ul {
      position: relative;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    /* One indicator moves between links rather than swapping individual dots. */
    ul::after {
      content: "";
      position: absolute;
      top: calc(
        (var(--row-height) - var(--dot-size)) / 2 + var(--active-index) *
          var(--row-height)
      );
      left: 0.25rem;
      inline-size: var(--dot-size);
      block-size: var(--dot-size);
      border-radius: 50%;
      background: var(--accent-ink);
      pointer-events: none;
    }

    a {
      display: flex;
      align-items: center;
      min-block-size: var(--row-height);
      gap: 0.75rem;
      padding-inline: 0.25rem;
      color: color-mix(in srgb, var(--muted) 94%, var(--paper));
      text-decoration: none;
    }

    a::before {
      content: "";
      inline-size: var(--dot-size);
      block-size: var(--dot-size);
      flex-shrink: 0;
      border-radius: 50%;
      background: transparent;
    }
    a:hover {
      color: var(--ink);
    }
    a[aria-current] {
      color: var(--ink);
      font-weight: 500;
    }
    @media (prefers-reduced-motion: no-preference) {
      .outline {
        animation: outline-enter 900ms ease 120ms backwards;
      }
    }

    @keyframes outline-enter {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @media (max-width: 1080px) {
      .outline {
        --row-height: 2.75rem;
        inset-inline: 0;
        inset-block-start: var(--site-header-height);
        transform: none;
        overflow-x: auto;
        background: var(--paper);
        border-block-end: 1px solid var(--rule);
        padding-inline: 1rem;
        scrollbar-width: thin;
      }
      ul {
        display: grid;
        grid-template-columns: repeat(
          var(--section-count),
          minmax(6.75rem, 1fr)
        );
        min-inline-size: calc(var(--section-count) * 6.75rem);
      }
      ul::after {
        top: calc((var(--row-height) - var(--dot-size)) / 2);
        left: calc(0.75rem + var(--active-index) * 100% / var(--section-count));
      }
      a {
        padding-inline: 0.75rem;
      }
    }

    @media (max-width: 600px) {
      .outline {
        display: none;
      }
    }
  }
</style>
