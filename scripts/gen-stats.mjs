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
  // Try to report why, then stop the build.
  let detail = "";
  try {
    const r = JSON.parse(fs.readFileSync(outFile, "utf8"));
    detail = ` (${r.numFailedTests} failing of ${r.numTotalTests})`;
  } catch { detail = ` (${String(err.stderr || err.message).split("\n")[0]})`; }
  console.error(`\n[gen-stats] Test suite did not pass${detail}.`);
  console.error("[gen-stats] Refusing to generate stats for a page that claims passing tests.\n");
  process.exit(1);
}
if (tests.failed > 0) {
  console.error(`\n[gen-stats] ${tests.failed} test(s) failing — not generating stats.\n`);
  process.exit(1);
}

/* ---- design system --------------------------------------------------- */
const tokensSrc = fs.readFileSync(rel("src/styles/tokens.js"), "utf8");
const spaceBlock = tokensSrc.match(/export const SPACE = \{([\s\S]*?)\}/)[1];
const spacingTokens = [...spaceBlock.matchAll(/(\d+)\s*:/g)].length;

const appCode = readAll(appFiles.filter((f) => f.includes(`screens${path.sep}`) || f.includes(`components${path.sep}`)));
const tokenisedSpacings = [...appCode.matchAll(/SPACE\[\d+\]|\bsp\([\d,\s]+\)/g)].length;
const components = [...readAll(walk("src/components")).matchAll(/^export function [A-Za-z]/gm)].length;
const screens = walk("src/screens").filter((f) => f.endsWith(".jsx")).length;
const assertions = [...readAll(testFiles).matchAll(/\bexpect\(/g)].length;

/* ---- provenance ------------------------------------------------------ */
// Vercel shallow-clones, so a local commit count would be wrong there. Record
// the commit we were built from instead — always available and unambiguous.
let commit = process.env.VERCEL_GIT_COMMIT_SHA || "";
try { if (!commit) commit = sh("git rev-parse HEAD"); } catch { /* not a git checkout */ }
const shortSha = commit ? commit.slice(0, 7) : null;

const pkg = JSON.parse(fs.readFileSync(rel("package.json"), "utf8"));

const stats = {
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
  sourceFiles: appFiles.length,
  sourceLines: lines(appFiles),
  spacingTokens,
  tokenisedSpacings,
};

fs.mkdirSync(rel("src/case-study"), { recursive: true });
fs.writeFileSync(rel("src/case-study/stats.generated.json"), JSON.stringify(stats, null, 2) + "\n");

console.log(`[gen-stats] ${stats.tests} tests passing · ${stats.screens} screens · ${stats.components} components · ${stats.sourceLines} lines @ ${shortSha || "no-git"}`);
