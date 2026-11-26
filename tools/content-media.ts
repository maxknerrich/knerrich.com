import { existsSync, globSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import type { ViteUserConfig } from "vite-plus";
import { parse } from "yaml";

type Plugin = Extract<NonNullable<ViteUserConfig["plugins"]>[number], { name: string }>;

const ID = "virtual:content-media";
const RESOLVED = `\0${ID}`;
const UNPUBLISHED = "\0unpublished:";

const QUERIES = new Map([
  ["pictures", "?enhanced&w=1920;1600;1440;1280;1120;750;640"],
  ["cards", "?enhanced&w=1920;1280;960;800;640"],
  ["posters", "?format=avif&as=picture"],
  ["drawings", "?url"],
  ["videos", "?url"],
] as const);
type Kind = Parameters<typeof QUERIES.get>[0];

const MARKDOWN = [
  "src/content/projects/*/index.md",
  "src/content/writing/*.md",
  "src/content/writing/*/index.md",
];
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const REFERENCE =
  /(poster:\s*["']?)?(?<![\w./])(\.\/[^\s"'()<>]+?\.(jpe?g|png|webp|svg|mp4))(?![^\s"'()<>])/gi;

function frontmatter(markdown: string) {
  try {
    const data: unknown = parse(FRONTMATTER.exec(markdown)?.[1] ?? "");
    return new Map<string, unknown>(typeof data === "object" && data ? Object.entries(data) : []);
  } catch {
    return new Map<string, unknown>();
  }
}

const isProject = (path: string) => path.startsWith("/src/content/projects/");

function isPublished(path: string, markdown: string) {
  const data = frontmatter(markdown);
  return isProject(path) ? data.get("draft") !== true : data.get("stage") !== "seed";
}

const kindOf = (extension: string, poster: boolean): Kind =>
  extension === "mp4"
    ? "videos"
    : extension === "svg"
      ? "drawings"
      : poster
        ? "posters"
        : "pictures";

function scan(root: string) {
  const media = new Map([...QUERIES.keys()].map((kind) => [kind, new Set<string>()]));
  const unpublished: string[] = [];
  for (const file of globSync(MARKDOWN, { cwd: root })) {
    if (file.endsWith("TEMPLATE.md")) continue;
    const path = `/${file}`;
    const folder = posix.dirname(path);
    const markdown = readFileSync(join(root, file), "utf8");
    if (!isPublished(path, markdown)) {
      if (path.endsWith("/index.md")) unpublished.push(`${folder}/`);
      continue;
    }
    const found = [...markdown.matchAll(REFERENCE)].map(
      ([, poster, href = "", extension = ""]) =>
        [kindOf(extension.toLowerCase(), poster !== undefined), posix.join(folder, href)] as const,
    );
    if (isProject(path)) found.push(["cards", `${folder}/card.jpg`]);
    for (const [kind, asset] of found)
      if (existsSync(join(root, asset))) media.get(kind)?.add(asset);
  }
  return { media, unpublished };
}

function buildModule(media: Map<Kind, Set<string>>) {
  const imports: string[] = [];
  const exports = [...media].map(([kind, assets]) => {
    const entries = [...assets].toSorted().map((asset) => {
      const name = `asset${imports.length}`;
      imports.push(`import ${name} from ${JSON.stringify(`${asset}${QUERIES.get(kind) ?? ""}`)};`);
      return `${JSON.stringify(asset)}: ${name}`;
    });
    return `export const ${kind} = { ${entries.join(", ")} };`;
  });
  return [...imports, ...exports].join("\n");
}

const glob = (pattern: string, kind: Kind) =>
  `import.meta.glob(${JSON.stringify(pattern)}, { eager: true, import: "default", query: ${JSON.stringify(QUERIES.get(kind) ?? "")} })`;

const DEV_MODULE = [
  `export const pictures = ${glob("/src/content/**/*.{jpg,jpeg,png,webp}", "pictures")};`,
  `export const cards = ${glob("/src/content/projects/*/card.jpg", "cards")};`,
  `export const posters = pictures;`,
  `export const drawings = ${glob("/src/content/**/*.svg", "drawings")};`,
  `export const videos = ${glob("/src/content/**/*.mp4", "videos")};`,
].join("\n");

export function contentMedia(): Plugin {
  let root = "";
  let build = false;
  let unpublished: string[] = [];
  let code = DEV_MODULE;
  return {
    name: "knerrich:content-media",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
      build = config.command === "build";
      if (!build) return;
      const scanned = scan(root);
      unpublished = scanned.unpublished;
      code = buildModule(scanned.media);
    },
    async resolveId(source, importer) {
      if (source === ID) return RESOLVED;
      if (!build || !source.endsWith(".svelte")) return undefined;
      const resolved = await this.resolve(source, importer, { skipSelf: true });
      const path = resolved && `/${posix.relative(root, resolved.id)}`;
      return path && unpublished.some((folder) => path.startsWith(folder))
        ? UNPUBLISHED + path
        : undefined;
    },
    load(id) {
      if (id === RESOLVED) return code;
      if (!id.startsWith(UNPUBLISHED)) return undefined;
      const message = `${id.slice(UNPUBLISHED.length)} sits beside an unpublished piece, which a build leaves out`;
      return `throw new Error(${JSON.stringify(message)});`;
    },
  };
}
