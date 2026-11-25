<script lang="ts" module>
  import * as stylex from "@stylexjs/stylex";
  import { color, media, motion, paperMarker, radius, sheet, space } from "#lib/styles/tokens.stylex.ts";

  const paper = stylex.create({
    figure: {
      display: "grid",
      justifyItems: "center",
      gap: space["--space-48"],
      paddingBlock: space["--space-24"],
    },
    link: {
      position: "relative",
      display: "block",
      inlineSize: "min(80%, 17rem)",
      aspectRatio: "1 / 1.414",
      borderRadius: radius["--radius-xs"],
    },
    sheet: {
      position: "absolute",
      inset: 0,
      borderRadius: radius["--radius-xs"],
      backgroundColor: sheet["--sheet-paper"],
      boxShadow: sheet["--sheet-shadow"],
      transitionProperty: { default: "none", [media.motion]: "transform" },
      transitionDuration: motion["--duration-slow"],
      transitionTimingFunction: motion["--ease-out"],
    },
    third: {
      transform: {
        default: "rotate(-5deg) translate(-4%, 2%)",
        [stylex.when.ancestor(":hover", paperMarker)]: "rotate(-7deg) translate(-8%, 2%)",
        [stylex.when.ancestor(":focus-visible", paperMarker)]: "rotate(-7deg) translate(-8%, 2%)",
      },
    },
    second: {
      transform: {
        default: "rotate(3deg) translate(3%, 1%)",
        [stylex.when.ancestor(":hover", paperMarker)]: "rotate(5deg) translate(7%, 1%)",
        [stylex.when.ancestor(":focus-visible", paperMarker)]: "rotate(5deg) translate(7%, 1%)",
      },
    },
    front: {
      overflow: "clip",
      transform: {
        default: "none",
        [stylex.when.ancestor(":hover", paperMarker)]: "translateY(-3%)",
        [stylex.when.ancestor(":focus-visible", paperMarker)]: "translateY(-3%)",
      },
    },
    page: {
      display: "block",
      inlineSize: "100%",
      blockSize: "100%",
    },
    caption: {
      color: color["--text-secondary"],
    },
  });
</script>

<script lang="ts">
  import { glass, type } from "#lib/styles/shared.ts";
  import type { EmbedProps } from "./props";

  let { href, page, title, pages }: EmbedProps<"paper"> = $props();

  const about = $derived(["PDF", pages && `${pages} pages`].filter(Boolean).join(", "));
</script>

<figure {...stylex.attrs(paper.figure)}>
  <a {href} target="_blank" rel="noopener" aria-label="{title} ({about})" {...stylex.attrs(paper.link, glass.focus, paperMarker)}>
    <span {...stylex.attrs(paper.sheet, paper.third)}></span>
    <span {...stylex.attrs(paper.sheet, paper.second)}></span>
    <span {...stylex.attrs(paper.sheet, paper.front)}>
      <img src={page} alt="" {...stylex.attrs(paper.page)} />
    </span>
  </a>
  <figcaption {...stylex.attrs(type.caps, paper.caption)}>Read it · {about}</figcaption>
</figure>
