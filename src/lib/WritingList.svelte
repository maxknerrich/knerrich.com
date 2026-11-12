<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { resolve } from "$app/paths";
  import { rowMarker } from "#lib/styles/markers.stylex.ts";
  import type { WritingEntry } from "#lib/server/writing.ts";
  import { STAGE_NAMES } from "#lib/writing/sprites.ts";
  import { shared } from "#lib/styles/shared.ts";
  import { list } from "#lib/styles/writing.ts";
  import PlantIcon from "./PlantIcon.svelte";

  // Rows of writing, newest tending first. With `years`, rows are grouped under
  // the year they were last tended, shown in the left gutter.
  let { entries, years = false }: { entries: WritingEntry[]; years?: boolean } = $props();

  const groups = $derived(
    years ? [...Map.groupBy(entries, ({ tended }) => tended.slice(0, 4))] : [["", entries] as const],
  );
  const format = (iso: string, options: Intl.DateTimeFormatOptions) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { ...options, timeZone: "UTC" });
</script>

<!-- The default marker lets rows dim while the list is hovered (see list.row). -->
<div {...stylex.attrs(stylex.defaultMarker())}>
  {#each groups as [year, items], groupIndex (year)}
    <section {...stylex.attrs(list.group)} aria-label={year || undefined}>
      {#if year}<h2 {...stylex.attrs(list.year)}>{year}</h2>{/if}
      <ol {...stylex.attrs(list.items, years && list.withYears)}>
        {#each items as entry, index (entry.slug)}
          <li>
            <a
              {...stylex.attrs(list.row, groupIndex === 0 && index === 0 && list.firstRow, rowMarker)}
              href={resolve("/writing/[slug]", { slug: entry.slug })}
            >
              <span {...stylex.attrs(list.icon)} title={STAGE_NAMES[entry.stage]}>
                <PlantIcon stage={entry.stage} />
              </span>
              <span {...stylex.attrs(shared.visuallyHidden)}>{STAGE_NAMES[entry.stage]}:</span>
              <span {...stylex.attrs(list.title)}>{entry.title}</span>
              {#if entry.planted !== entry.tended}
                <span {...stylex.attrs(list.date, list.planted)}>
                  planted {format(entry.planted, { month: "short", year: "numeric" })}
                </span>
              {/if}
              <time {...stylex.attrs(list.date)} datetime={entry.tended}>
                {format(entry.tended, { day: "numeric", month: "short" })}
              </time>
            </a>
          </li>
        {/each}
      </ol>
    </section>
  {/each}
</div>
