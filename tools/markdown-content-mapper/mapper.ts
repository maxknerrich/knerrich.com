import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { Result, Schema } from "effect";
import { marked, type Token } from "marked";
import { isMap, isScalar, isSeq, parseDocument } from "yaml";

type SpanMapping = [number, number, number, number, 0 | 1];
type MapperDiagnostic = { messageText: string; start: number; length: number; code: number };
const TransformParams = Schema.Struct({ fileName: Schema.String, content: Schema.String });

const YAML_ERROR = 9001;
const MISSING_PROP = 9002;
const CODE_INFO = 9003;
const STEP_LINK = 9004;
const FOOTNOTE = 9005;
const FRONTMATTER = /^---\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/;
const IMPORT = /^import\b[^;]*?["'][^"'\n]*["'][ \t]*;?/gm;
const EXPORT = /^export[ \t]+(?:default[ \t]+)?/gm;

class Emitter {
  text = "";
  mappings: SpanMapping[] = [];
  write(text: string) {
    this.text += text;
  }
  verbatim(text: string, originalStart: number) {
    if (!text) return;
    this.mappings.push([this.text.length, text.length, originalStart, text.length, 0]);
    this.text += text;
  }
  mapped(text: string, originalStart: number, originalLength: number) {
    this.mappings.push([this.text.length, text.length, originalStart, originalLength, 1]);
    this.text += text;
  }
}

function emitCode(out: Emitter, code: string, start: number, imported: Set<string>) {
  const lifted = [...code.matchAll(IMPORT), ...code.matchAll(EXPORT)].toSorted(
    (a, b) => a.index - b.index,
  );
  for (const match of lifted) {
    if (!match[0].startsWith("import") || imported.has(match[0])) continue;
    imported.add(match[0]);
    out.verbatim(match[0], start + match.index);
    out.write("\n");
  }
  out.write("{\n");
  let cursor = 0;
  for (const match of lifted) {
    out.verbatim(code.slice(cursor, match.index), start + cursor);
    cursor = match.index + match[0].length;
  }
  out.verbatim(code.slice(cursor), start + cursor);
  out.write("\n}\n");
}

function emitPairs(out: Emitter, node: unknown, offset: number): void {
  if (!isMap(node)) return;
  for (const { key, value } of node.items) {
    if (!isScalar(key) || !key.range) continue;
    out.mapped(
      JSON.stringify(String(key.value)),
      offset + key.range[0],
      key.range[1] - key.range[0],
    );
    out.write(": ");
    emitYaml(out, value, offset);
    out.write(", ");
  }
}

function emitYaml(out: Emitter, node: unknown, offset: number): void {
  if (isMap(node)) {
    out.write("{ ");
    emitPairs(out, node, offset);
    out.write("}");
  } else if (isSeq(node)) {
    out.write("[");
    for (const item of node.items) {
      emitYaml(out, item, offset);
      out.write(", ");
    }
    out.write("]");
  } else if (isScalar(node) && node.range) {
    const { value } = node;
    const literal =
      typeof value === "number" || typeof value === "boolean"
        ? String(value)
        : JSON.stringify(value ?? null);
    out.mapped(literal, offset + node.range[0], node.range[1] - node.range[0]);
  } else {
    out.write("undefined");
  }
}

function parseYaml(source: string, offset: number, diagnostics: MapperDiagnostic[]) {
  const document = parseDocument(source);
  for (const error of document.errors) {
    const [start, end] = error.pos;
    diagnostics.push({
      messageText: error.message,
      start: offset + start,
      length: Math.max(1, end - start),
      code: YAML_ERROR,
    });
  }
  return document.contents;
}

function rootOf(fileName: string) {
  let dir = dirname(fileName);
  while (!existsSync(join(dir, "src/lib/embeds/props.ts"))) {
    const parent = dirname(dir);
    if (parent === dir) throw new Error(`No src/lib/embeds/props.ts above ${fileName}`);
    dir = parent;
  }
  return dir;
}

type Props = typeof import("../../src/lib/embeds/props.ts");
type Syntax = typeof import("../../src/lib/writing/syntax.ts");
const loaded = new Map<string, Promise<[Props, Syntax]>>();
const modulesIn = (root: string) => {
  const url = (path: string) => pathToFileURL(join(root, path)).href;
  let modules = loaded.get(root);
  if (!modules) {
    modules = Promise.all([
      import(url("src/lib/embeds/props.ts")) as Promise<Props>,
      import(url("src/lib/writing/syntax.ts")) as Promise<Syntax>,
    ]);
    loaded.set(root, modules);
  }
  return modules;
};

type Block = { token: Token; start: number };

function blocksOf(content: string, bodyStart: number) {
  const blocks: Block[] = [];
  let start = bodyStart;
  for (const token of marked.lexer(content.slice(bodyStart))) {
    blocks.push({ token, start });
    start += token.raw.length;
  }
  return blocks;
}

function linksOf(content: string, blocks: Block[]) {
  const links: { href: string; raw: string; block: Block; start?: number }[] = [];
  for (const block of blocks) {
    let cursor = block.start;
    void marked.walkTokens([block.token], (token: Token) => {
      if (token.type !== "link") return;
      const start = content.indexOf(token.raw, cursor);
      if (start !== -1) cursor = start + token.raw.length;
      links.push({ href: token.href, raw: token.raw, block, ...(start !== -1 && { start }) });
    });
  }
  return links;
}

const withoutCode = (content: string, blocks: Block[]) => {
  let text = content;
  for (const { token, start } of blocks) {
    if (token.type !== "code") continue;
    text =
      text.slice(0, start) + " ".repeat(token.raw.length) + text.slice(start + token.raw.length);
  }
  return text;
};

async function transform({ fileName, content }: typeof TransformParams.Type) {
  const root = rootOf(fileName);
  const [props, syntax] = await modulesIn(root);
  const required = new Map(
    Object.entries(props.embedProps).map(([name, { fields }]) => [
      name,
      Object.entries(fields).flatMap(([key, field]) =>
        field.ast.context?.isOptional ? [] : [key],
      ),
    ]),
  );
  const writing = join(root, "src/content/writing");
  const slugs = (existsSync(writing) ? readdirSync(writing, { withFileTypes: true }) : [])
    .flatMap((entry) => {
      if (entry.isFile()) return [entry.name];
      return entry.isDirectory() && existsSync(join(writing, entry.name, "index.md"))
        ? [`${entry.name}/index.md`]
        : [];
    })
    .flatMap((name) => syntax.PIECE_PATH.exec(`src/content/writing/${name}`)?.[1] ?? [])
    .map((slug) => JSON.stringify(slug));
  const out = new Emitter();
  const diagnostics: MapperDiagnostic[] = [];

  out.write(
    'import type { FrontmatterInput as $FrontmatterInput } from "#lib/writing/frontmatter.ts";\n',
  );
  out.write(
    'import type { ProjectFrontmatterInput as $ProjectFrontmatterInput } from "#lib/projects/frontmatter.ts";\n',
  );
  out.write('import type { EmbedInput as $EmbedInput } from "#lib/embeds/props.ts";\n');
  out.write(
    'import type { CodeLang as $CodeLang, CodeMetaInput as $CodeMetaInput, NoteKind as $NoteKind } from "#lib/writing/syntax.ts";\n',
  );
  out.write(`type WritingSlug = ${slugs.join(" | ") || "never"};\n`);
  out.write("declare function $link(slug: WritingSlug): void;\n\n");

  const frontmatter = FRONTMATTER.exec(content);
  const blocks = blocksOf(content, frontmatter?.[0].length ?? 0);
  const frontmatterType = fileName.includes("/src/content/writing/")
    ? "$FrontmatterInput"
    : fileName.includes("/src/content/projects/")
      ? "$ProjectFrontmatterInput"
      : undefined;
  if (frontmatter && frontmatterType) {
    const offset = content.indexOf("\n") + 1;
    out.write("export const $frontmatter = { ");
    emitPairs(out, parseYaml(frontmatter[1] ?? "", offset, diagnostics), offset);
    out.write("} satisfies ");
    out.mapped(frontmatterType, 0, 3);
    out.write(";\n");
  }

  const visualizations: string[] = [];
  const imported = new Set<string>();
  for (const { token, start } of blocks) {
    if (token.type === "blockquote") {
      const kind = syntax.NOTE_LINE.exec(token.text.split("\n")[0] ?? "")?.[1];
      if (kind === undefined) continue;
      const kindStart = start + token.raw.indexOf(`[!${kind}]`) + 2;
      out.write("void (");
      out.mapped(JSON.stringify(kind), kindStart, kind.length);
      out.write(" ");
      out.mapped("satisfies", kindStart, kind.length);
      out.write(" $NoteKind);\n");
      continue;
    }
    if (token.type !== "code" || typeof token.lang !== "string" || !token.lang) continue;
    const infoStart = start + token.raw.indexOf(token.lang);
    const bodyStart = start + token.raw.indexOf("\n") + 1;
    const keys = required.get(token.lang);
    if (keys) {
      const name = token.lang;
      const yaml = parseYaml(token.text, bodyStart, diagnostics);
      out.write("void ({ ");
      emitPairs(out, yaml, bodyStart);
      out.write(
        `} satisfies Partial<$EmbedInput<${JSON.stringify(name)}> & { wide?: boolean }>);\n`,
      );
      const given = new Set(
        isMap(yaml)
          ? yaml.items.flatMap(({ key }) => (isScalar(key) ? [String(key.value)] : []))
          : [],
      );
      const missing = keys.filter((key) => !given.has(key));
      if (missing.length) {
        diagnostics.push({
          messageText: `The \`${name}\` embed is missing required props: ${missing.join(", ")}.`,
          start: infoStart,
          length: name.length,
          code: MISSING_PROP,
        });
      }
      const id = /^id:[ \t]*["']?([\w-]+)/m.exec(token.text)?.[1];
      if (id && props.VISUALIZATIONS.some((visualization) => visualization === name))
        visualizations.push(id);
      continue;
    }
    const { lang, pairs, rest, nocheck } = syntax.parseCodeInfo(token.lang);
    out.write("void (");
    out.mapped(JSON.stringify(lang), infoStart, lang.length);
    out.write(" ");
    out.mapped("satisfies", infoStart, lang.length);
    out.write(" $CodeLang);\nvoid ({ ");
    for (const { key, value, keyStart, valueStart } of pairs) {
      out.mapped(JSON.stringify(key), infoStart + keyStart, key.length);
      out.write(": ");
      out.mapped(JSON.stringify(value), infoStart + valueStart, value.length);
      out.write(", ");
    }
    out.write("} satisfies $CodeMetaInput);\n");
    if (rest) {
      diagnostics.push({
        messageText: `After the language, a code block only takes key="value" pairs, not \`${rest}\`.`,
        start: infoStart,
        length: token.lang.length,
        code: CODE_INFO,
      });
    }
    if (lang === "ts" && !nocheck && content.startsWith(token.text, bodyStart))
      emitCode(out, token.text, bodyStart, imported);
  }

  out.write(
    `declare function $step(id: ${visualizations.map((id) => JSON.stringify(id)).join(" | ") || "never"}): void;\n`,
  );
  for (const { href, raw, block, start } of linksOf(content, blocks)) {
    const [, section, slug] = syntax.SITE_HREF.exec(href) ?? [];
    if (section === "writing" && slug) {
      const inRaw = raw.lastIndexOf(`/writing/${slug}`);
      out.write("$link(");
      if (start === undefined)
        out.mapped(JSON.stringify(slug), block.start, block.token.raw.trimEnd().length);
      else if (inRaw === -1) out.mapped(JSON.stringify(slug), start, raw.length);
      else out.mapped(JSON.stringify(slug), start + inRaw + "/writing/".length, slug.length);
      out.write(");\n");
      continue;
    }
    if (!href.startsWith("step:")) continue;
    const at = (start ?? block.start) + Math.max(0, raw.indexOf(href));
    const match = syntax.STEP_HREF.exec(href);
    if (!match?.[1]) {
      diagnostics.push({
        messageText: "A step link is step:<visualization id>/<step, from 1>, e.g. step:sync/2.",
        start: at,
        length: href.length,
        code: STEP_LINK,
      });
      continue;
    }
    out.write("$step(");
    out.mapped(JSON.stringify(match[1]), at + "step:".length, match[1].length);
    out.write(");\n");
  }

  const text = withoutCode(content, blocks);
  const notes = new Map(
    [...text.matchAll(syntax.FOOTNOTE_DEFINITION)].map((m) => [m[1] ?? "", m.index]),
  );
  const used = new Set<string>();
  for (const match of text.matchAll(syntax.FOOTNOTE_REF)) {
    const id = match[1] ?? "";
    used.add(id);
    if (!notes.has(id)) {
      diagnostics.push({
        messageText: `Footnote [^${id}] has no note: add a line \`[^${id}]: …\`.`,
        start: match.index,
        length: match[0].length,
        code: FOOTNOTE,
      });
    }
  }
  for (const [id, at] of notes) {
    if (used.has(id)) continue;
    diagnostics.push({
      messageText: `Footnote [^${id}] is never referenced in the text.`,
      start: at,
      length: id.length + 4,
      code: FOOTNOTE,
    });
  }

  return { text: out.text, extension: ".ts", mappings: out.mappings, diagnostics };
}

type Message = { id?: number | string; method?: string; params?: unknown };

function send(message: object) {
  const body = Buffer.from(JSON.stringify({ jsonrpc: "2.0", ...message }), "utf8");
  process.stdout.write(`Content-Length: ${body.length}\r\n\r\n`);
  process.stdout.write(body);
}

const decodeTransformParams = Schema.decodeUnknownResult(TransformParams);

async function answer(method: string | undefined, params: unknown) {
  switch (method) {
    case "initialize":
      return { result: { positionEncoding: "utf-16", diagnosticSource: "markdown" } };
    case "openProject":
      return { result: {} };
    case "closeProject":
      return { result: null };
    case "transform": {
      const decoded = decodeTransformParams(params);
      return Result.isSuccess(decoded)
        ? { result: await transform(decoded.success) }
        : { error: { code: -32602, message: decoded.failure.message } };
    }
    default:
      return { error: { code: -32601, message: `Unknown method: ${method}` } };
  }
}

async function handle({ id, method, params }: Message) {
  if (id === undefined) return;
  try {
    send({ id, ...(await answer(method, params)) });
  } catch (error) {
    send({ id, error: { code: -32603, message: String(error) } });
  }
}

let pending = Buffer.alloc(0);
process.stdin.on("data", (chunk: Buffer) => {
  pending = Buffer.concat([pending, chunk]);
  for (;;) {
    const headerEnd = pending.indexOf("\r\n\r\n");
    if (headerEnd === -1) return;
    const length = Number(
      /content-length: *(\d+)/i.exec(pending.toString("latin1", 0, headerEnd))?.[1],
    );
    const bodyStart = headerEnd + 4;
    if (pending.length < bodyStart + length) return;
    const message = JSON.parse(pending.toString("utf8", bodyStart, bodyStart + length)) as Message;
    pending = pending.subarray(bodyStart + length);
    void handle(message);
  }
});
