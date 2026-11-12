import { Effect } from "effect";
import { expect, test } from "vite-plus/test";
import { setField, splitFrontmatter, today } from "./frontmatter";

const split = (markdown: string) => Effect.runSync(splitFrontmatter(markdown, "piece.md"));
const failure = (markdown: string) =>
  Effect.runSync(Effect.flip(splitFrontmatter(markdown, "piece.md"))).message;

test("reads frontmatter and keeps changelog notes by date", () => {
  const { meta, body } = split(
    "---\nstage: budding\nplanted: 2026-02-14\ntended: 2026-06-20\nchangelog:\n  2026-06-20: Grew a bit.\n---\n# Title\n",
  );
  expect(meta).toEqual({
    stage: "budding",
    planted: "2026-02-14",
    tended: "2026-06-20",
    changelog: { "2026-06-20": "Grew a bit." },
  });
  expect(body).toBe("# Title\n");
});

test("a piece without frontmatter is a seedling planted today", () => {
  const { meta, body } = split("# Title\n");
  expect(meta).toMatchObject({ stage: "seedling", planted: today(), tended: today() });
  expect(body).toBe("# Title\n");
});

test("rejects bad values with the file and field in the message", () => {
  expect(failure("---\nstage: tree\n---\n")).toMatch(/^piece\.md: .*seedling[\s\S]*\["stage"\]/);
  expect(failure("---\nplanted: 2026-02-30\n---\n")).toMatch(/2026-02-30 is not a real date/);
  expect(failure("---\nplanted: 2026-05-01\ntended: 2026-01-01\n---\n")).toMatch(
    /can't be before planted \(2026-05-01\)/,
  );
});

test("rejects frontmatter without its closing ---, unknown fields and non-date changelog keys", () => {
  expect(failure("---\nplanted: [\n# Title\n")).toMatch(
    /^piece\.md: frontmatter has no closing ---/,
  );
  expect(failure("---\ntitle: Hello\n---\n")).toMatch(/^piece\.md: /);
  expect(failure("---\nchangelog:\n  nonsense: A note.\n---\n")).toMatch(/^piece\.md: /);
});

test("setField replaces a field, adds a missing one, or adds the whole block", () => {
  const piece = "---\nstage: budding\ntended: 2026-01-01\n---\n# Title\n";
  expect(setField(piece, "tended", "2026-02-02")).toBe(
    "---\nstage: budding\ntended: 2026-02-02\n---\n# Title\n",
  );
  expect(setField(piece, "planted", "2026-01-01")).toBe(
    "---\nstage: budding\ntended: 2026-01-01\nplanted: 2026-01-01\n---\n# Title\n",
  );
  expect(setField("# Title\n", "planted", "2026-01-01")).toBe(
    "---\nplanted: 2026-01-01\n---\n\n# Title\n",
  );
});
