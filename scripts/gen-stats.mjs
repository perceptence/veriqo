#!/usr/bin/env node
/* ============================================================================
   Generate the case study's figures from the repository itself.

   Runs before `dev` and `build` (npm pre-scripts), so the numbers on
   /case-study can never drift from the code they describe. Writes
   src/case-study/stats.generated.json, which data.js imports.

   The test count comes from actually running the suite — not from counting
   `it(` calls — so the page can only ever claim a number the suite really
   produced. If the suite fails, this exits non-zero and the build stops:
   a broken suite should never ship a page that boasts about passing tests.
============================================================================ */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => path.join(root, p);
const sh = (cmd) => execSync(cmd, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

/* ---- file walking ---------------------------------------------------- */
const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(rel(dir), { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};
const srcFiles = walk("src").filter((f) => /\.(jsx?|css)$/.test(f));
const isTest = (f) => f.includes(`src${path.sep}test${path.sep}`);
// The case study is documentation *about* the product, so it's excluded from
// product-scope figures — counting it would inflate what the app itself is.
const isCaseStudy = (f) => f.includes(`src${path.sep}case-study${path.sep}`);
const appFiles = srcFiles.filter((f) => !isTest(f) && !isCaseStudy(f));
const testFiles = srcFiles.filter((f) => /\.test\.jsx?$/.test(f));
const lines = (files) => files.reduce((n, f) => n + fs.readFileSync(rel(f), "utf8").split("\n").length, 0);
const readAll = (files) => files.map((f) => fs.readFileSync(rel(f), "utf8")).join("\n");

/* ---- design system --------------------------------------------------- */
const tokensSrc = fs.readFileSync(rel("src/styles/tokens.js"), "utf8");
const spaceBlock = tokensSrc.match(/export const SPACE = \{([\s\S]*?)\}/)[1];
const spacingTokens = [...spaceBlock.matchAll(/(\d+)\s*:/g)].length;

const appCode = readAll(appFiles.filter((f) => f.includes(`screens${path.sep}`) || f.includes(`components${path.sep}`)));
const tokenisedSpacings = [...appCode.matchAll(/SPACE\[\d+\]|\bsp\([\d,\s]+\)/g)].length;
const components = [...readAll(walk("src/components")).matchAll(/^export function [A-Za-z]/gm)].length;
const screens = walk("src/screens").filter((f) => f.endsWith(".jsx")).length;
const assertions = [...readAll(testFiles).matchAll(/\bexpect\(/g)].length;

/* Distinct states the app routes between — every `view === "x"` branch in the
   root component. A truer measure of product surface than a file count: one
   screen file can serve several states (verify alone has five). */
const appStates = new Set(
  [...fs.readFileSync(rel("src/App.jsx"), "utf8").matchAll(/view === "([A-Za-z]+)"/g)].map((m) => m[1])
).size;

/* ---- accessibility: WCAG 2.1 contrast, computed from the live tokens --- */
const hexToRgb = (h) => { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const relLum = (rgb) => { const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [l1, l2] = [relLum(hexToRgb(a)), relLum(hexToRgb(b))].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };

const pick = (name) => tokensSrc.match(new RegExp(`${name}:\\s*"(#[0-9A-Fa-f]{6})"`))?.[1];
const T = Object.fromEntries(["bone", "paper", "ink", "sub", "faint", "acc", "accDeep", "glow"].map((k) => [k, pick(k)]));

/* Status colours live in a nested object, so lift their text/bg pairs out by
   name. These used to go unaudited — three of them were failing. */
const statusPair = (name) => {
  const block = tokensSrc.match(new RegExp(`${name}:\\s*\\{([^}]*)\\}`))[1];
  const grab = (k) => block.match(new RegExp(`${k}:\\s*"(#[0-9A-Fa-f]{6})"`))?.[1];
  return { fg: grab("text"), bg: grab("bg") };
};

const contrastPairs = [
  ["Body text", T.ink, T.bone, "ink", "bone"],
  ["Body text on cards", T.ink, T.paper, "ink", "paper"],
  ["Secondary text", T.sub, T.bone, "sub", "bone"],
  ["Secondary on cards", T.sub, T.paper, "sub", "paper"],
  ["Metadata", T.faint, T.bone, "faint", "bone"],
  ["Metadata on cards", T.faint, T.paper, "faint", "paper"],
  ["Accent text", T.accDeep, T.bone, "accDeep", "bone"],
  ["Text on dark", T.glow, T.ink, "glow", "ink"],
  ...["warning", "error", "danger"].map((s) => {
    const { fg, bg } = statusPair(s);
    return [`${s[0].toUpperCase()}${s.slice(1)} status`, fg, bg, `${s}.text`, `${s}.bg`];
  }),
].map(([label, fgHex, bgHex, fg, bg]) => {
  const r = +contrast(fgHex, bgHex).toFixed(2);
  return { label, fg, bg, fgHex, bgHex, ratio: r, aa: r >= 4.5, aaLarge: r >= 3 };
});
const a11y = {
  pairsChecked: contrastPairs.length,
  passingAA: contrastPairs.filter((p) => p.aa).length,
  pairs: contrastPairs,
};

/* ---- provenance ------------------------------------------------------ */
// Vercel shallow-clones, so a local commit count would be wrong there. Record
// the commit we were built from instead — always available and unambiguous.
let commit = process.env.VERCEL_GIT_COMMIT_SHA || "";
try { if (!commit) commit = sh("git rev-parse HEAD"); } catch { /* not a git checkout */ }
const shortSha = commit ? commit.slice(0, 7) : null;

const pkg = JSON.parse(fs.readFileSync(rel("package.json"), "utf8"));
const statsPath = rel("src/case-study/stats.generated.json");
const previous = fs.existsSync(statsPath) ? JSON.parse(fs.readFileSync(statsPath, "utf8")) : {};

const build = (tests) => ({
  generatedAt: new Date().toISOString().slice(0, 10),
  commit: shortSha,
  version: pkg.version,
  tests: tests.total,
  testSuites: tests.suites,
  testFiles: testFiles.length,
  testLines: lines(testFiles),
  assertions,
  screens,
  components,
  appStates,
  sourceFiles: appFiles.length,
  sourceLines: lines(appFiles),
  spacingTokens,
  tokenisedSpacings,
  a11y,
});

const write = (stats) => {
  fs.mkdirSync(rel("src/case-study"), { recursive: true });
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2) + "\n");
};

/* Write everything measurable BEFORE running the suite.

   The suite imports this file. Without a provisional write, adding a new
   generated figure deadlocks: the tests can't pass until the field exists,
   and the field can't be written until the tests pass. Carrying the previous
   test numbers forward for one run breaks that cycle.

   It doesn't weaken the guarantee — the guarantee is the non-zero exit below,
   which stops the build. A stats file on disk publishes nothing on its own. */
write(build({ total: previous.tests ?? 0, suites: previous.testSuites ?? 0 }));

/* ---- run the real suite ---------------------------------------------- */
const outFile = rel("node_modules/.veriqo-test-results.json");
let tests;
try {
  execSync(`npx vitest run --reporter=json --outputFile=${JSON.stringify(outFile)}`, {
    cwd: root, stdio: ["ignore", "ignore", "pipe"],
  });
  const r = JSON.parse(fs.readFileSync(outFile, "utf8"));
  tests = { total: r.numTotalTests, passed: r.numPassedTests, failed: r.numFailedTests, suites: r.numTotalTestSuites };
} catch (err) {
  let detail = "";
  try {
    const r = JSON.parse(fs.readFileSync(outFile, "utf8"));
    detail = ` (${r.numFailedTests} failing of ${r.numTotalTests})`;
  } catch { detail = ` (${String(err.stderr || err.message).split("\n")[0]})`; }
  console.error(`\n[gen-stats] Test suite did not pass${detail}.`);
  console.error("[gen-stats] Refusing to publish a page that claims passing tests.\n");
  process.exit(1);
}
if (tests.failed > 0) {
  console.error(`\n[gen-stats] ${tests.failed} test(s) failing — stopping the build.\n`);
  process.exit(1);
}

const stats = build(tests);
write(stats);

console.log(`[gen-stats] ${stats.tests} tests passing · ${stats.screens} screens · ${stats.appStates} states · ${stats.components} components @ ${shortSha || "no-git"}`);
