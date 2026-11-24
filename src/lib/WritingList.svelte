<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { color, font, media, motion, radius, rollMarker, space } from "#lib/styles/tokens.stylex.ts";

  const list = stylex.create({
    firstRow: {
      borderBlockStartWidth: { default: 1, ":first-child": 0 },
    },
    group: {
      marginBlockStart: { default: space["--space-48"], ":first-child": 0 },
    },
    rows: {
      marginBlockStart: space["--space-8"],
    },
    row: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "baseline",
      columnGap: space["--space-24"],
      rowGap: space["--space-2"],
      paddingBlock: { default: space["--space-8"], [media.phone]: space["--space-12"] },
      color: { default: color["--text"], ":hover": color["--glow"] },
      textDecoration: "none",
      borderRadius: radius["--radius-md"],
      transitionProperty: { default: "none", [media.motion]: "color, box-shadow" },
      transitionDuration: motion["--duration-base"],
    },
    meta: {
      display: "inline-flex",
      fontFamily: font["--font-pixel"],
      alignItems: "end",
      gap: space["--space-8"],
      whiteSpace: "nowrap",
    },
    roomy: {
      rowGap: space["--space-4"],
      paddingBlock: { default: space["--space-32"], [media.phone]: space["--space-24"] },
    },
  });
</script>

<script lang="ts">
  import { resolve } from "$app/paths";
  import { playInTurn } from "#lib/in-view.ts";
  import type { WritingEntry } from "#lib/server/content.ts";
  import { glass, scroll, site, type } from "#lib/styles/shared.ts";
  import Roll from "./Roll.svelte";
  import Stage from "./Stage.svelte";

  let {
    entries,
    compact = false,
    years = false,
  }: {
    entries: WritingEntry[];
    compact?: boolean;
    years?: boolean;
  } = $props();

  const playRow = $derived(playInTurn(compact ? 300 : 0));
  const groups = $derived(
    years ? [...Map.groupBy(entries, ({ updated }) => updated?.slice(0, 4) ?? "")] : [["", entries] as const],
  );
  const format = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
</script>

{#each groups as [year, items] (year)}
  <section {...stylex.attrs(list.group)} aria-label={year || undefined}>
    {#if year}<h2 {@attach playRow} {...stylex.attrs(type.small, type.muted, scroll.reveal)}>{year}</h2>{/if}
    <ol {...stylex.attrs(site.plainList, compact ? list.rows : site.rows)}>
      {#each items as entry (entry.slug)}
        <li {@attach playRow} {...stylex.attrs(!compact && site.row, !compact && list.firstRow, scroll.reveal)}>
          <a
            href={resolve("/writing/[slug]", { slug: entry.slug })}
            {...stylex.attrs(list.row, !compact && list.roomy, glass.focus, !compact && rollMarker)}
          >
            <span {...stylex.attrs(compact ? type.body : type.lead)}>{#if compact}{entry.title}{:else}<Roll>{entry.title}</Roll>{/if}</span>
            <span {...stylex.attrs(list.meta, type.small, compact ? type.muted : type.secondary)}>
              <Stage stage={entry.stage} /> {#if entry.updated}·
                <time datetime={entry.updated}>{format(entry.updated)}</time>{/if}
            </span>
          </a>
        </li>
      {/each}
    </ol>
  </section>
{/each}
