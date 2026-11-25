<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { step as stepSound, warm } from "#lib/sound.svelte.ts";
  import { color, font, reading } from "#lib/styles/tokens.stylex.ts";

  const stepped = stylex.create({
    captions: {
      display: "grid",
    },
    stacked: {
      gridRow: 1,
      gridColumn: 1,
    },
    away: {
      visibility: "hidden",
    },
    counter: {
      minInlineSize: "4.5rem",
      textAlign: "center",
      fontFamily: font["--font-pixel"],
      fontSize: reading["--type-caption"],
      letterSpacing: "0.08em",
      fontVariantNumeric: "tabular-nums",
      color: color["--text-secondary"],
    },
  });

  class Steps {
    index = $state(0);
    inView = $state(false);
    #chosen = $state<boolean>();
    readonly #count: () => number;
    readonly #autoplay: () => boolean;

    constructor(count: () => number, autoplay: () => boolean) {
      this.#count = count;
      this.#autoplay = autoplay;
    }

    get count() {
      return this.#count();
    }
    get playing() {
      return (this.#chosen ?? this.#autoplay()) && this.inView;
    }
    get atStart() {
      return this.index === 0;
    }
    get atEnd() {
      return this.index === this.count - 1;
    }

    play() {
      if (this.atEnd) this.index = 0;
      this.#chosen = true;
    }
    pause() {
      this.#chosen = false;
    }
    advance() {
      this.index = (this.index + 1) % this.count;
    }
    go(to: number) {
      this.#chosen = false;
      const next = Math.min(this.count - 1, Math.max(0, to));
      if (next !== this.index) {
        warm();
        stepSound(next > this.index);
      }
      this.index = next;
    }
  }
</script>

<script lang="ts">
  import Icon from "#lib/icons/Icon.svelte";
  import type { Snippet } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { on } from "svelte/events";
  import { prefersReducedMotion } from "svelte/motion";
  import { glass, screenReader, type } from "#lib/styles/shared.ts";
  import { stepper } from "#lib/styles/stepper.ts";

  let {
    id,
    steps,
    autoplay = false,
    children,
  }: {
    id: string;
    steps: readonly { title: string; detail?: string }[];
    autoplay?: boolean;
    children: Snippet<[number]>;
  } = $props();

  const INTERVAL = 2500;

  const stepping = new Steps(
    () => steps.length,
    () => autoplay && !prefersReducedMotion.current,
  );

  const pad = (n: number) => String(n).padStart(2, "0");

  const watch: Attachment<HTMLElement> = (card) => {
    const observer = new IntersectionObserver(([entry]) => (stepping.inView = entry?.isIntersecting ?? false), {
      threshold: 0.5,
    });
    observer.observe(card);
    return () => observer.disconnect();
  };

  const tick: Attachment = () => {
    if (!stepping.playing) return;
    const timer = setInterval(() => stepping.advance(), INTERVAL);
    return () => clearInterval(timer);
  };

  const followLinks: Attachment<HTMLElement> = (card) =>
    on(document, "click", (event) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLElement>("a[data-step]") : null;
      const [target, n] = link?.dataset.step?.split("/") ?? [];
      if (target !== id || !n) return;
      event.preventDefault();
      stepping.go(Number(n) - 1);
      const box = card.getBoundingClientRect();
      if (box.top < 0 || box.bottom > window.innerHeight)
        card.scrollIntoView({ behavior: prefersReducedMotion.current ? "instant" : "smooth", block: "nearest" });
    });

  const markLinks: Attachment = () => {
    const current = `${id}/${stepping.index + 1}`;
    for (const link of document.querySelectorAll<HTMLElement>(`a[data-step^="${id}/"]`)) {
      if (link.dataset.step === current) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    }
  };

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") stepping.go(stepping.index - 1);
    else if (event.key === "ArrowRight") stepping.go(stepping.index + 1);
    else return;
    event.preventDefault();
  }
</script>

<figure {id} {@attach watch} {@attach tick} {@attach followLinks} {@attach markLinks} {...stylex.attrs(stepper.figure)}>
  <div {...stylex.attrs(stepper.card)}>
  <div {...stylex.attrs(stepper.stage)}>
    {@render children(stepping.index)}
  </div>
  </div>
  <figcaption>
  <div {...stylex.attrs(stepped.captions)}>
    {#each steps as { title, detail }, i (i)}
      <div {...stylex.attrs(stepper.caption, stepped.stacked, i !== stepping.index && stepped.away)}>
        <p {...stylex.attrs(stepper.title)}>{title}</p>
        {#if detail}<code {...stylex.attrs(stepper.detail)}>{detail}</code>{/if}
      </div>
    {/each}
  </div>
  <!-- svelte-ignore a11y_interactive_supports_focus, a11y_no_noninteractive_element_interactions -->
  <div {...stylex.attrs(stepper.controls)} role="group" aria-label="Steps" {onkeydown}>
    <div {...stylex.attrs(stepper.pager)}>
    <button
      type="button"
      {...stylex.attrs(stepper.button, stepping.playing && stepper.playing, glass.focus)}
      aria-label={stepping.playing ? "Pause" : "Play steps"}
      onclick={() => (stepping.playing ? stepping.pause() : stepping.play())}
    >
      <Icon name={stepping.playing ? "pixelPause" : "pixelPlay"} style={stepper.icon} />
    </button>
    <button
      type="button"
      {...stylex.attrs(stepper.button, glass.focus)}
      aria-label="Start over"
      disabled={stepping.atStart}
      onclick={() => stepping.go(0)}
    >
      <Icon name="pixelReplay" style={stepper.icon} />
    </button>
    </div>
    <div {...stylex.attrs(stepper.pager)}>
      <button
        type="button"
        {...stylex.attrs(stepper.button, glass.focus)}
        aria-label="Previous step"
        disabled={stepping.atStart && !stepping.playing}
        onclick={() => stepping.go(stepping.atStart ? steps.length - 1 : stepping.index - 1)}
      >
        <Icon name="pixelPrevious" style={stepper.icon} />
      </button>
      <p {...stylex.attrs(stepped.counter)} aria-live={stepping.playing ? "off" : "polite"}>
        <span aria-hidden="true">{pad(stepping.index + 1)} / {pad(steps.length)}</span>
        <span {...stylex.attrs(screenReader.only)}>Step {stepping.index + 1} of {steps.length}: {steps[stepping.index]?.title}</span>
      </p>
      <button
        type="button"
        {...stylex.attrs(stepper.button, glass.focus)}
        aria-label="Next step"
        disabled={stepping.atEnd && !stepping.playing}
        onclick={() => stepping.go(stepping.atEnd ? 0 : stepping.index + 1)}
      >
        <Icon name="pixelNext" style={stepper.icon} />
      </button>
    </div>
  </div>
  </figcaption>
</figure>
