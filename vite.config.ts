import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { baseAssetPaths } from "./plugins/base-asset-paths";

const shim = (p: string) => path.resolve(__dirname, "src/shims", p);
const mock = (p: string) => path.resolve(__dirname, "src/mocks", p);
const noop = shim("noop.ts");

// GitHub Pages serves this repo from a sub-path.
const BASE = process.env.PROTOTYPE_BASE ?? "/skydo-onboarding-prototype/";

export default defineConfig({
  base: BASE,
  plugins: [
    baseAssetPaths(path.resolve(__dirname, "public")),
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
      // the matched part of the string.
      { find: /^.*\/util\/beCall$/, replacement: mock("beCall.ts") },
      { find: /^.*apollo-client$/, replacement: mock("apolloClient.tsx") },
      { find: /^@apollo\/client$/, replacement: mock("apolloClient.tsx") },
      { find: /^@apollo\/client\/.*/, replacement: mock("apolloClient.tsx") },
      { find: /^axios$/, replacement: mock("axios.ts") },
      { find: /^.*\/authentication\/AuthHelper$/, replacement: mock("authHelper.ts") },
      { find: /^.*\/store\/useLoginStore$/, replacement: mock("loginStore.ts") },
      { find: /^.*\/Common\/PdfViewer$/, replacement: mock("nullComponent.tsx") },
      { find: /^.*pdf-worker(\.js)?$/, replacement: noop },
      { find: /^@react-oauth\/google$/, replacement: mock("googleOauth.tsx") },
      { find: /^.*\/analytics\/useAnalytics$/, replacement: mock("analytics.ts") },
      { find: /^.*\/analytics\/useSegment$/, replacement: mock("analytics.ts") },
      { find: /^.*\/analytics\/useTagManager$/, replacement: mock("analytics.ts") },
      { find: /^.*\/analytics\/loginJourney$/, replacement: noop },
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
