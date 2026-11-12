import { Data, Effect, Schema } from "effect";
import { parse } from "yaml";

// The frontmatter of a writing piece, validated with Effect Schema at build time
// and by the pre-commit hook (scripts/tend-writing.ts). Its encoded type is also
// what the Markdown content mapper type-checks frontmatter against while editing.
// Shared with plain `node`, so this module must stay free of relative and SvelteKit imports.

export const STAGES = ["seedling", "budding", "evergreen"] as const;
export type Stage = (typeof STAGES)[number];

const isRealDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
};

/** A calendar date written as YYYY-MM-DD, e.g. 2026-11-08. */
export const IsoDate = Schema.TemplateLiteral([
  Schema.Finite,
  "-",
  Schema.Finite,
  "-",
  Schema.Finite,
])
  .annotate({ message: "must be a YYYY-MM-DD date" })
  .check(
    Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/, { message: "must be a YYYY-MM-DD date" }),
    Schema.makeFilter((date: string) => isRealDate(date) || `${date} is not a real date`),
  );
export type IsoDate = typeof IsoDate.Type;

/** Today's date (YYYY-MM-DD) in the local time zone. */
export const today = () => new Date().toLocaleDateString("en-CA") as IsoDate;

/** Everything is optional, so a new piece can start as plain Markdown. */
export const Frontmatter = Schema.Struct({
  stage: Schema.Literals(STAGES).pipe(
    Schema.withDecodingDefault(Effect.succeed<Stage>("seedling")),
  ),
  /** First published. Defaults to today; the pre-commit hook writes it into new pieces. */
  planted: IsoDate.pipe(Schema.withDecodingDefault(Effect.sync(today))),
  /** Last meaningful update, set by hand. Changing it saves the previous version. Defaults to `planted`. */
  tended: Schema.optional(IsoDate),
  /** Notes keyed by date. Not shown yet; kept for a future version history. */
  changelog: Schema.Record(IsoDate, Schema.String).pipe(
    Schema.withDecodingDefault(Effect.succeed({})),
  ),
}).check(
  Schema.makeFilter(
    ({ planted, tended }) =>
      tended === undefined ||
      tended >= planted || { path: ["tended"], issue: `can't be before planted (${planted})` },
  ),
);

/** What may be written in a piece's frontmatter. */
export type FrontmatterInput = typeof Frontmatter.Encoded;
export type Meta = Omit<typeof Frontmatter.Type, "tended"> & { tended: IsoDate };

export class ContentError extends Data.TaggedError("ContentError")<{ readonly message: string }> {}

// A leading --- block; the closing --- must sit on its own line. The block may be empty.
const FRONTMATTER = /^---\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/;

/** Splits a writing file into validated frontmatter and its Markdown body. Fails with the file path on bad input. */
export const splitFrontmatter = (markdown: string, path: string) =>
  Effect.gen(function* () {
    const match = FRONTMATTER.exec(markdown);
    // An opening --- without a closing one is broken frontmatter, not plain Markdown.
    if (!match && /^---\r?\n/.test(markdown)) {
      return yield* new ContentError({ message: `${path}: frontmatter has no closing ---` });
    }
    const yaml = match?.[1] ?? "";
    // Parsed YAML is whatever the file says; the schema decides what it is.
    const data = yield* Effect.try({
      try: (): unknown => (yaml.trim() ? (parse(yaml) ?? {}) : {}),
      catch: (error) =>
        new ContentError({ message: `${path}: invalid YAML frontmatter (${String(error)})` }),
    });
    // Unknown fields and changelog keys that aren't dates are mistakes, not extras to drop.
    const decoded = yield* Schema.decodeUnknownEffect(Frontmatter)(data, {
      onExcessProperty: "error",
    }).pipe(Effect.mapError((error) => new ContentError({ message: `${path}: ${error.message}` })));
    const meta: Meta = { ...decoded, tended: decoded.tended ?? decoded.planted };
    return { meta, body: match ? markdown.slice(match[0].length) : markdown };
  });

/** Whether the frontmatter sets `key` itself (rather than relying on a default). */
export const hasField = (markdown: string, key: string) =>
  new RegExp(`^${key}:`, "m").test(FRONTMATTER.exec(markdown)?.[1] ?? "");

/** Sets a top-level frontmatter field, adding the field (or the whole block) if needed. */
export function setField(markdown: string, key: string, value: string): string {
  const match = FRONTMATTER.exec(markdown);
  if (!match) return `---\n${key}: ${value}\n---\n\n${markdown}`;
  const line = new RegExp(`^${key}:.*$`, "m");
  const yaml = match[1] ?? "";
  const block = line.test(yaml)
    ? yaml.replace(line, `${key}: ${value}`)
    : `${yaml}\n${key}: ${value}`.trim();
  return `---\n${block}\n---\n${markdown.slice(match[0].length)}`;
}
