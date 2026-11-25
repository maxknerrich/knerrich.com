<script lang="ts" module>
  import * as stylex from "@stylexjs/stylex";
  import type { StyleXStyles } from "@stylexjs/stylex";
  import { color } from "#lib/styles/tokens.stylex.ts";

  const ink = stylex.create({
    plain: { color: color["--text-secondary"] },
    string: { color: color["--text"] },
    number: { color: color["--glow"] },
    comment: { color: color["--text-muted"] },
  });

  const TOKEN = /(\/\/.*)|("[^"]*"(?=\s*:))|("[^"]*")|(\b\d+\b)/g;
  const INKS = [ink.comment, ink.plain, ink.string, ink.number];

  function paint(line: string) {
    const parts: [text: string, style: StyleXStyles][] = [];
    let last = 0;
    for (const match of line.matchAll(TOKEN)) {
      if (match.index > last) parts.push([line.slice(last, match.index), ink.plain]);
      const group = match.slice(1).findIndex((found) => found !== undefined);
      parts.push([match[0], INKS[group] ?? ink.plain]);
      last = match.index + match[0].length;
    }
    if (last < line.length) parts.push([line.slice(last), ink.plain]);
    return parts;
  }
</script>

<script lang="ts">
  let { line }: { line: string } = $props();
</script>

{#each paint(line) as [text, style], i (i)}<span {...stylex.attrs(style)}>{text}</span>{/each}
