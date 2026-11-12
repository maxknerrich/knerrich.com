import type { Component } from "svelte";
import Iframe from "./Iframe.svelte";
import type { EmbedName, EmbedProps } from "./props";
import SyncDiagram from "./SyncDiagram.svelte";

// Svelte components that Markdown can embed, Obsidian style: a fenced code block
// named after the component, with YAML props inside.
//
//   ```iframe
//   src: https://example.com
//   title: An example
//   ```
//
// Each component must accept exactly the props its schema in ./props.ts decodes to.
// Only types come from ./props.ts, so Effect stays out of the browser bundle.
export const embeds: { [N in EmbedName]: Component<EmbedProps<N>> } = {
  iframe: Iframe,
  "sync-diagram": SyncDiagram,
};

/** Pairs an embed's component with its props, for rendering a block of either kind. */
export const embedFor = <N extends EmbedName>(block: {
  name: N;
  props: EmbedProps<N>;
}): { Embed: Component<EmbedProps<N>>; props: EmbedProps<N> } => ({
  Embed: embeds[block.name],
  props: block.props,
});
