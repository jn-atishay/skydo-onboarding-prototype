// Resolves the product's own Tailwind config into a plain JSON theme, which the
// components read through AppContext exactly as the real app does.
const fs = require("fs");
const path = require("path");
const resolveConfig = require("tailwindcss/resolveConfig");
const config = require("../tailwind.config.cjs");

const theme = resolveConfig(config).theme || {};
const out = path.join(__dirname, "..", "src", "prototype", "theme.json");
fs.writeFileSync(out, JSON.stringify(theme, null, 0));
console.log("wrote", out, Object.keys(theme).length, "theme keys");
