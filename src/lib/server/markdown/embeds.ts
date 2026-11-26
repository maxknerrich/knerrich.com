import { Effect, Schema } from "effect";
import { walkTokens, type Token, type Tokens } from "marked";
import { parse } from "yaml";
import {
  embedProps,
  isEmbedName,
  type EmbedName,
  type EmbedProps,
  type TweetData,
  VISUALIZATIONS,
} from "#lib/embeds/props.ts";
import { ContentError } from "#lib/writing/frontmatter.ts";
import { STEP_HREF } from "#lib/writing/syntax.ts";
import { steps as agentSearchSteps } from "../../../content/projects/brunkhorst/agent-search.ts";
import { steps as kitSteps } from "../../../content/projects/tldraw/kit-steps.ts";
import { steps as syncSteps } from "../../../content/projects/local-first-api-sync/merge-steps.ts";
import { isIconName } from "#lib/icons/glyphs.ts";
import { drawingFor, pictureFor, posterFor, videoFor } from "../assets.ts";
import { Tweets } from "../tweets.ts";
import { IMAGE_SIZES } from "./figures.ts";
import type { Block, Figures } from "./index.ts";

type BlockProps<N extends EmbedName> = EmbedProps<N> & {
  data?: TweetData;
  width?: number;
  height?: number;
  sources?: { before: Sources; after: Sources };
  sizes?: string;
};

type Sources = Readonly<Record<string, string>>;

type EmbedBlock<N extends EmbedName> = {
  kind: "embed";
  name: N;
  props: BlockProps<N>;
  wide: boolean;
};
type EmbedBlocks<K extends EmbedName = EmbedName> = { [N in K]: EmbedBlock<N> };
export type AnyEmbedBlock = EmbedBlocks[EmbedName];

export const isEmbed = (token: Token): token is Tokens.Code & { lang: EmbedName } =>
  token.type === "code" && typeof token.lang === "string" && isEmbedName(token.lang);

const EmbedYaml = Schema.StructWithRest(Schema.Struct({ wide: Schema.optional(Schema.Boolean) }), [
  Schema.Record(Schema.String, Schema.Unknown),
]);

type Resolve<N extends EmbedName> = (
  props: EmbedProps<N>,
) => Effect.Effect<BlockProps<N>, ContentError, Tweets>;

const resolvers = (
  source: string,
  fail: (detail: string) => ContentError,
): { [N in EmbedName]?: Resolve<N> } => {
  const picture = (value: string) => {
    if (!value.startsWith("./")) return Effect.succeed(undefined);
    const found = pictureFor(value, source);
    return found
      ? Effect.succeed(found)
      : Effect.fail(fail(`uses ${value}, which isn't beside the piece`));
  };
  return {
    compare: (props) =>
      Effect.all([picture(props.before), picture(props.after)]).pipe(
        Effect.map(([before, after]) => ({
          ...props,
          before: before?.img.src ?? props.before,
          after: after?.img.src ?? props.after,
          ...(before && { width: before.img.w, height: before.img.h }),
          sources: { before: before?.sources ?? {}, after: after?.sources ?? {} },
          sizes: IMAGE_SIZES,
        })),
      ),
    cards: (props) => {
      const unknown = props.items.find(({ icon }) => icon !== undefined && !isIconName(icon));
      return unknown
        ? Effect.fail(fail(`uses icon ${unknown.icon}, which isn't in src/lib/icons/glyphs.ts`))
        : Effect.succeed(props);
    },
    paper: (props) => {
      const page = drawingFor(props.page, source);
      return page
        ? Effect.succeed({ ...props, page })
        : Effect.fail(fail(`uses ${props.page}, which isn't beside the piece`));
    },
    video: (props) => {
      const src = videoFor(props.src, source);
      const poster = posterFor(props.poster, source)?.img;
      if (!src) return Effect.fail(fail(`uses ${props.src}, which isn't beside the piece`));
      if (!poster) return Effect.fail(fail(`uses ${props.poster}, which isn't beside the piece`));
      return Effect.succeed({
        ...props,
        src,
        poster: poster.src,
        width: poster.w,
        height: poster.h,
      });
    },
    tweet: (props) =>
      Tweets.use((tweets) => tweets.lookup(props.id)).pipe(
        Effect.map((data) => ({ ...props, ...(data && { data }) })),
      ),
  };
};

const WIDE_EMBEDS: ReadonlySet<EmbedName> = new Set([
  "compare",
  "video",
  "chart",
  "timing",
  "sync-steps",
  "sync-live",
  "requests-live",
  "car-data-live",
  "agent-search-steps",
  "kit-steps",
]);

export const embedBlock = <N extends EmbedName>(
  name: N,
  text: string,
  source: string,
  figures: Figures,
) =>
  Effect.gen(function* () {
    const fail = (detail: string) =>
      new ContentError({ message: `${source}: \`${name}\` block ${detail}` });
    const data = yield* Effect.try({
      try: (): unknown => (text.trim() ? parse(text) : {}),
      catch: (error) => fail(`has invalid YAML (${String(error)})`),
    });
    const decode = <S extends Schema.Constraint>(schema: S, input: unknown) =>
      Schema.decodeUnknownEffect(schema)(input, { onExcessProperty: "error" }).pipe(
        Effect.mapError((error) => fail(error.message)),
      );
    const { wide = figures === "wide" && WIDE_EMBEDS.has(name), ...rest } = yield* decode(
      EmbedYaml,
      data ?? {},
    );
    const props = yield* decode(embedProps[name], rest);
    const resolve = resolvers(source, fail)[name];
    const block: EmbedBlocks<N>[N] = {
      kind: "embed",
      name,
      props: resolve ? yield* resolve(props) : props,
      wide,
    };
    return block;
  });

const STEP_COUNTS = {
  "sync-steps": syncSteps.length,
  "agent-search-steps": agentSearchSteps.length,
  "kit-steps": kitSteps.length,
} satisfies Record<(typeof VISUALIZATIONS)[number], number>;
const isStepped = (name: EmbedName): name is keyof typeof STEP_COUNTS =>
  Object.hasOwn(STEP_COUNTS, name);

export function stepLinksIn(tokens: Token[]) {
  const links: string[] = [];
  void walkTokens(tokens, (token) => {
    if (token.type !== "link") return;
    const { href } = token as Tokens.Link;
    if (href.startsWith("step:")) links.push(href);
  });
  return {
    links,
    problems: links
      .filter((href) => !STEP_HREF.test(href))
      .map((href) => `step link ${href} must be step:<visualization id>/<step, from 1>`),
  };
}

export function stepLinkProblem(links: string[], blocks: Block[]) {
  const counts = new Map(
    blocks.flatMap((block) =>
      block.kind === "embed" && isStepped(block.name) && "id" in block.props
        ? [[block.props.id, STEP_COUNTS[block.name]] as const]
        : [],
    ),
  );
  for (const href of links) {
    const [, id = "", step = ""] = STEP_HREF.exec(href) ?? [];
    const count = counts.get(id);
    if (count === undefined)
      return `step link ${href} has no visualization with that id on the page`;
    if (Number(step) > count) return `step link ${href} is past the last step (${count})`;
  }
  return undefined;
}
