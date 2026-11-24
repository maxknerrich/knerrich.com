<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { color, media, motion } from "#lib/styles/tokens.stylex.ts";

  const letterIn = stylex.keyframes({
    "0%": { color: color["--text-dim"] },
    "35%": { color: color["--glow"] },
    "100%": { color: color["--text-secondary"] },
  });

  const letterOut = stylex.keyframes({
    from: { color: color["--text-secondary"] },
    to: { color: color["--text-dim"] },
  });

  const typed = stylex.create({
    letter: {
      color: { default: null, [media.entrance]: color["--text-dim"] },
    },
    on: {
      color: color["--text-secondary"],
      animationName: { default: "none", [media.entrance]: letterIn },
      animationDuration: motion["--duration-letter"],
      animationTimingFunction: "ease-out",
      animationFillMode: "both",
    },
    off: {
      animationName: { default: "none", [media.entrance]: letterOut },
      animationDuration: motion["--duration-letter"],
      animationTimingFunction: "ease-out",
      animationFillMode: "both",
    },
  });
</script>

<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import { prefersReducedMotion } from "svelte/motion";
  import { chase, followScroll } from "#lib/scroll-follow.ts";
  import { type } from "#lib/styles/shared.ts";

  let { text, onLoad = false }: { text: string; onLoad?: boolean } = $props();

  const START = 0.9;
  const SPAN = 0.24;
  const LOAD_DELAY = 500;

  const letters = $derived([...text]);
  let progress = $state(0);
  const count = $derived(Math.round(progress * letters.length));
  let most = $state(0);
  const typeTo = (value: number) => {
    progress = value;
    most = Math.max(most, Math.round(value * letters.length));
  };

  const typeOnLoad: Attachment = () => {
    if (prefersReducedMotion.current) return;
    const typing = chase(typeTo);
    const timer = setTimeout(() => typing.aim(1), LOAD_DELAY);
    return () => {
      clearTimeout(timer);
      typing.stop();
    };
  };
  const typeOnScroll = followScroll((box) => (innerHeight * START - box.top) / (innerHeight * SPAN), typeTo);
</script>

<span {@attach onLoad ? typeOnLoad : typeOnScroll} {...stylex.attrs(type.secondary)}
  >{#each letters as letter, i (i)}{#if letter === " "}{" "}{:else}<span
        {...stylex.attrs(typed.letter, i < count ? typed.on : i < most && typed.off)}>{letter}</span
      >{/if}{/each}</span
>
