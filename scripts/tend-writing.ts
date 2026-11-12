// Run by .vite-hooks/pre-commit for every staged writing piece in src/content/writing/:
//
// - Every staged piece's frontmatter is validated; a bad one blocks the commit.
// - New pieces get a missing `planted` set to today, and a missing `tended` set to `planted`.
// - When a commit changes a piece's `tended` date (bumped by hand for a meaningful
//   update), the previously committed file is saved to
//   .versions/<slug>/<previous tended>.md and staged with it. Edits that keep the
//   date, like typo fixes, change nothing.
//
// Dates are filled in the staged file and the working copy separately, so partially
// staged files stay partial.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { Data, Effect } from "effect";
import { hasField, setField, splitFrontmatter } from "../src/lib/writing/frontmatter.ts";

const WRITING = "src/content/writing";

class GitError extends Data.TaggedError("GitError")<{ readonly message: string }> {}

const git = (args: string[], input?: string) =>
  Effect.try({
    try: () =>
      execFileSync("git", args, { encoding: "utf8", input, stdio: ["pipe", "pipe", "pipe"] }),
    catch: (error) => new GitError({ message: `git ${args.join(" ")} failed: ${String(error)}` }),
  });

/** A new piece's text with missing dates filled in from its own frontmatter: `planted` defaults to today, `tended` to `planted`. */
const withDates = (markdown: string, path: string) =>
  Effect.gen(function* () {
    const { meta } = yield* splitFrontmatter(markdown, path);
    const planted = hasField(markdown, "planted")
      ? markdown
      : setField(markdown, "planted", meta.planted);
    return hasField(planted, "tended") ? planted : setField(planted, "tended", meta.planted);
  });

/**
 * Fills in missing dates on a new piece, in the staged blob and in the working
 * copy separately, so a partially staged file keeps its unstaged edits.
 */
const plant = (path: string, staged: string) =>
  Effect.gen(function* () {
    const filled = yield* withDates(staged, path);
    if (filled !== staged) {
      const blob = (yield* git(["hash-object", "-w", "--stdin"], filled)).trim();
      const [mode] = (yield* git(["ls-files", "-s", "--", path])).split(" ");
      yield* git(["update-index", "--cacheinfo", `${mode},${blob},${path}`]);
    }
    // Unstaged edits aren't being committed, so frontmatter that doesn't parse there is left alone.
    const working = readFileSync(path, "utf8");
    const workingFilled = yield* withDates(working, path).pipe(Effect.orElseSucceed(() => working));
    if (workingFilled !== working) writeFileSync(path, workingFilled);
  });

/** Saves the committed version when this commit moves the piece's `tended` date. */
const tend = (path: string, markdown: string) =>
  Effect.gen(function* () {
    const committed = yield* git(["show", `HEAD:${path}`]);
    const before = (yield* splitFrontmatter(committed, `HEAD:${path}`)).meta.tended;
    const after = (yield* splitFrontmatter(markdown, path)).meta.tended;
    if (before === after) return;
    const target = `${WRITING}/.versions/${basename(path, ".md")}/${before}.md`;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, committed);
    yield* git(["add", target]);
    yield* Effect.log(`Saved the ${before} version of ${path}`);
  });

const program = Effect.gen(function* () {
  const staged = (yield* git([
    "diff",
    "--cached",
    "--name-status",
    "--diff-filter=AM",
    "--",
    `${WRITING}/*.md`,
  ]))
    .split("\n")
    .filter(Boolean)
    .map((line): string[] => line.split("\t"))
    .filter(([, path]) => path !== undefined && dirname(path) === WRITING);

  for (const [status, path] of staged) {
    const markdown = yield* git(["show", `:${path}`]);
    yield* status === "A" ? plant(path, markdown) : tend(path, markdown);
  }
});

// A failure (bad frontmatter, git error) prints its message and blocks the commit.
Effect.runFork(
  program.pipe(
    Effect.catch((error) =>
      Effect.sync(() => {
        console.error(error.message);
        process.exitCode = 1;
      }),
    ),
  ),
);
