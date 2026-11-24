import { Schema } from "effect";

export const NOTE_KINDS = ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"] as const;
export const NoteKind = Schema.Literals(NOTE_KINDS);
export type NoteKind = typeof NoteKind.Type;
export const NOTE_LINE = /^\[!(\w+)\][ \t]*(.*)$/;

export const CODE_LANGS = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "svelte",
  "json",
  "yaml",
  "css",
  "html",
  "md",
  "bash",
  "sh",
  "diff",
  "sql",
  "rust",
  "go",
  "python",
  "wgsl",
  "glsl",
  "txt",
] as const;
export const CodeLang = Schema.Literals(CODE_LANGS);
export type CodeLang = typeof CodeLang.Type;

export const CodeMeta = Schema.Struct({
  title: Schema.optional(Schema.NonEmptyString),
});
export type CodeMetaInput = typeof CodeMeta.Encoded;

type CodeMetaPair = { key: string; value: string; keyStart: number; valueStart: number };

export function parseCodeInfo(info: string) {
  const lang = /^\S*/.exec(info)?.[0] ?? "";
  const pairs: CodeMetaPair[] = [];
  const pattern = /(\w+)="([^"]*)"/g;
  let rest = info.slice(lang.length);
  for (const match of info.slice(lang.length).matchAll(pattern)) {
    const keyStart = lang.length + match.index;
    pairs.push({
      key: match[1] ?? "",
      value: match[2] ?? "",
      keyStart,
      valueStart: keyStart + (match[1]?.length ?? 0) + 2,
    });
    rest = rest.replace(match[0], "");
  }
  const words = rest.trim().split(/\s+/).filter(Boolean);
  const nocheck = words.includes("nocheck");
  return { lang, pairs, nocheck, rest: words.filter((word) => word !== "nocheck").join(" ") };
}

export const STEP_HREF = /^step:([a-z0-9-]+)\/([1-9]\d*)$/;

export const FOOTNOTE_ID = /^[\w-]+$/;
export const FOOTNOTE_REF = /\[\^([\w-]+)\](?!:)/g;
export const FOOTNOTE_DEFINITION = /^\[\^([\w-]+)\]:[ \t]/gm;

export const SITE_HREF = /^\/(writing|projects)\/([^/#?]+)\/?(?:[#?].*)?$/;

export const PIECE_PATH = /(?:^|\/)src\/content\/writing\/([a-z0-9-]+)(?:\/index)?\.md$/;
