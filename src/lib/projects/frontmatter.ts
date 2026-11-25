import { Effect, Schema } from "effect";

const YearSpan = Schema.String.check(
  Schema.isPattern(/^\d{4}–\d{4}$/, { message: "must be a year (2025) or a span (2023–2025)" }),
);

export const ProjectFrontmatter = Schema.Struct({
  year: Schema.Union([Schema.Int, YearSpan]),
  industry: Schema.String,
  color: Schema.String.check(
    Schema.isPattern(/^#[0-9a-f]{6}$/i, { message: "must be a #rrggbb color" }),
  ),
  website: Schema.optional(
    Schema.String.check(Schema.isPattern(/^https:\/\//, { message: "must be an https:// URL" })),
  ),
  draft: Schema.Boolean.pipe(Schema.withDecodingDefault(Effect.succeed(false))),
});

export type ProjectFrontmatterInput = typeof ProjectFrontmatter.Encoded;
