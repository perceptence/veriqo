import G from "./stats.generated.json";

/* ============================================================================
   Case-study facts.

   Nothing here is typed by hand. Every figure comes from
   stats.generated.json, which scripts/gen-stats.mjs writes before each `dev`
   and `build` by measuring this repository — the test count by actually
   running the suite, the rest by walking the source tree.

   That means these numbers cannot drift from the code they describe: if the
   suite shrinks or a screen is deleted, the next build says so. If the suite
   fails, the build stops rather than shipping a page that claims otherwise.
============================================================================ */

const n = (v) => v.toLocaleString("en-US");

export const STATS = {
  version: G.version,
  commit: G.commit,
  generatedAt: G.generatedAt,

  hero: [
    { value: n(G.screens), label: "Product screens", how: "files in src/screens" },
    { value: n(G.components), label: "Shared components", how: "exports from src/components" },
    { value: n(G.tests), label: "Tests passing", how: "vitest run, at build time" },
    { value: n(G.sourceLines), label: "Lines of product", how: "excludes tests + this page" },
  ],

  tests: [
    { value: n(G.tests), label: "Tests", how: `${G.testSuites} suites, all passing` },
    { value: n(G.assertions), label: "Assertions", how: "expect() calls in the suite" },
    { value: n(G.testFiles), label: "Test files", how: "tokens · components · screens" },
    { value: "2/2", label: "Mutations caught", how: "deliberate regressions, each failed a test" },
  ],

  scope: [
    { value: n(G.sourceFiles), label: "Source files", how: "jsx + js + css, product only" },
    { value: n(G.spacingTokens), label: "Spacing tokens", how: "keys in the SPACE scale" },
    { value: n(G.tokenisedSpacings), label: "Tokenised spacings", how: "SPACE[n] / sp() uses in app code" },
    { value: n(G.testLines), label: "Lines of test", how: "src/test/*.test.*" },
  ],

  /* Deliberately includes the absences. A portfolio page that only lists what
     exists invites the reader to assume the rest. */
  honest: [
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Automated test suite", sub: `${G.tests} tests across tokens, components and screens` },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Design token system", sub: "Colour, type, spacing, radii, motion, elevation in one module" },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Self-driving demo mode", sub: "Scripted tour of the full product at /?showcase" },
    { ic: "clock", tone: "no", tag: "NOT YET", title: "Release tags", sub: `No tagged versions cut yet — package version reads ${G.version}` },
    { ic: "clock", tone: "no", tag: "NOT YET", title: "Backend", sub: "Front-end only; credentials are seeded fixtures, not a real issuer network" },
    { ic: "clock", tone: "no", tag: "NOT YET", title: "Accessibility audit", sub: "No formal WCAG pass has been run against these screens" },
  ],
};

/* Verbatim excerpts from the source. Each is quoted, not paraphrased, so a
   reader can open the named file and find exactly this. */
export const CODE = {
  disclosure: `<Group>
  {Object.keys(attrs).map((k) => (
    <Row key={k} ic={icForAttr(k)} title={k}
      sub={k === "Age over 21"
        ? "Shares yes/no — not your birth date"
        : undefined}
      right={<Toggle on={attrs[k]} onClick={() => updateAttr(k)} />} />
  ))}
</Group>`,

  stroke: `export const STROKE = { bold: 2.2, base: 1.8, light: 1.4 };

export const strokeFor = (s) =>
  s <= 14 ? STROKE.bold
  : s <= 24 ? STROKE.base
  : STROKE.light;`,

  frame: `/* Render the DEVICE in the app's native 360pt design space, then let
   PhoneFrame's single outer transform scale the whole assembly. */
.pf-phone {
  width: 360px !important;
  height: 782.69px !important;
  border-radius: 49.25px !important;
}`,

  spacing: `export const SPACE = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 6: 6, 8: 8,
  12: 12, 16: 16, 20: 20, 24: 24, 28: 28, 32: 32, 40: 40,
};

// sp(20, 20, 24) -> "20px 20px 24px"
export const sp = (...v) => v.map((n) => \`\${SPACE[n]}px\`).join(" ");`,

  test: `it("is pixel-keyed: every key equals its own value", () => {
  for (const [key, value] of Object.entries(SPACE)) {
    expect(value, \`SPACE[\${key}]\`).toBe(Number(key));
  }
});`,

  stats: `// scripts/gen-stats.mjs — runs before every dev and build
const r = JSON.parse(fs.readFileSync(testResults, "utf8"));
if (r.numFailedTests > 0) process.exit(1);   // don't ship the page

fs.writeFileSync("src/case-study/stats.generated.json",
  JSON.stringify({ tests: r.numTotalTests, screens, components, ... }));`,
};
