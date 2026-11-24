<script module lang="ts">
  import type { Attachment } from "svelte/attachments";
  import { on } from "svelte/events";
  import { keycap, warm } from "#lib/sound.svelte.ts";

  const keycaps: Attachment = (root) =>
    on(root, "pointerdown", (event) => {
      if (!(event.target instanceof Element) || !event.target.closest("kbd")) return;
      warm();
      keycap();
    });

  const headingLinks: Attachment = (root) =>
    on(root, "click", async (event) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-role="heading-link"]') : null;
      if (!link) return;
      event.preventDefault();
      history.replaceState(history.state, "", link.hash);
      try {
        await navigator.clipboard.writeText(link.href);
      } catch {
        return;
      }
      link.dataset.copied = "";
      link.title = "Copied";
      setTimeout(() => {
        delete link.dataset.copied;
        link.title = "Copy link";
      }, 1500);
    });
</script>

<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import Code from "#lib/embeds/Code.svelte";
  import { embedFor } from "#lib/embeds/index.ts";
  import GalleryDialog, { Gallery } from "#lib/Gallery.svelte";
  import type { Block } from "#lib/server/markdown/index.ts";
  import { prose } from "#lib/styles/prose.ts";

  let { blocks }: { blocks: Block[] } = $props();
  const gallery = new Gallery();
</script>

{#key blocks}
  <div {@attach gallery.attach} {@attach keycaps} {@attach headingLinks} {...stylex.attrs(prose.root)}>
    {#each blocks as block, index (index)}
      {#if block.kind === "html"}
        {@html block.html}
      {:else if block.kind === "code"}
        <div {...stylex.attrs(prose.box)}>
          <Code {block} />
        </div>
      {:else}
        {@const { Embed, props } = embedFor(block)}
        <div {...stylex.attrs(block.wide ? prose.wide : prose.box, prose.media)} data-embed={block.name}>
          <Embed {...props} />
        </div>
      {/if}
    {/each}
  </div>
{/key}

<GalleryDialog {gallery} />
