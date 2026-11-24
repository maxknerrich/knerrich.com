<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { media, motion, rollMarker } from "#lib/styles/tokens.stylex.ts";

  const roll = stylex.create({
    clip: {
      display: "inline-grid",
      overflow: "clip",
    },
    line: {
      gridRow: "1",
      gridColumn: "1",
      translate: {
        default: "0 0",
        [stylex.when.ancestor(":hover", rollMarker)]: "0 -100%",
        [stylex.when.ancestor(":focus-visible", rollMarker)]: "0 -100%",
      },
      transitionProperty: { default: "none", [media.motion]: "translate" },
      transitionDuration: motion["--duration-roll"],
      transitionTimingFunction: motion["--ease-out"],
    },
    next: {
      userSelect: "none",
      translate: {
        default: "0 100%",
        [stylex.when.ancestor(":hover", rollMarker)]: "0 0",
        [stylex.when.ancestor(":focus-visible", rollMarker)]: "0 0",
      },
    },
  });
</script>

<script lang="ts">
  import type { Snippet } from "svelte";

  let { children, hover }: { children: Snippet; hover?: string } = $props();
</script>

<span {...stylex.attrs(roll.clip)}
  ><span {...stylex.attrs(roll.line)}>{@render children()}</span><span
    aria-hidden="true"
    {...stylex.attrs(roll.line, roll.next)}>{#if hover}{hover}{:else}{@render children()}{/if}</span
  ></span
>
