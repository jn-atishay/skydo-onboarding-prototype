// The product embeds a few YouTube videos (customer testimonials on the home page,
// how-to clips elsewhere). An embed loads from YouTube as soon as the page opens, and
// the prototype sends nothing off the page, so each embed address is pointed at a
// small local placeholder instead. Plain links to videos are left alone: they only
// leave the page if someone clicks them.
import path from "path";
import type { Plugin } from "vite";

const EMBED = /https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/[^"'`\s]+/g;

export function noOutsideEmbeds(): Plugin {
  let base = "/";
  return {
    name: "skydo-no-outside-embeds",
    enforce: "pre",
    configResolved(config) {
      base = config.base || "/";
    },
    transform(code, id) {
      if (!/\.(tsx?|jsx?)$/.test(id)) return null;
      if (!id.includes(`${path.sep}src${path.sep}skydo${path.sep}`)) return null;
      if (!EMBED.test(code)) return null;
      EMBED.lastIndex = 0;
      return { code: code.replace(EMBED, `${base.replace(/\/$/, "")}/video-placeholder.html`), map: null };
    },
  };
}
