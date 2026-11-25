<script lang="ts" module>
  import * as stylex from "@stylexjs/stylex";
  import { color, media, motion, radius, space, text, tileMarker } from "#lib/styles/tokens.stylex.ts";

  const cards = stylex.create({
    grid: {
      display: "grid",
      gridTemplateColumns: { default: "repeat(3, minmax(0, 1fr))", [media.phone]: "minmax(0, 1fr)" },
      gap: space["--space-12"],
      padding: 0,
      listStyle: "none",
    },
    tile: {
      display: "flex",
      flexDirection: "column",
      gap: space["--space-12"],
      minBlockSize: { default: "10rem", [media.phone]: "auto" },
      padding: space["--space-24"],
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: { default: color["--hairline"], ":hover": color["--text-dim"] },
      borderRadius: radius["--radius-card"],
      outline: "none",
      transitionProperty: { default: "none", [media.motion]: "border-color" },
      transitionDuration: motion["--duration-slow"],
    },
    wide: {
      gridColumnEnd: { default: "span 2", [media.phone]: "auto" },
    },
    icon: {
      inlineSize: "1.5rem",
      blockSize: "1.5rem",
    },
    mark: {
      display: "flex",
      marginBlockEnd: "auto",
      color: {
        default: color["--text-muted"],
        [stylex.when.ancestor(":hover", tileMarker)]: color["--glow"],
        [stylex.when.ancestor(":focus-visible", tileMarker)]: color["--glow"],
      },
      transitionProperty: { default: "none", [media.motion]: "color" },
      transitionDuration: motion["--duration-slow"],
    },
    title: {
      paddingBlockStart: space["--space-24"],
      fontSize: text["--type-body"],
      fontWeight: 500,
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
      color: color["--text"],
      textWrap: "balance",
    },
    text: {
      opacity: {
        default: 1,
        [media.hover]: {
          default: 0,
          [stylex.when.ancestor(":hover", tileMarker)]: 1,
          [stylex.when.ancestor(":focus-visible", tileMarker)]: 1,
        },
      },
      translate: {
        default: "0 0",
        [media.hover]: {
          default: `0 ${space["--space-4"]}`,
          [stylex.when.ancestor(":hover", tileMarker)]: "0 0",
          [stylex.when.ancestor(":focus-visible", tileMarker)]: "0 0",
        },
      },
      transitionProperty: { default: "none", [media.motion]: "opacity, translate" },
      transitionDuration: motion["--duration-slow"],
      transitionTimingFunction: motion["--ease-out"],
      fontSize: text["--type-small"],
      lineHeight: 1.45,
      color: color["--text-secondary"],
      textWrap: "pretty",
    },
  });
</script>

<script lang="ts">
  import Icon from "#lib/icons/Icon.svelte";
  import { isIconName } from "#lib/icons/glyphs.ts";
  import { glass } from "#lib/styles/shared.ts";
  import type { EmbedProps } from "./props";

  let { items }: EmbedProps<"cards"> = $props();
</script>

<ul {...stylex.attrs(cards.grid)}>
  {#each items as { title, text, icon, wide } (title)}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <li tabindex={text ? 0 : undefined} {...stylex.attrs(cards.tile, wide && cards.wide, glass.focus, tileMarker)}>
      {#if icon && isIconName(icon)}<span {...stylex.attrs(cards.mark)}><Icon name={icon} style={cards.icon} /></span>{/if}
      <p {...stylex.attrs(cards.title)}>{title}</p>
      {#if text}
        <p {...stylex.attrs(cards.text)}>{text}</p>
      {/if}
    </li>
  {/each}
</ul>
