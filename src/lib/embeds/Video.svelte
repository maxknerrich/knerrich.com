<script lang="ts" module>
  import * as stylex from "@stylexjs/stylex";
  import { prefersReducedMotion } from "svelte/motion";
  import { color, radius, space } from "#lib/styles/tokens.stylex.ts";

  const video = stylex.create({
    frame: {
      position: "relative",
      overflow: "hidden",
      borderRadius: radius["--radius-card"],
      backgroundColor: color["--night"],
    },
    media: {
      display: "block",
      inlineSize: "100%",
      blockSize: "auto",
    },
    toggle: {
      position: "absolute",
      insetBlockEnd: space["--space-12"],
      insetInlineEnd: space["--space-12"],
      cursor: "pointer",
    },
  });

  class Loop {
    enhanced = $state(false);
    playing = $state(false);
    #held = false;
    #node: HTMLVideoElement | undefined;

    attach = (node: HTMLVideoElement) => {
      this.#node = node;
      this.enhanced = true;
      const sync = () => (this.playing = !node.paused);
      node.addEventListener("play", sync);
      node.addEventListener("pause", sync);
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) node.pause();
          else if (!this.#held && !prefersReducedMotion.current) void node.play().catch(() => {});
        },
        { threshold: 0.5 },
      );
      observer.observe(node);
      return () => {
        observer.disconnect();
        node.removeEventListener("play", sync);
        node.removeEventListener("pause", sync);
      };
    };

    toggle() {
      const node = this.#node;
      if (!node) return;
      this.#held = !node.paused;
      if (node.paused) void node.play().catch(() => {});
      else node.pause();
    }
  }
</script>

<script lang="ts">
  import Icon from "#lib/icons/Icon.svelte";
  import { glass } from "#lib/styles/shared.ts";
  import { mediaBlock } from "#lib/styles/media-blocks.ts";
  import type { EmbedProps } from "./props";

  let { src, poster, alt, caption, width, height }: EmbedProps<"video"> & { width?: number; height?: number } =
    $props();

  const loop = new Loop();
</script>

<figure>
  <div {...stylex.attrs(video.frame)}>
    <video
      {@attach loop.attach}
      {...stylex.attrs(video.media)}
      {src}
      {poster}
      {width}
      {height}
      aria-label={alt}
      controls={!loop.enhanced}
      muted
      loop
      playsinline
      preload="metadata"
    ></video>
    {#if loop.enhanced}
      <button
        type="button"
        {...stylex.attrs(mediaBlock.roundControl, glass.focus, video.toggle)}
        aria-label={loop.playing ? "Pause video" : "Play video"}
        onclick={() => loop.toggle()}
      >
        <Icon name={loop.playing ? "pixelPause" : "pixelPlay"} style={mediaBlock.icon} />
      </button>
    {/if}
  </div>
  {#if caption}
    <figcaption {...stylex.attrs(mediaBlock.caption)}>{caption}</figcaption>
  {/if}
</figure>
