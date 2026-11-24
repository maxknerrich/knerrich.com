import type { Component } from "svelte";
import SyncLive from "../../content/projects/local-first-api-sync/SyncLive.svelte";
import SyncSteps from "../../content/projects/local-first-api-sync/SyncSteps.svelte";
import Chart from "./Chart.svelte";
import Compare from "./Compare.svelte";
import type { EmbedName, EmbedProps } from "./props";
import Stats from "./Stats.svelte";
import Tweet from "./Tweet.svelte";

export const embeds: { [N in EmbedName]: Component<EmbedProps<N>> } = {
  compare: Compare,
  tweet: Tweet,
  "sync-steps": SyncSteps,
  "sync-live": SyncLive,
  stats: Stats,
  chart: Chart,
};

export const embedFor = <N extends EmbedName>(block: {
  name: N;
  props: EmbedProps<N>;
}): { Embed: Component<EmbedProps<N>>; props: EmbedProps<N> } => ({
  Embed: embeds[block.name],
  props: block.props,
});
