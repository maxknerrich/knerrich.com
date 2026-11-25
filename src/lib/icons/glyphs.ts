import github from "./github.svg?raw";
import linkedin from "./linkedin.svg?raw";
import x from "./x.svg?raw";
import rss from "./rss.svg?raw";
import soundOn from "./sound-on.svg?raw";
import soundOff from "./sound-off.svg?raw";
import arrow from "./arrow.svg?raw";
import email from "./email.svg?raw";
import close from "./close.svg?raw";
import back from "./back.svg?raw";
import previous from "./previous.svg?raw";
import next from "./next.svg?raw";
import play from "./play.svg?raw";
import replies from "./replies.svg?raw";
import likes from "./likes.svg?raw";
import link from "./link.svg?raw";
import dragHandle from "./drag-handle.svg?raw";
import note from "./note.svg?raw";
import tip from "./tip.svg?raw";
import important from "./important.svg?raw";
import warning from "./warning.svg?raw";
import caution from "./caution.svg?raw";
import pixelPlay from "./pixel-play.svg?raw";
import pixelPause from "./pixel-pause.svg?raw";
import pixelReplay from "./pixel-replay.svg?raw";
import pixelCopy from "./pixel-copy.svg?raw";
import pixelCopied from "./pixel-copied.svg?raw";
import pixelPrevious from "./pixel-previous.svg?raw";
import pixelNext from "./pixel-next.svg?raw";
import pixelExpand from "./pixel-expand.svg?raw";
import table from "./table.svg?raw";
import pixelLaptop from "./pixel-laptop.svg?raw";
import pixelDatabase from "./pixel-database.svg?raw";
import pixelSync from "./pixel-sync.svg?raw";
import pixelGithub from "./pixel-github.svg?raw";
import pixelCloud from "./pixel-cloud.svg?raw";
import pixelList from "./pixel-list.svg?raw";
import pixelUser from "./pixel-user.svg?raw";
import pixelZap from "./pixel-zap.svg?raw";
import pixelOffline from "./pixel-offline.svg?raw";
import pixelHourglass from "./pixel-hourglass.svg?raw";
import pixelEye from "./pixel-eye.svg?raw";
import pixelRequests from "./pixel-requests.svg?raw";
import pixelArchive from "./pixel-archive.svg?raw";
import pixelSpeed from "./pixel-speed.svg?raw";
import pixelSparkle from "./pixel-sparkle.svg?raw";
import pixelBrush from "./pixel-brush.svg?raw";
import cross from "./cross.svg?raw";
import porsche from "../logos/porsche.svg?raw";
import tldraw from "../logos/tldraw.svg?raw";
import lwWorks from "../logos/lw-works.svg?raw";
import knerrich from "../logos/knerrich.svg?raw";

const sources = {
  github,
  linkedin,
  x,
  rss,
  soundOn,
  soundOff,
  arrow,
  email,
  close,
  back,
  previous,
  next,
  play,
  replies,
  likes,
  link,
  dragHandle,
  note,
  tip,
  important,
  warning,
  caution,
  pixelPlay,
  pixelPause,
  pixelReplay,
  pixelCopy,
  pixelCopied,
  pixelPrevious,
  pixelNext,
  pixelExpand,
  table,
  pixelLaptop,
  pixelDatabase,
  pixelSync,
  pixelGithub,
  pixelCloud,
  pixelList,
  pixelUser,
  pixelZap,
  pixelOffline,
  pixelHourglass,
  pixelEye,
  pixelRequests,
  pixelArchive,
  pixelSpeed,
  pixelSparkle,
  pixelBrush,
  cross,
  porsche,
  tldraw,
  lwWorks,
  knerrich,
};

export type IconName = keyof typeof sources;

export const isIconName = (name: string): name is IconName => Object.hasOwn(sources, name);

const ROOT = /^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/;
const ATTRIBUTE = /([\w:-]+)="([^"]*)"/g;

export function glyph(name: IconName) {
  const [, root = "", inner = ""] = ROOT.exec(sources[name]) ?? [];
  const attributes = Object.fromEntries(
    [...root.matchAll(ATTRIBUTE)].flatMap(([, key = "", value = ""]) =>
      key === "xmlns" ? [] : [[key, value]],
    ),
  );
  return { attributes, inner: inner.trim() };
}
