/* ============================================================================
   Case-study facts.

   Every number here was measured from this repository, and each carries the
   command that produced it so it can be re-checked. Nothing is estimated or
   rounded for effect. If a figure can't be measured, it isn't on the page.

   Last measured: 2026-07-12, at commit 0cee534 + working tree.
============================================================================ */

export const STATS = {
  version: "0.1.0", // package.json

  hero: [
    { value: "11", label: "Product screens", how: "ls src/screens/**/*.jsx" },
    { value: "24", label: "Shared components", how: "grep 'export function' src/components/*" },
    { value: "58", label: "Tests passing", how: "npm test" },
    { value: "4,588", label: "Lines of source", how: "wc -l, excluding tests" },
  ],

  tests: [
    { value: "58", label: "Tests", how: "vitest run — all passing" },
    { value: "3", label: "Test files", how: "tokens · components · screens" },
    { value: "459", label: "Lines of test", how: "wc -l src/test/*" },
    { value: "2/2", label: "Mutations caught", how: "deliberate regressions, each failed a test" },
  ],

  scope: [
    { value: "27", label: "Source files", how: "jsx + js + css, excluding tests" },
    { value: "14", label: "Spacing tokens", how: "Object.keys(SPACE).length" },
    { value: "589", label: "Tokenised spacings", how: "SPACE[n] / sp() references in app code" },
    { value: "5", label: "Commits", how: "git rev-list --count HEAD" },
  ],

  /* Deliberately includes the absences. A portfolio page that only lists what
     exists invites the reader to assume the rest. */
  honest: [
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Automated test suite", sub: "58 tests across tokens, components and screens" },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Design token system", sub: "Colour, type, spacing, radii, motion, elevation in one module" },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Self-driving demo mode", sub: "Scripted tour of the full product at /?showcase" },
    { ic: "clock", tone: "no", tag: "NOT YET", title: "Release tags", sub: "No tagged versions cut yet — package version reads 0.1.0" },
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
};
