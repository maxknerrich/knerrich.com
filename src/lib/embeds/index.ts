import type { Component } from "svelte";
import AgentSearchSteps from "../../content/projects/brunkhorst/AgentSearchSteps.svelte";
import CarDataLive from "../../content/projects/brunkhorst/CarDataLive.svelte";
import RequestsLive from "../../content/projects/local-first-api-sync/RequestsLive.svelte";
import SyncLive from "../../content/projects/local-first-api-sync/SyncLive.svelte";
import SyncSteps from "../../content/projects/local-first-api-sync/SyncSteps.svelte";
import Cards from "./Cards.svelte";
import KitSteps from "../../content/projects/tldraw/KitSteps.svelte";
import Chart from "./Chart.svelte";
import Compare from "./Compare.svelte";
import type { EmbedName, EmbedProps } from "./props";
import Paper from "./Paper.svelte";
import Stats from "./Stats.svelte";
import Timing from "./Timing.svelte";
import Tweet from "./Tweet.svelte";
import Video from "./Video.svelte";

export const embeds: { [N in EmbedName]: Component<EmbedProps<N>> } = {
  compare: Compare,
  tweet: Tweet,
  "sync-steps": SyncSteps,
  "sync-live": SyncLive,
  "requests-live": RequestsLive,
  stats: Stats,
  chart: Chart,
  cards: Cards,
  paper: Paper,
  video: Video,
  timing: Timing,
  "car-data-live": CarDataLive,
  "agent-search-steps": AgentSearchSteps,
  "kit-steps": KitSteps,
};

export const embedFor = <N extends EmbedName>(block: {
  name: N;
  props: EmbedProps<N>;
}): { Embed: Component<EmbedProps<N>>; props: EmbedProps<N> } => ({
  Embed: embeds[block.name],
  props: block.props,
});
