<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import Icon from "#lib/icons/Icon.svelte";
  import type { CodeBlock } from "#lib/server/markdown/code.ts";
  import { code } from "#lib/styles/code.ts";
  import { glass, screenReader } from "#lib/styles/shared.ts";

  let { block }: { block: CodeBlock } = $props();

  let copied = $state(false);
  let reset: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    await navigator.clipboard.writeText(block.text);
    copied = true;
    clearTimeout(reset);
    reset = setTimeout(() => (copied = false), 2000);
  }

  $effect(() => () => clearTimeout(reset));
</script>

<figure {...stylex.attrs(glass.edge, glass.card, code.figure, stylex.defaultMarker())}>
  {#if block.title}
    <figcaption {...stylex.attrs(code.title)}>{block.title}</figcaption>
  {/if}
  <div {...stylex.attrs(code.actions)}>
    <button
      type="button"
      aria-label={block.title ? `Copy ${block.title}` : "Copy code"}
      title="Copy"
      onclick={copy}
      {...stylex.attrs(code.button, copied && code.on, glass.focus)}
    >
      <Icon name={copied ? "pixelCopied" : "pixelCopy"} style={code.icon} />
    </button>
  </div>
  {@html block.html}
  <span role="status" {...stylex.attrs(screenReader.only)}>{copied ? "Copied to clipboard" : ""}</span>
</figure>
