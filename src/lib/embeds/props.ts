import { Schema } from "effect";

// The props each embed accepts, by the name used in Markdown (```iframe). They are
// decoded from the code block's YAML at build time, and the Markdown content mapper
// type-checks code blocks against their encoded types while editing.
// To add an embed: add its schema here and its component in ./index.ts.

const Https = Schema.String.check(
  Schema.isPattern(/^https:\/\/\S+$/, { message: "must be an https:// URL" }),
);
const AspectRatio = Schema.String.check(
  Schema.isPattern(/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/, {
    message: 'must be a ratio like "16 / 9"',
  }),
);

export const embedProps = {
  /** An external page, e.g. a demo or sandbox. `title` is read by screen readers. */
  iframe: Schema.Struct({
    src: Https,
    title: Schema.NonEmptyString,
    aspect: Schema.optional(AspectRatio),
  }),
  /** The looping local-first sync illustration from the homepage. */
  "sync-diagram": Schema.Struct({}),
};

export type EmbedName = keyof typeof embedProps;
/** Props a component receives. */
export type EmbedProps<N extends EmbedName> = (typeof embedProps)[N]["Type"];
/** Props as written in Markdown (before decoding). */
export type EmbedInput<N extends EmbedName> = (typeof embedProps)[N]["Encoded"];

export const isEmbedName = (name: string): name is EmbedName => Object.hasOwn(embedProps, name);
