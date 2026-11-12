<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { embedFor } from "#lib/embeds/index.ts";
  import type { Block } from "#lib/server/markdown.ts";
  import { prose } from "#lib/styles/prose.ts";

  // Long-form text rendered from repository Markdown (projects and writing), with
  // Svelte embeds in between. Text and embeds sit in the reading column; images
  // and `wide` embeds use the full page width. The rendered HTML already carries
  // its StyleX classes (see #lib/server/markdown.ts).
  // HTML comes only from our repository's Markdown, never visitor input.
  let { blocks }: { blocks: Block[] } = $props();
</script>

<div {...stylex.attrs(prose.root)}>
  {#each blocks as block, index (index)}
    {#if block.kind === "html"}
      {@html block.html}
    {:else}
      {@const { Embed, props } = embedFor(block)}
      <div {...stylex.attrs(block.wide ? prose.wide : prose.column, prose.media)} data-embed={block.name}>
        <Embed {...props} />
      </div>
    {/if}
  {/each}
</div>
