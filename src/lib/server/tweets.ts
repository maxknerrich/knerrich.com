import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Cache, Context, Effect, Layer, Option, Schema } from "effect";
import { TweetData } from "#lib/embeds/props.ts";

const Entity = Schema.Struct({
  url: Schema.String,
  display_url: Schema.String,
  indices: Schema.Tuple([Schema.Finite, Schema.Finite]),
});

const Result = Schema.Struct({
  text: Schema.String,
  created_at: Schema.String,
  favorite_count: Schema.Finite,
  conversation_count: Schema.optional(Schema.Finite),
  display_text_range: Schema.Tuple([Schema.Finite, Schema.Finite]),
  entities: Schema.optional(Schema.Struct({ urls: Schema.optional(Schema.Array(Entity)) })),
  user: Schema.Struct({
    name: Schema.String,
    screen_name: Schema.String,
    profile_image_url_https: Schema.String,
  }),
  mediaDetails: Schema.optional(
    Schema.Array(
      Schema.Struct({
        type: Schema.String,
        media_url_https: Schema.String,
        ext_alt_text: Schema.optional(Schema.NullOr(Schema.String)),
        original_info: Schema.Struct({ width: Schema.Finite, height: Schema.Finite }),
      }),
    ),
  ),
});
type Result = typeof Result.Type;

const token = (id: string) => ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">" };

function displayText({ text, display_text_range: [start, end], entities }: Result) {
  const chars = Array.from(text).slice(start, end);
  const links = (entities?.urls ?? [])
    .filter(({ indices: [from, to] }) => from >= start && to <= end)
    .toSorted((a, b) => b.indices[0] - a.indices[0]);
  for (const {
    indices: [from, to],
    display_url,
  } of links)
    chars.splice(from - start, to - from, display_url);
  return chars
    .join("")
    .replace(/&(?:amp|lt|gt);/g, (entity) => ENTITIES[entity] ?? entity)
    .trim();
}

function toTweetData(result: Result): TweetData {
  const [media] = result.mediaDetails ?? [];
  return {
    text: displayText(result),
    name: result.user.name,
    handle: result.user.screen_name,
    avatar: result.user.profile_image_url_https.replace("_normal.", "_bigger."),
    date: new Date(result.created_at).toISOString(),
    likes: result.favorite_count,
    replies: result.conversation_count ?? 0,
    ...(media && {
      media: {
        src: media.media_url_https,
        width: media.original_info.width,
        height: media.original_info.height,
        ...(media.ext_alt_text && { alt: media.ext_alt_text }),
        video: media.type !== "photo",
      },
    }),
  };
}

const fetchTweet = (id: string) =>
  Effect.tryPromise(async (signal) => {
    const url = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${token(id)}`;
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`tweet ${id}: ${response.status}`);
    const json: unknown = await response.json();
    return json;
  }).pipe(
    Effect.flatMap(Schema.decodeUnknownEffect(Result)),
    Effect.map(toTweetData),
    Effect.timeout("5 seconds"),
    Effect.option,
    Effect.map(Option.getOrUndefined),
  );

const BUILD_CACHE = join(tmpdir(), `knerrich-tweets-${process.pid}`);
const Cached = Schema.fromJsonString(Schema.NullOr(TweetData));

const fromBuildCache = (id: string) =>
  Effect.try(() => readFileSync(join(BUILD_CACHE, `${id}.json`), "utf8")).pipe(
    Effect.flatMap(Schema.decodeEffect(Cached)),
    Effect.map((data) => data ?? undefined),
  );

const toBuildCache = (id: string, data: TweetData | undefined) =>
  Effect.try(() => {
    mkdirSync(BUILD_CACHE, { recursive: true });
    writeFileSync(join(BUILD_CACHE, `${id}.json`), JSON.stringify(data ?? null));
  }).pipe(Effect.ignore);

const lookupTweet = (id: string) =>
  fromBuildCache(id).pipe(
    Effect.catch(() => fetchTweet(id).pipe(Effect.tap((data) => toBuildCache(id, data)))),
  );

export class Tweets extends Context.Service<
  Tweets,
  { readonly lookup: (id: string) => Effect.Effect<TweetData | undefined> }
>()("knerrich/server/Tweets") {
  static readonly layer = Layer.effect(
    Tweets,
    Cache.make({ lookup: lookupTweet, capacity: Number.POSITIVE_INFINITY }).pipe(
      Effect.map((cache) => Tweets.of({ lookup: (id) => Cache.get(cache, id) })),
    ),
  );
}
