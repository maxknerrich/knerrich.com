import { Data, Effect, Schema } from "effect";
import { parse } from "yaml";

const STAGES = ["seed", "seedling", "budding", "evergreen"] as const;
export type Stage = (typeof STAGES)[number];

const isRealDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
};

const IsoDate = Schema.TemplateLiteral([Schema.Finite, "-", Schema.Finite, "-", Schema.Finite])
  .annotate({ message: "must be a YYYY-MM-DD date" })
  .check(
    Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/, { message: "must be a YYYY-MM-DD date" }),
    Schema.makeFilter((date: string) => isRealDate(date) || `${date} is not a real date`),
  );
const Frontmatter = Schema.Struct({
  stage: Schema.Literals(STAGES).pipe(
    Schema.withDecodingDefault(Effect.succeed<Stage>("seedling")),
  ),
  description: Schema.optional(Schema.NonEmptyString),
  created: Schema.optional(IsoDate),
  updated: Schema.optional(IsoDate),
}).check(
  Schema.makeFilter(
    ({ stage, created }) =>
      stage === "seed" ||
      created !== undefined || { path: ["created"], issue: "is required unless the stage is seed" },
  ),
  Schema.makeFilter(
    ({ created, updated }) =>
      created === undefined ||
      updated === undefined ||
      updated >= created || { path: ["updated"], issue: `can't be before created (${created})` },
  ),
);

export type FrontmatterInput = typeof Frontmatter.Encoded;

export class ContentError extends Data.TaggedError("ContentError")<{ readonly message: string }> {}

const FRONTMATTER = /^---\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/;

export const readFrontmatter = <T>(schema: Schema.Decoder<T>, markdown: string, path: string) =>
  Effect.gen(function* () {
    const match = FRONTMATTER.exec(markdown);
    if (!match && /^---\r?\n/.test(markdown)) {
      return yield* new ContentError({ message: `${path}: frontmatter has no closing ---` });
    }
    const yaml = match?.[1] ?? "";
    const data = yield* Effect.try({
      try: (): unknown => (yaml.trim() ? (parse(yaml) ?? {}) : {}),
      catch: (error) =>
        new ContentError({ message: `${path}: invalid YAML frontmatter (${String(error)})` }),
    });
    const decoded = yield* Schema.decodeUnknownEffect(schema)(data, {
      onExcessProperty: "error",
    }).pipe(Effect.mapError((error) => new ContentError({ message: `${path}: ${error.message}` })));
    return { data: decoded, body: match ? markdown.slice(match[0].length) : markdown };
  });

export const splitFrontmatter = (markdown: string, path: string) =>
  readFrontmatter(Frontmatter, markdown, path).pipe(
    Effect.map(({ data, body }) => ({
      meta: { ...data, updated: data.updated ?? data.created },
      body,
    })),
  );
