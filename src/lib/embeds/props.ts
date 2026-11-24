import { Schema } from "effect";

const ImageSrc = Schema.String.check(
  Schema.isPattern(/^(\.\/\S+|https:\/\/\S+)$/, {
    message: "must be ./<file> or an https:// URL",
  }),
);
const BlockId = Schema.String.check(
  Schema.isPattern(/^[a-z0-9-]+$/, { message: "must be lowercase letters, digits and dashes" }),
);

const ChartValue = Schema.Union([Schema.Finite, Schema.Tuple([Schema.Finite, Schema.Finite])]);
export type ChartValue = typeof ChartValue.Type;

export const TweetData = Schema.Struct({
  text: Schema.String,
  name: Schema.String,
  handle: Schema.String,
  avatar: Schema.String,
  date: Schema.String,
  likes: Schema.Finite,
  replies: Schema.Finite,
  media: Schema.optional(
    Schema.Struct({
      src: Schema.String,
      width: Schema.Finite,
      height: Schema.Finite,
      alt: Schema.optional(Schema.String),
      video: Schema.Boolean,
    }),
  ),
});
export type TweetData = typeof TweetData.Type;

export const embedProps = {
  compare: Schema.Struct({
    before: ImageSrc,
    after: ImageSrc,
    alt: Schema.NonEmptyString,
    beforeLabel: Schema.optional(Schema.String),
    afterLabel: Schema.optional(Schema.String),
    caption: Schema.optional(Schema.String),
  }),
  stats: Schema.Struct({
    items: Schema.Array(
      Schema.Struct({
        value: Schema.Union([Schema.NonEmptyString, Schema.Finite]),
        label: Schema.NonEmptyString,
      }),
    ).check(Schema.isMinLength(1), Schema.isMaxLength(4)),
  }),
  chart: Schema.Struct({
    title: Schema.NonEmptyString,
    series: Schema.Array(Schema.NonEmptyString).check(Schema.isMinLength(1), Schema.isMaxLength(2)),
    rows: Schema.Array(
      Schema.Struct({ label: Schema.NonEmptyString, values: Schema.Array(ChartValue) }),
    ).check(Schema.isMinLength(1)),
    unit: Schema.optional(Schema.NonEmptyString),
    marker: Schema.optional(Schema.Struct({ value: Schema.Finite, label: Schema.NonEmptyString })),
    caption: Schema.optional(Schema.String),
  }).check(
    Schema.makeFilter(
      ({ series, rows }) =>
        rows.every(({ values }) => values.length === series.length) ||
        "each row needs one value per series",
    ),
    Schema.makeFilter(
      ({ rows }) =>
        rows.every(({ values }) =>
          values.every((value) => typeof value === "number" || value[0] <= value[1]),
        ) || "a range is [low, high]",
    ),
  ),
  tweet: Schema.Struct({
    id: Schema.String.check(
      Schema.isPattern(/^\d+$/, { message: "must be the tweet's numeric id" }),
    ),
  }),
  "sync-live": Schema.Struct({
    loop: Schema.optional(Schema.Boolean),
  }),
  "sync-steps": Schema.Struct({
    id: BlockId,
    autoplay: Schema.optional(Schema.Boolean),
  }),
};

export type EmbedName = keyof typeof embedProps;
export type EmbedProps<N extends EmbedName> = (typeof embedProps)[N]["Type"];
export type EmbedInput<N extends EmbedName> = (typeof embedProps)[N]["Encoded"];

export const isEmbedName = (name: string): name is EmbedName => Object.hasOwn(embedProps, name);

export const VISUALIZATIONS = ["sync-steps"] as const satisfies readonly EmbedName[];
