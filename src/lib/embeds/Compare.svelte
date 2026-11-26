<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { Attachment } from "svelte/attachments";
  import { on } from "svelte/events";
  import Icon from "#lib/icons/Icon.svelte";
  import { compare } from "./Compare.styles";
  import type { EmbedProps } from "./props";
  import { mediaBlock } from "#lib/styles/media-blocks.ts";

  let {
    before,
    after,
    alt,
    beforeLabel = "Before",
    afterLabel = "After",
    caption,
    width,
    height,
    sources = { before: {}, after: {} },
    sizes,
  }: EmbedProps<"compare"> & {
    width?: number;
    height?: number;
    sources?: { before: Record<string, string>; after: Record<string, string> };
    sizes?: string;
  } = $props();

  let position = $state(50);

  const clamp = (value: number) => Math.min(100, Math.max(0, value));

  const KEYS: Partial<Record<string, number>> = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 };

  function onkeydown(event: KeyboardEvent) {
    const direction = KEYS[event.key];
    if (!direction) return;
    event.preventDefault();
    position = clamp(position + direction * (event.shiftKey ? 10 : 2));
  }

  const scrub: Attachment<HTMLElement> = (node) => {
    const follow = (event: PointerEvent) => {
      const { left, width } = node.getBoundingClientRect();
      position = clamp(((event.clientX - left) / width) * 100);
    };
    const stops = [
      on(node, "pointerdown", (event) => {
        if (event.button !== 0) return;
        node.setPointerCapture(event.pointerId);
        follow(event);
      }),
      on(node, "pointermove", (event) => {
        if (node.hasPointerCapture(event.pointerId)) follow(event);
      }),
    ];
    return () => stops.forEach((stop) => stop());
  };

  const ratio = $derived(width && height ? compare.ratio(width, height) : undefined);
  const atEnd = $derived(position <= 0 || position >= 100);
  const valueText = $derived(`${Math.round(position)}% ${beforeLabel}, ${100 - Math.round(position)}% ${afterLabel}`);
</script>

{#snippet formats(srcsets: Record<string, string>)}
  {#each Object.entries(srcsets) as [format, srcset] (format)}
    <source {srcset} {sizes} type={`image/${format}`} />
  {/each}
{/snippet}

<figure>
  <div {@attach scrub} {...stylex.attrs(compare.frame)}>
    <picture {...stylex.attrs(compare.picture)}>
      {@render formats(sources.before)}
      <img
        {...stylex.attrs(compare.before, ratio, compare.revealBefore(position))}
        src={before}
        {alt}
        {width}
        {height}
        loading="lazy"
        decoding="async"
      />
    </picture>
    <picture {...stylex.attrs(compare.picture)}>
      {@render formats(sources.after)}
      <img
        {...stylex.attrs(compare.after, compare.reveal(position))}
        src={after}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </picture>
    <span {...stylex.attrs(mediaBlock.frosted, compare.label, compare.labelBefore)} aria-hidden="true">{beforeLabel}</span>
    <span {...stylex.attrs(mediaBlock.frosted, compare.label, compare.labelAfter)} aria-hidden="true">{afterLabel}</span>
    <input
      {...stylex.attrs(mediaBlock.invisibleRange, compare.range, stylex.defaultMarker())}
      type="range"
      min="0"
      max="100"
      step="any"
      bind:value={position}
      aria-label={`Compare ${beforeLabel} and ${afterLabel}: ${alt}`}
      aria-valuetext={valueText}
      {onkeydown}
    />
    <span {...stylex.attrs(compare.divider, compare.at(position), atEnd && compare.dividerAtEnd)}></span>
    <span {...stylex.attrs(mediaBlock.roundControl, compare.handle, compare.at(position))}>
      <Icon name="dragHandle" style={mediaBlock.icon} />
    </span>
  </div>
  {#if caption}
    <figcaption {...stylex.attrs(mediaBlock.caption)}>{caption}</figcaption>
  {/if}
</figure>
