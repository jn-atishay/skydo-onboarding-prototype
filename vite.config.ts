import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { baseAssetPaths } from "./plugins/base-asset-paths";
import { noOutsideEmbeds } from "./plugins/no-outside-embeds";

const shim = (p: string) => path.resolve(__dirname, "src/shims", p);
const mock = (p: string) => path.resolve(__dirname, "src/mocks", p);
const noop = shim("noop.ts");

// GitHub Pages serves this repo from a sub-path.
const BASE = process.env.PROTOTYPE_BASE ?? "/skydo-onboarding-prototype/";

export default defineConfig({
  base: BASE,
  plugins: [
    baseAssetPaths(path.resolve(__dirname, "public")),
    noOutsideEmbeds(),
    react(),
    svgr({ include: "**/*.svg" }),
  ],
  resolve: {
    alias: [
      // --- Next.js runtime, replaced by small stand-ins -------------------
      { find: /^next\/router$/, replacement: shim("next-router.tsx") },
      { find: /^next\/image$/, replacement: shim("next-image.tsx") },
      { find: /^next\/link$/, replacement: shim("next-link.tsx") },
      { find: /^next\/head$/, replacement: shim("next-head.tsx") },
      { find: /^next\/dynamic$/, replacement: shim("next-dynamic.tsx") },
      { find: /^next\/script$/, replacement: mock("nextScript.tsx") },
      { find: /^next\/app$/, replacement: noop },
      { find: /^next\/document$/, replacement: noop },
      { find: /^next$/, replacement: noop },

      // --- analytics & monitoring: inert, nothing is sent anywhere --------
      { find: /^@sentry\/.*/, replacement: noop },
      { find: /^@segment\/.*/, replacement: noop },
      { find: /^react-gtm-module$/, replacement: noop },
      { find: /^@usersnap\/browser$/, replacement: noop },

      // --- server-only packages that must never reach the browser ---------
      { find: /^ioredis$/, replacement: noop },
      { find: /^request-ip$/, replacement: noop },
      { find: /^form-data$/, replacement: noop },
      { find: /^nookies$/, replacement: mock("cookies.ts") },

      // --- heavy viewers the onboarding screens do not need ---------------
      { find: /^react-pdf$/, replacement: noop },
      { find: /^pdfjs-dist.*/, replacement: noop },
      { find: /^@reactour\/.*/, replacement: mock("reactour.tsx") },

      // --- the network layer: fixtures instead of a backend ---------------
      // These regexes must match the WHOLE module id, because Vite replaces only
      // the matched part of the string. They match on the file name alone, so a
      // same-folder import such as "./beCall" is caught as well as "../util/beCall".
      { find: /^(.*\/)?beCall$/, replacement: mock("beCall.ts") },
      { find: /^.*apollo-client$/, replacement: mock("apolloClient.tsx") },
      { find: /^@apollo\/client$/, replacement: mock("apolloClient.tsx") },
      { find: /^@apollo\/client\/.*/, replacement: mock("apolloClient.tsx") },
      { find: /^axios$/, replacement: mock("axios.ts") },
      { find: /^(.*\/)?AuthHelper$/, replacement: mock("authHelper.ts") },
      { find: /^(.*\/)?useLoginStore$/, replacement: mock("loginStore.ts") },
      { find: /^(.*\/)?PdfViewer$/, replacement: mock("nullComponent.tsx") },
      { find: /^.*pdf-worker(\.js)?$/, replacement: noop },
      { find: /^(.*\/)?WithAuth$/, replacement: mock("withAuth.tsx") },
      { find: /^react-calendly$/, replacement: mock("calendly.tsx") },
      { find: /^@react-oauth\/google$/, replacement: mock("googleOauth.tsx") },
      { find: /^(.*\/)?useAnalytics$/, replacement: mock("analytics.ts") },
      { find: /^(.*\/)?useSegment$/, replacement: mock("analytics.ts") },
      { find: /^(.*\/)?useTagManager$/, replacement: mock("analytics.ts") },
      { find: /^(.*\/)?loginJourney$/, replacement: noop },
    ],
  },
  define: {
    "process.env": "{}",
    "process.browser": "true",
    global: "globalThis",
  },
  build: {
    outDir: "docs",
    emptyOutDir: true,
    chunkSizeWarningLimit: 2500,
sourcemap: false,
  },
});
