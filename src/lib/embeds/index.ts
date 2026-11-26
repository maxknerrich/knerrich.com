import type { Component } from "svelte";
import type { Block } from "#lib/server/markdown/index.ts";
import type { EmbedName, EmbedProps } from "./props";

type Embeds = { [N in EmbedName]: Component<EmbedProps<N>> };

const loaders: { [N in EmbedName]: () => Promise<{ default: Embeds[N] }> } = {
  compare: () => import("./Compare.svelte"),
  tweet: () => import("./Tweet.svelte"),
  "sync-steps": () => import("../../content/projects/local-first-api-sync/SyncSteps.svelte"),
  "sync-live": () => import("../../content/projects/local-first-api-sync/SyncLive.svelte"),
  "requests-live": () => import("../../content/projects/local-first-api-sync/RequestsLive.svelte"),
  stats: () => import("./Stats.svelte"),
  chart: () => import("./Chart.svelte"),
  cards: () => import("./Cards.svelte"),
  paper: () => import("./Paper.svelte"),
  video: () => import("./Video.svelte"),
  timing: () => import("./Timing.svelte"),
  "car-data-live": () => import("../../content/projects/brunkhorst/CarDataLive.svelte"),
  "agent-search-steps": () => import("../../content/projects/brunkhorst/AgentSearchSteps.svelte"),
  "kit-steps": () => import("../../content/projects/tldraw/KitSteps.svelte"),
};

const loaded: Partial<Embeds> = {};

const load = async <N extends EmbedName>(name: N) => {
  loaded[name] ??= (await loaders[name]()).default;
};

export const loadEmbeds = (blocks: readonly Block[]) =>
  Promise.all(blocks.flatMap((block) => (block.kind === "embed" ? [load(block.name)] : [])));

export const embedFor = <N extends EmbedName>(block: {
  name: N;
  props: EmbedProps<N>;
}): { Embed: Component<EmbedProps<N>>; props: EmbedProps<N> } => {
  const Embed = loaded[block.name];
  if (!Embed) throw new Error(`The ${block.name} embed wasn't loaded before render`);
  return { Embed, props: block.props };
};
