export type Issue = { title: string; description: string };
export type Field = keyof Issue;
export type Entry = { by: "user" | "github"; field: Field };
type Flow = "in" | "out";

export const FIELDS: Field[] = ["title", "description"];
export const AUTHOR: Record<Field, "user" | "someone"> = { title: "someone", description: "user" };

const before: Issue = { title: "Login fails", description: "" };
const firstEdit: Issue = { ...before, description: "After the update" };
const secondEdit: Issue = { ...before, description: "After update 2.3" };
const renamed: Issue = { ...before, title: "Login fails on iOS" };
const merged: Issue = { title: renamed.title, description: secondEdit.description };

const userEdits: Entry[] = [
  { by: "user", field: "description" },
  { by: "user", field: "description" },
];
const theirs: Entry = { by: "github", field: "title" };

export const steps: {
  title: string;
  detail: string;
  device: Issue;
  github: Issue;
  log: Entry[];
  sync?: { label: string; issue: Partial<Issue> };
  actor?: "user" | "someone";
  flow?: { database?: Flow; github?: Flow };
  lit?: { device?: Field[]; github?: Field[]; sync?: Field[]; log?: number };
}[] = [
  {
    title: "The user edits the description",
    detail: "saved and logged in one transaction",
    device: firstEdit,
    github: before,
    log: userEdits.slice(0, 1),
    actor: "user",
    lit: { device: ["description"], log: 0 },
  },
  {
    title: "Someone else renames it on GitHub",
    detail: "the API won't tell anyone",
    device: firstEdit,
    github: renamed,
    log: userEdits.slice(0, 1),
    actor: "someone",
    lit: { github: ["title"] },
  },
  {
    title: "The user edits it again",
    detail: "a second entry in the log",
    device: secondEdit,
    github: renamed,
    log: userEdits,
    actor: "user",
    lit: { device: ["description"], log: 1 },
  },
  {
    title: "The sync pulls GitHub's issue",
    detail: "GET /issues?since=<last sync>",
    device: secondEdit,
    github: renamed,
    log: userEdits,
    sync: { label: "pulled", issue: renamed },
    flow: { github: "in" },
  },
  {
    title: "GitHub's change is sorted into the log",
    detail: "undo the log, compare, append what GitHub changed",
    device: secondEdit,
    github: renamed,
    log: [...userEdits, theirs],
    sync: { label: "sorted", issue: { title: renamed.title } },
    flow: { database: "out" },
    lit: { sync: ["title"], log: 2 },
  },
  {
    title: "The log is replayed",
    detail: "the user's two edits, then GitHub's",
    device: secondEdit,
    github: renamed,
    log: [...userEdits, theirs],
    sync: { label: "replayed", issue: merged },
    flow: { database: "in" },
    lit: { sync: ["title", "description"] },
  },
  {
    title: "The full change goes to both sides",
    detail: "and the log is cleared",
    device: merged,
    github: merged,
    log: [],
    sync: { label: "pushed", issue: merged },
    flow: { database: "out", github: "out" },
    lit: { device: ["title"], github: ["description"] },
  },
];
