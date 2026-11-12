// A TypeScript 7.1 content mapper for the site's Markdown (src/content/**/*.md).
//
// TypeScript (tsrs, in the editor and in `vp run lint`) starts this process and asks
// it to turn each .md file into a small virtual TypeScript module, so mistakes show
// up in the Markdown itself while editing:
//
//   - writing frontmatter must satisfy FrontmatterInput (#lib/writing/frontmatter)
//   - every embed code block (```iframe …) must satisfy its EmbedInput (#lib/embeds/props)
//   - links to /writing/<slug> must name a piece that exists
//
// Each emitted value is mapped back to its span in the .md file, so errors point at
// the YAML value, key, or link that is wrong. Deeper checks (real dates, tended after
// planted) are Effect Schema's job at build time.
//
// Protocol: JSON-RPC over stdio, see https://github.com/microsoft/typescript-go/pull/4712
import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { marked, type Token } from "marked";
import { isMap, isScalar, isSeq, parseDocument } from "yaml";

/** [virtualStart, virtualLength, originalStart, originalLength, kind]; kind 1 = Atom (text differs). */
type SpanMapping = [number, number, number, number, 1];
type MapperDiagnostic = { messageText: string; start: number; length: number; code: number };
type TransformParams = { fileName: string; content: string };

const YAML_ERROR = 9001;
const MISSING_PROP = 9002;
const FRONTMATTER = /^---\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/;
/** A link to another piece, matched like the build does (src/lib/server/writing.ts). */
const WRITING_HREF = /^\/writing\/([^/#?]+)\/?(?:[#?].*)?$/;

/** Builds the virtual module text while recording which parts map back to the original. */
class Emitter {
  text = "";
  mappings: SpanMapping[] = [];
  write(text: string) {
    this.text += text;
  }
  mapped(text: string, originalStart: number, originalLength: number) {
    this.mappings.push([this.text.length, text.length, originalStart, originalLength, 1]);
    this.text += text;
  }
}

/** Emits the `key: value,` pairs of a YAML map (without braces). */
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

/** Emits a YAML node as a TypeScript literal. `offset` is where the YAML starts in the .md file. */
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

/** Parses YAML at `offset`, reporting syntax errors at their place in the .md file. */
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

/** The repository root: the nearest folder above the file that has the embed registry. */
function rootOf(fileName: string) {
  let dir = dirname(fileName);
  while (!existsSync(join(dir, "src/lib/embeds/props.ts"))) {
    const parent = dirname(dir);
    if (parent === dir) throw new Error(`No src/lib/embeds/props.ts above ${fileName}`);
    dir = parent;
  }
  return dir;
}

/** The parts of an Effect Schema struct the mapper reads: which fields are optional. */
type EmbedSchemas = Record<
  string,
  { fields: Record<string, { ast: { context?: { isOptional?: boolean } } }> }
>;

// Embed names and their required props come from the registry itself (plain `node`
// strips its types), so they always match what the build decodes.
const registries = new Map<string, Promise<Map<string, string[]>>>();
const embedsIn = (root: string) => {
  const cached = registries.get(root);
  if (cached) return cached;
  const registry = import(pathToFileURL(join(root, "src/lib/embeds/props.ts")).href).then(
    ({ embedProps }: { embedProps: EmbedSchemas }) =>
      new Map(
        Object.entries(embedProps).map(([name, { fields }]) => [
          name,
          Object.entries(fields).flatMap(([key, field]) =>
            field.ast.context?.isOptional ? [] : [key],
          ),
        ]),
      ),
  );
  registries.set(root, registry);
  return registry;
};

type Block = { token: Token; start: number };

/** The body's top-level Markdown blocks and where each starts; their raw text adds up to the source. */
function blocksOf(content: string, bodyStart: number) {
  const blocks: Block[] = [];
  let start = bodyStart;
  for (const token of marked.lexer(content.slice(bodyStart))) {
    blocks.push({ token, start });
    start += token.raw.length;
  }
  return blocks;
}

/**
 * Links to /writing/<slug>, found the way the build finds them (marked's link
 * tokens, so links in code don't count and reference-style links do), with where
 * each slug sits in `content`. Reference-style links map to their whole `[text][ref]`;
 * a link whose text marked normalized (one spanning lines in a quote) maps to its block.
 */
function writingLinks(content: string, blocks: Block[]) {
  const links: { slug: string; start: number; length: number }[] = [];
  for (const block of blocks) {
    let cursor = block.start;
    // walkTokens returns the callback's results; this callback only collects.
    void marked.walkTokens([block.token], (token: Token) => {
      const slug = token.type === "link" ? WRITING_HREF.exec(token.href)?.[1] : undefined;
      if (!slug) return;
      const start = content.indexOf(token.raw, cursor);
      if (start === -1) {
        links.push({ slug, start: block.start, length: block.token.raw.trimEnd().length });
        return;
      }
      cursor = start + token.raw.length;
      const inRaw = token.raw.lastIndexOf(`/writing/${slug}`);
      links.push(
        inRaw === -1
          ? { slug, start, length: token.raw.length }
          : { slug, start: start + inRaw + "/writing/".length, length: slug.length },
      );
    });
  }
  return links;
}

async function transform({ fileName, content }: TransformParams) {
  const root = rootOf(fileName);
  const embeds = await embedsIn(root);
  const writing = join(root, "src/content/writing");
  const slugs = (existsSync(writing) ? readdirSync(writing) : [])
    .filter((name) => name.endsWith(".md"))
    .map((name) => JSON.stringify(name.slice(0, -".md".length)));
  const out = new Emitter();
  const diagnostics: MapperDiagnostic[] = [];

  out.write('import type { FrontmatterInput } from "#lib/writing/frontmatter.ts";\n');
  out.write('import type { EmbedInput } from "#lib/embeds/props.ts";\n');
  out.write(`type WritingSlug = ${slugs.join(" | ") || "never"};\n`);
  out.write("declare function link(slug: WritingSlug): void;\n\n");

  const frontmatter = FRONTMATTER.exec(content);
  const blocks = blocksOf(content, frontmatter?.[0].length ?? 0);
  if (frontmatter && fileName.includes("/src/content/writing/")) {
    const offset = content.indexOf("\n") + 1;
    out.write("export const frontmatter = { ");
    emitPairs(out, parseYaml(frontmatter[1] ?? "", offset, diagnostics), offset);
    // "does not satisfy" errors land on the type, so map it to the opening ---.
    out.write("} satisfies ");
    out.mapped("FrontmatterInput", 0, 3);
    out.write(";\n");
  }

  // Like the build, only top-level code blocks named after an embed are embeds;
  // a fence shown inside another fence is just code.
  for (const { token, start } of blocks) {
    if (token.type !== "code" || typeof token.lang !== "string" || !embeds.has(token.lang))
      continue;
    const name = token.lang;
    const nameStart = start + token.raw.indexOf(name);
    const bodyStart = start + token.raw.indexOf("\n") + 1;
    const props = parseYaml(token.text, bodyStart, diagnostics);
    // A missing required prop is reported on the object, so map its brace to the block's name.
    // Wrong values and unknown keys, each mapped to its place in the YAML.
    out.write("void ({ ");
    emitPairs(out, props, bodyStart);
    out.write(`} satisfies Partial<EmbedInput<${JSON.stringify(name)}> & { wide?: boolean }>);\n`);
    // Missing required props are reported here, on the block's name: TypeScript can't
    // place that error inside the Markdown.
    const keys = new Set(
      isMap(props)
        ? props.items.flatMap(({ key }) => (isScalar(key) ? [String(key.value)] : []))
        : [],
    );
    const missing = (embeds.get(name) ?? []).filter((key) => !keys.has(key));
    if (missing.length) {
      diagnostics.push({
        messageText: `The \`${name}\` embed is missing required props: ${missing.join(", ")}.`,
        start: nameStart,
        length: name.length,
        code: MISSING_PROP,
      });
    }
  }

  for (const { slug, start, length } of writingLinks(content, blocks)) {
    out.write("link(");
    out.mapped(JSON.stringify(slug), start, length);
    out.write(");\n");
  }

  return { text: out.text, extension: ".ts", mappings: out.mappings, diagnostics };
}

// JSON-RPC 2.0 over stdio, framed like LSP: each message is a `Content-Length: <bytes>`
// header, a blank line, then the JSON. TypeScript sends requests; this answers them.

type Message = { id?: number | string; method?: string; params?: unknown };

function send(message: object) {
  const body = Buffer.from(JSON.stringify({ jsonrpc: "2.0", ...message }), "utf8");
  process.stdout.write(`Content-Length: ${body.length}\r\n\r\n`);
  process.stdout.write(body);
}

function answer(method: string | undefined, params: unknown) {
  switch (method) {
    case "initialize":
      return { positionEncoding: "utf-16", diagnosticSource: "markdown" };
    case "openProject":
      return {};
    case "closeProject":
      return null;
    case "transform":
      // The shape TypeScript sends for this request (see the protocol link above).
      return transform(params as TransformParams);
    default:
      return undefined;
  }
}

async function handle({ id, method, params }: Message) {
  // Notifications (no id) need no reply; none of them matter here.
  if (id === undefined) return;
  try {
    const result = await answer(method, params);
    if (result === undefined) {
      send({ id, error: { code: -32601, message: `Unknown method: ${method}` } });
    } else {
      send({ id, result });
    }
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
