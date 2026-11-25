<script lang="ts" module>
  import * as stylex from "@stylexjs/stylex";
  import { color, media, radius, reading, space } from "#lib/styles/tokens.stylex.ts";

  const layout = stylex.create({
    grid: {
      display: "grid",
      gridTemplateColumns: {
        default: `minmax(0, 1fr) ${space["--space-64"]} minmax(0, 1fr)`,
        [media.phone]: "minmax(0, 1fr)",
      },
      gridTemplateRows: {
        default: `auto ${space["--space-96"]} auto`,
        [media.phone]: `auto ${space["--space-40"]} auto ${space["--space-64"]} auto ${space["--space-40"]} auto`,
      },
      zoom: { default: 1, [media.phone]: 0.8 },
      alignItems: "start",
      paddingBlockStart: space["--space-48"],
      paddingBlockEnd: space["--space-64"],
      paddingInline: space["--space-32"],
    },
    someone: {
      gridColumnStart: "1",
      gridRowStart: "1",
    },
    outer: {
      position: "relative",
      inlineSize: { default: "auto", [media.phone]: 1 },
      gridColumnStart: { default: "2", [media.phone]: "1" },
      gridRowStart: { default: "1", [media.phone]: "2" },
    },
    github: {
      gridColumnStart: { default: "3", [media.phone]: "1" },
      gridRowStart: { default: "1", [media.phone]: "3" },
      alignSelf: { default: "end", [media.phone]: "start" },
    },
    down: {
      position: "relative",
      gridColumnStart: { default: "3", [media.phone]: "1" },
      gridRowStart: { default: "2", [media.phone]: "4" },
      alignSelf: "stretch",
      inlineSize: 1,
      marginInlineStart: space["--space-40"],
    },
    frame: {
      gridColumnStart: "1",
      gridColumnEnd: "-1",
      gridRowStart: { default: "3", [media.phone]: "5" },
      gridRowEnd: { default: "4", [media.phone]: "8" },
      alignSelf: "stretch",
      marginInline: `calc(-1 * ${space["--space-16"]})`,
      marginBlockStart: `calc(-1 * ${space["--space-48"]})`,
      marginBlockEnd: `calc(-1 * ${space["--space-16"]})`,
      paddingBlock: space["--space-12"],
      paddingInline: space["--space-16"],
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: reading["--viz-stroke"],
      borderRadius: radius["--radius-md"],
      color: color["--text-muted"],
    },
    label: {
      display: "flex",
      alignItems: "center",
      justifyContent: { default: "flex-start", [media.phone]: "flex-end" },
      gap: space["--space-8"],
    },
    sync: {
      gridColumnStart: { default: "3", [media.phone]: "1" },
      gridRowStart: { default: "3", [media.phone]: "5" },
    },
    inner: {
      position: "relative",
      inlineSize: { default: "auto", [media.phone]: 1 },
      gridColumnStart: { default: "2", [media.phone]: "1" },
      gridRowStart: { default: "3", [media.phone]: "6" },
    },
    database: {
      gridColumnStart: "1",
      gridRowStart: { default: "3", [media.phone]: "7" },
    },
  });
</script>

<script lang="ts">
  import Icon from "#lib/icons/Icon.svelte";
  import type { IconName } from "#lib/icons/glyphs.ts";
  import Stepper from "#lib/Stepper.svelte";
  import { type } from "#lib/styles/shared.ts";
  import type { StyleXStyles } from "@stylexjs/stylex";
  import type { EmbedProps } from "#lib/embeds/props.ts";
  import { board } from "#lib/styles/board.ts";
  import { AUTHOR, FIELDS, steps, type Field, type Issue } from "./merge-steps";

  let { id, autoplay = false }: EmbedProps<"sync-steps"> = $props();

  const show = (value: string) => (value === "" ? "—" : value);
  const litFor = (field: Field) => (AUTHOR[field] === "someone" ? board.litOther : board.lit);
</script>

{#snippet head(icon: IconName, label: string, meta?: string, other = false)}
  <header {...stylex.attrs(board.head, type.caps)}>
    <Icon name={icon} style={board.icon} />{label}
    {#if meta}<span {...stylex.attrs(board.meta, other && board.metaOther)}>{meta}</span>{/if}
  </header>
{/snippet}

{#snippet issue(fields: Partial<Issue>, lit: Field[] = [], step: number, typed = false)}
  <div {...stylex.attrs(board.body)}>
    {#each FIELDS as name (name)}
      {@const value = fields[name]}
      {@const on = lit.includes(name)}
      <div {...stylex.attrs(board.field, on && litFor(name), value === undefined && board.gone)}>
        <span {...stylex.attrs(board.key)}>{name}</span>
        <span {...stylex.attrs(board.value, !value && board.empty)}>
          {#if on && typed && value}
            {#key step}<span {...stylex.attrs(board.typed(value.length))}>{value}</span>{/key}
          {:else}
            {show(value ?? "")}
          {/if}
        </span>
      </div>
    {/each}
  </div>
{/snippet}

{#snippet link(place: StyleXStyles, flowing: boolean, backwards: StyleXStyles | false, step: number, vertical = false)}
  <span {...stylex.attrs(vertical ? board.flowLine : board.link, place, flowing && board.flowing)} aria-hidden="true">
    <span {...stylex.attrs(board.end, board.from, flowing && board.endFlowing)}></span>
    <span {...stylex.attrs(board.end, board.to, flowing && board.endFlowing)}></span>
    {#if flowing}
      {#key step}<span {...stylex.attrs(board.packet, board.looping, backwards)}></span>{/key}
    {/if}
  </span>
{/snippet}

<Stepper {id} {steps} {autoplay}>
  {#snippet children(index)}
    {@const step = steps[index] ?? steps[0]}
    {@const someone = step.actor === "someone"}
    {@const database = step.flow?.database}
    <div {...stylex.attrs(layout.grid)}>
      <section {...stylex.attrs(board.panel, layout.someone, someone ? board.activeOther : board.idle)} aria-label="Someone else">
        {@render head("pixelUser", "Someone else", someone ? "edits" : undefined, true)}
        {@render issue(someone ? { title: step.github.title } : {}, someone ? ["title"] : [], index, true)}
      </section>

      {@render link(layout.outer, someone, false, index)}

      <section {...stylex.attrs(board.panel, layout.github)} aria-label="The issue on GitHub">
        {@render head("pixelGithub", "GitHub")}
        {@render issue(step.github, step.lit?.github, index)}
      </section>

      {@render link(layout.down, step.flow?.github !== undefined, step.flow?.github === "out" && board.backwards, index, true)}

      <div {...stylex.attrs(layout.frame)} aria-hidden="true">
        <span {...stylex.attrs(layout.label, type.caps)}><Icon name="pixelLaptop" style={board.icon} />This device · the app</span>
      </div>

      <section {...stylex.attrs(board.panel, layout.sync, step.sync ? board.active : board.idle)} aria-label="The sync">
        {@render head("pixelSync", "Sync", step.sync?.label)}
        {@render issue(step.sync?.issue ?? {}, step.lit?.sync, index)}
      </section>

      {@render link(
        layout.inner,
        database !== undefined,
        database === "in" ? board.backwardsNarrow : database === "out" && board.backwardsWide,
        index,
      )}

      <section {...stylex.attrs(board.panel, layout.database)} aria-label="The app's database">
        {@render head("pixelDatabase", "Database", step.actor === "user" ? "user edits" : undefined)}
        {@render issue(step.device, step.lit?.device, index, step.actor === "user")}
        <p {...stylex.attrs(board.section, type.caps)}><Icon name="pixelList" style={board.icon} />Write-log</p>
        <div {...stylex.attrs(board.body)}>
          {#each [0, 1, 2] as slot (slot)}
            {@const entry = step.log[slot]}
            {@const on = step.lit?.log === slot}
            <div {...stylex.attrs(board.field, !entry && board.gone, on && (entry?.by === "github" ? board.litOther : board.lit))}>
              <span {...stylex.attrs(board.key)}>#{slot + 1}</span>
              <span {...stylex.attrs(board.value)}>{entry?.field ?? ""}{entry?.by === "github" ? " · GitHub" : ""}</span>
            </div>
          {/each}
        </div>
      </section>
    </div>
  {/snippet}
</Stepper>
