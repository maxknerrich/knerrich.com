<script lang="ts" module>
  import * as stylex from "@stylexjs/stylex";
  import { font, radius, reading, space } from "#lib/styles/tokens.stylex.ts";

  const DURATION = 10000;
  const FIRST = 0.06;
  const EACH = 0.14;
  const HOLD = 0.93;
  const DIM = 0.3;

  const fields = [
    ["model", "Dacia Duster"],
    ["mileage", "11.995 km"],
    ["fuel", "Benzin"],
    ["price", "21.290 €"],
    ["branch", "Bremervörde"],
  ] as const;

  const NONE = -1;

  const data: [line: string, field: number][] = [
    ["{", NONE],
    ['  "@type": ["Car", "Product"],', NONE],
    ['  "name": "Dacia Duster TCe 140",', 0],
    ['  "mileageFromOdometer": { "value": 11995 },', 1],
    ['  "fuelType": "Benzin",', 2],
    ['  "offers": {', 3],
    ['    "price": 21290,', 3],
    ['    "priceCurrency": "EUR",', 3],
    ['    "seller": {', 4],
    ['      "@type": "AutoDealer",', 4],
    ['      "name": "Autohaus Brunkhorst Bremervörde"', 4],
    ["    }", 4],
    ["  }", 3],
    ["}", NONE],
  ];

  const startOf = (at: number) => FIRST + at * EACH;

  const lit = (at: number): Keyframe[] => [
    { opacity: 0, offset: 0 },
    { opacity: 0, offset: startOf(at) },
    { opacity: 1, offset: startOf(at) + 0.02 },
    { opacity: 1, offset: startOf(at) + EACH - 0.01 },
    { opacity: 0, offset: startOf(at) + EACH + 0.02 },
    { opacity: 0, offset: 1 },
  ];

  const reveal = (at: number): Keyframe[] =>
    at === NONE
      ? [{ opacity: 1 }, { opacity: 1 }]
      : [
          { opacity: DIM, offset: 0 },
          { opacity: DIM, offset: startOf(at) + 0.05 },
          { opacity: 1, offset: startOf(at) + 0.08 },
          { opacity: 1, offset: HOLD },
          { opacity: DIM, offset: 1 },
        ];

  const travel = (at: number): Keyframe[] => {
    const start = startOf(at);
    const end = start + 0.06;
    return [
      { left: "0%", top: "0%", opacity: 0, offset: 0 },
      { left: "0%", top: "0%", opacity: 0, offset: start },
      { left: "0%", top: "0%", opacity: 1, offset: start + 0.005, easing: "ease-in-out" },
      { left: "100%", top: "100%", opacity: 1, offset: end },
      { left: "100%", top: "100%", opacity: 0, offset: end + 0.005 },
      { left: "100%", top: "100%", opacity: 0, offset: 1 },
    ];
  };

  const flowing = (): Keyframe[] => [
    { opacity: 0, offset: 0 },
    ...fields.flatMap((_, at) => [
      { opacity: 0, offset: startOf(at) },
      { opacity: 1, offset: startOf(at) + 0.005 },
      { opacity: 1, offset: startOf(at) + 0.06 },
      { opacity: 0, offset: startOf(at) + 0.07 },
    ]),
    { opacity: 0, offset: 1 },
  ];

  const scene = stylex.create({
    code: {
      flexGrow: 1.7,
    },
    lines: {
      display: "grid",
      paddingBlock: space["--space-16"],
      paddingInline: space["--space-12"],
      fontFamily: font["--font-mono"],
      fontSize: reading["--type-caption"],
      lineHeight: 1.6,
    },
    line: {
      paddingInlineEnd: space["--space-8"],
      borderRadius: radius["--radius-xs"],
      whiteSpace: "pre-wrap",
      paddingInlineStart: `calc(${space["--space-8"]} + 6ch)`,
      textIndent: "-6ch",
    },
  });
</script>

<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import Icon from "#lib/icons/Icon.svelte";
  import Playback from "#lib/Playback.svelte";
  import { board } from "#lib/styles/board.ts";
  import { type } from "#lib/styles/shared.ts";
  import CodeLine from "./CodeLine.svelte";

  const animate =
    (keyframes: Keyframe[]): Attachment<Element> =>
    (element) => {
      const animation = element.animate(keyframes, {
        duration: DURATION,
        iterations: Infinity,
        fill: "both",
        easing: "linear",
      });
      return () => animation.cancel();
    };
</script>

<Playback title="What a car page tells search engines" detail="the page's own data, as JSON-LD">
  <div
    {...stylex.attrs(board.row)}
    role="img"
    aria-label="A used Dacia Duster's page, and the structured data it carries: a car and a product, Dacia Duster TCe 140, 11,995 km, petrol, 21,290 euros, sold by Autohaus Brunkhorst Bremervörde"
  >
    <section {...stylex.attrs(board.panel)}>
      <header {...stylex.attrs(board.head, type.caps)}><Icon name="pixelLaptop" style={board.icon} />Car page</header>
      <div {...stylex.attrs(board.body)}>
        {#each fields as [key, value], at (key)}
          <div {...stylex.attrs(board.field, board.stack)}>
            <span {@attach animate(lit(at))} {...stylex.attrs(board.glow)}></span>
            <span {...stylex.attrs(board.key)}>{key}</span>
            <span {...stylex.attrs(board.value)}>{value}</span>
          </div>
        {/each}
      </div>
    </section>
    <span {...stylex.attrs(board.link)} aria-hidden="true">
      <span {@attach animate(flowing())} {...stylex.attrs(board.beam)}></span>
      <span {...stylex.attrs(board.end, board.from)}></span>
      <span {...stylex.attrs(board.end, board.to)}></span>
      {#each fields as [key], at (key)}<span {@attach animate(travel(at))} {...stylex.attrs(board.packet)}></span>{/each}
    </span>
    <section {...stylex.attrs(board.panel, scene.code)}>
      <header {...stylex.attrs(board.head, type.caps)}>
        <Icon name="pixelList" style={board.icon} />JSON-LD<span {...stylex.attrs(board.meta)}>schema.org</span>
      </header>
      <div {...stylex.attrs(scene.lines)}>
        {#each data as [line, at], i (i)}
          <span {...stylex.attrs(board.stack, scene.line)}>
            {#if at !== NONE}<span {@attach animate(lit(at))} {...stylex.attrs(board.glow)}></span>{/if}
            <span {@attach animate(reveal(at))}><CodeLine {line} /></span>
          </span>
        {/each}
      </div>
    </section>
  </div>
</Playback>
