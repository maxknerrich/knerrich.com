import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { Element, ElementContent } from "hast";
import { Context, Effect, Layer, Schema } from "effect";
import type { Tokens } from "marked";
import { createCssVariablesTheme, createHighlighter, type ShikiTransformer } from "shiki";
import { code } from "#lib/styles/code.ts";
import { ContentError } from "#lib/writing/frontmatter.ts";
import { CODE_LANGS, CodeLang, CodeMeta, parseCodeInfo } from "#lib/writing/syntax.ts";

export type CodeBlock = {
  kind: "code";
  html: string;
  lang: CodeLang | "";
  title?: string;
  text: string;
};

const PLAIN = "txt";
const isCodeLang = Schema.is(CodeLang);

const classes = (style: StyleXStyles) => stylex.props(style).className?.split(" ") ?? [];
const isElement = (node: ElementContent): node is Element => node.type === "element";

const styled: ShikiTransformer = {
  name: "site:styled",
  code(node) {
    const lines = node.children.filter(isElement);
    for (const [index, line] of lines.entries())
      line.properties = { class: classes(code.line), dataLine: index + 1 };
    node.children = lines;
    node.properties = { class: classes(code.code) };
  },
  pre(node) {
    node.properties = { class: classes(code.pre), tabindex: 0 };
  },
};

export class Highlighter extends Context.Service<
  Highlighter,
  { readonly highlight: (text: string, lang: CodeLang) => string }
>()("knerrich/server/Highlighter") {
  static readonly layer = Layer.effect(
    Highlighter,
    Effect.gen(function* () {
      const theme = createCssVariablesTheme({ name: "site", variablePrefix: "--code-" });
      const shiki = yield* Effect.promise(() =>
        createHighlighter({ themes: [theme], langs: CODE_LANGS.filter((lang) => lang !== PLAIN) }),
      );
      return Highlighter.of({
        highlight: (text, lang) =>
          shiki.codeToHtml(text, { lang, theme: "site", transformers: [styled] }),
      });
    }),
  );
}

export const codeBlock = Effect.fnUntraced(function* (token: Tokens.Code, source: string) {
  const fail = (detail: string) =>
    new ContentError({ message: `${source}: code block \`${token.lang ?? ""}\` ${detail}` });
  const { lang: info, pairs, rest } = parseCodeInfo(token.lang ?? "");
  const lang = info === "" || isCodeLang(info) ? info : undefined;
  if (lang === undefined)
    return yield* fail(`uses an unknown language (use one of: ${CODE_LANGS.join(", ")})`);
  if (rest) return yield* fail(`has "${rest}" after its language, which isn't a key="value" pair`);
  const meta = yield* Schema.decodeEffect(CodeMeta)(
    Object.fromEntries(pairs.map(({ key, value }) => [key, value])),
    { onExcessProperty: "error" },
  ).pipe(Effect.mapError((error) => fail(`has a bad option: ${error.message}`)));
  const { highlight } = yield* Highlighter;
  return {
    kind: "code",
    html: highlight(token.text, lang || PLAIN),
    lang,
    ...(meta.title && { title: meta.title }),
    text: token.text,
  } satisfies CodeBlock;
});
