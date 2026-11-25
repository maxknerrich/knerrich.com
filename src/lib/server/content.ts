import { Context, Effect, Layer } from "effect";
import { Highlighter } from "./markdown/code.ts";
import { readProjects } from "./projects.ts";
import { Tweets } from "./tweets.ts";
import { readPieces } from "./writing.ts";

type Piece = Effect.Success<ReturnType<typeof readPieces>>[number];
export type Project = Effect.Success<ReturnType<typeof readProjects>>[number];

export class Content extends Context.Service<
  Content,
  { readonly pieces: readonly Piece[]; readonly projects: readonly Project[] }
>()("knerrich/server/Content") {
  static readonly layer = Layer.effect(
    Content,
    Effect.gen(function* () {
      const showUnpublished = import.meta.env.DEV;
      return Content.of({
        pieces: yield* readPieces(showUnpublished),
        projects: yield* readProjects(showUnpublished),
      });
    }),
  ).pipe(Layer.provide(Highlighter.layer), Layer.provide(Tweets.layer));
}

export const { pieces, projects } = await Effect.runPromise(
  Effect.provide(
    Content.useSync((content) => content),
    Content.layer,
  ),
);

export const entries = pieces.map(
  ({
    blocks: _blocks,
    headings: _headings,
    footnotes: _footnotes,
    minutes: _minutes,
    tags: _tags,
    ...entry
  }) => entry,
);
export type WritingEntry = (typeof entries)[number];

export const caseStudies = projects.filter(({ caseStudy }) => caseStudy);

export const cards = projects.map(
  ({ description: _description, about: _about, blocks: _blocks, footnotes: _footnotes, ...card }) =>
    card,
);
