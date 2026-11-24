<script module lang="ts">
  import { render } from "svelte/server";
  import Mark from "#lib/logos/Mark.svelte";
  import { symbol } from "#lib/stickers/marks.ts";
  import { palette, surface } from "#lib/styles/tokens.stylex.ts";
  import type { Card } from "./og.ts";

  const MARGIN = 96;
  const HEADING = 80;
  const SHORT_TITLE = { maxLength: 30, size: 104 };
  const SECONDARY = "rgb(255 255 255 / 0.5)";
  const SHADOW = "0 2px 4px rgb(0 0 0 / 0.5), 0 14px 30px rgb(0 0 0 / 0.6)";
  const CORNER = `position:absolute;right:${MARGIN}px;bottom:${MARGIN}px;`;

  const K = `data:image/svg+xml;base64,${Buffer.from(
    render(Mark, {
      props: { mark: symbol, xmlns: "http://www.w3.org/2000/svg", color: palette.stickerGraphite },
    }).body,
  ).toString("base64")}`;
</script>

<script lang="ts">
  let { card }: { card: Card } = $props();
  const size = $derived(
    card.kind === "title" && card.title.length <= SHORT_TITLE.maxLength ? SHORT_TITLE.size : HEADING,
  );
</script>

{#snippet sticker(width: number, place: string)}
  <div style="{place}display:flex;width:{width}px;height:{width}px;padding:{width * 0.055}px;border-radius:50%;background-color:{palette.stickerPaper};transform:rotate(-8deg);box-shadow:{SHADOW}">
    <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:50%;background-color:{palette.chromeMid};background-image:linear-gradient(110deg, {palette.stickerClear} 30%, {palette.stickerStreak} 42%, {palette.stickerClear} 54%), {surface.chrome}">
      <img src={K} alt="" style="width:{width * 0.5}px" />
    </div>
  </div>
{/snippet}

{#if card.kind === "picture"}
  <div style="display:flex;width:100%;height:100%;background-color:{palette.imagePaper}">
    <img src="picture" alt="" style="width:100%;height:100%;object-fit:cover" />
    {#if card.sticker}{@render sticker(150, "position:absolute;left:64px;bottom:64px;")}{/if}
  </div>
{:else}
  <div style="display:flex;flex-direction:column;width:100%;height:100%;padding:{MARGIN}px;background-color:{palette.night};background-image:{surface.graphPaper};background-size:{surface.graphPaperSize};color:{palette.text};font-family:Switzer;font-weight:500">
    <p style="margin:0;max-width:880px;font-size:{size}px;line-height:1;letter-spacing:-0.025em;text-wrap:balance">
      {#if card.kind === "headline"}{card.lead} <span style="color:{SECONDARY}">{card.rest}</span>{:else}{card.title}{/if}
    </p>
    {@render sticker(card.kind === "headline" ? 180 : 150, CORNER)}
  </div>
{/if}
