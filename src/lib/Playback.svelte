<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { prefersReducedMotion } from "svelte/motion";
  import { step as stepSound, warm } from "#lib/sound.svelte.ts";

  const playback = stylex.create({
    centered: {
      justifyContent: "center",
    },
  });

  class Player {
    state = $state<"waiting" | "playing" | "paused" | "finished">("waiting");
    #stage: HTMLElement | undefined;

    #animations = () => this.#stage?.getAnimations({ subtree: true }) ?? [];

    #run() {
      for (const animation of this.#animations()) animation.play();
      this.state = "playing";
      void Promise.all(this.#animations().map((animation) => animation.finished)).then(
        () => {
          if (this.#animations().every((animation) => animation.playState === "finished")) this.state = "finished";
        },
        () => {},
      );
    }

    #hold(state: "waiting" | "paused") {
      for (const animation of this.#animations()) animation.pause();
      this.state = state;
    }

    #rewind() {
      for (const animation of this.#animations()) animation.currentTime = 0;
    }

    attach = (stage: HTMLElement) => {
      this.#stage = stage;
      requestAnimationFrame(() => this.#hold("waiting"));
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting && this.state === "waiting" && !prefersReducedMotion.current) this.#run();
          else if (!entry?.isIntersecting && this.state === "playing") this.#hold("waiting");
        },
        { threshold: 0.5 },
      );
      observer.observe(stage);
      return () => observer.disconnect();
    };

    toggle() {
      warm();
      stepSound(this.state !== "playing");
      if (this.state === "playing") return this.#hold("paused");
      if (this.state === "finished") this.#rewind();
      this.#run();
    }

    restart() {
      warm();
      stepSound(false);
      this.#rewind();
      this.#run();
    }
  }
</script>

<script lang="ts">
  import Icon from "#lib/icons/Icon.svelte";
  import type { Snippet } from "svelte";
  import { glass, type } from "#lib/styles/shared.ts";
  import { stepper } from "#lib/styles/stepper.ts";

  let {
    title,
    detail,
    children,
  }: { title: string; detail?: string; children: Snippet } = $props();

  const player = new Player();
  const playing = $derived(player.state === "playing");
</script>

<figure {...stylex.attrs(stepper.card)}>
  <div {@attach player.attach} {...stylex.attrs(stepper.stage)}>
    {@render children()}
  </div>
  <figcaption>
    <div {...stylex.attrs(stepper.caption)}>
      <p {...stylex.attrs(stepper.title, type.caps)}>{title}</p>
      {#if detail}<code {...stylex.attrs(stepper.detail)}>{detail}</code>{/if}
    </div>
    <div {...stylex.attrs(stepper.controls, playback.centered)}>
      <div {...stylex.attrs(stepper.pager)}>
      <button
        type="button"
        {...stylex.attrs(stepper.button, playing && stepper.playing, glass.focus)}
        aria-label={playing ? "Pause" : player.state === "finished" ? "Play again" : "Play"}
        onclick={() => player.toggle()}
      >
        <Icon name={playing ? "pixelPause" : "pixelPlay"} style={stepper.icon} />
      </button>
      <button
        type="button"
        {...stylex.attrs(stepper.button, glass.focus)}
        aria-label="Start over"
        onclick={() => player.restart()}
      >
        <Icon name="pixelReplay" style={stepper.icon} />
      </button>
      </div>
    </div>
  </figcaption>
</figure>
