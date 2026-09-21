// The product's components reference images by absolute path, for example
// "/bg-image-login.png", because the real app is served from the root of a domain.
// This site is served from a sub-path on GitHub Pages, so those paths would 404.
//
// This plugin rewrites such a literal to the base-prefixed path, but only when the
// file really exists in public/. Anything else is left alone, so a genuine API path
// like "/swagat/api/..." is never touched. Vite already does this for CSS url().
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

const ASSET = /\.(svg|png|jpe?g|webp|gif|avif|json|ttf|woff2?|lottie)$/i;

export function baseAssetPaths(publicDir: string): Plugin {
  let base = "/";
  const exists = new Map<string, boolean>();

  const isRealAsset = (p: string) => {
    if (!ASSET.test(p)) return false;
    if (exists.has(p)) return exists.get(p)!;
    const ok = fs.existsSync(path.join(publicDir, p.replace(/^\//, "")));
    exists.set(p, ok);
    return ok;
  };

  return {
    name: "skydo-base-asset-paths",
    enforce: "pre",
    configResolved(config) {
      base = config.base || "/";
    },
    transform(code, id) {
      if (base === "/") return null;
      if (!/\.(tsx?|jsx?)$/.test(id)) return null;
      if (!id.includes(`${path.sep}src${path.sep}skydo${path.sep}`)) return null;
      if (!code.includes('"/') && !code.includes("'/")) return null;

      let changed = false;
      const out = code.replace(/(["'])(\/[A-Za-z0-9_./-]+)\1/g, (whole, quote, p) => {
        if (!isRealAsset(p)) return whole;
        changed = true;
        return `${quote}${base.replace(/\/$/, "")}${p}${quote}`;
      });

      return changed ? { code: out, map: null } : null;
    },
  };
}
