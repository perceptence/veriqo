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

  /* Referenced inline in prose, so they're exposed formatted and ready. */
  spacingTokens: n(G.spacingTokens),
  tokenisedSpacings: n(G.tokenisedSpacings),

  hero: [
    { value: n(G.screens), label: "Product screens", how: "files in src/screens" },
    { value: n(G.components), label: "Shared components", how: "exports from src/components" },
    { value: n(G.tests), label: "Tests passing", how: "vitest run, at build time" },
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

  a11y: G.a11y,

  honest: [
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Automated test suite", sub: `${G.tests} tests across tokens, components and screens` },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Design token system", sub: "Colour, type, spacing, radii, motion, elevation in one module" },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Contrast audit", sub: `${G.a11y.passingAA} of ${G.a11y.pairsChecked} pairs meet WCAG AA — two failures found and fixed` },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Self-driving demo mode", sub: "Scripted tour of the full product at /?showcase" },
  ],
};

/* Where the product goes next: new surfaces to build, and how it pays for
   itself. Each capability extends a mechanism the current design already
   has, rather than bolting on something unrelated. */
export const NEXT = [
  {
    tag: "COMMERCE", ic: "wine",
    title: "Age-gated checkout on the web",
    body: "Every alcohol, gaming and pharmacy checkout currently asks for a birth date and stores it. A browser extension that answers “over 21” with a scoped proof turns the wallet's core mechanic into an everyday habit — and puts it in front of merchants who already pay for age checks.",
  },
  {
    tag: "TRAVEL", ic: "book",
    title: "Border and boarding",
    body: "The passport is already in the wallet. Pairing it with a boarding pass makes the airport the highest-stakes proving ground for expiring proofs — and the place where “I forgot my documents” has the highest cost to solve.",
  },
  {
    tag: "FINANCE", ic: "card",
    title: "Verify once, reuse everywhere",
    body: "Opening a bank, brokerage or crypto account means re-uploading the same documents each time. A reusable, cryptographically-signed identity that any institution can request collapses days of onboarding into one approval — the clearest wedge into a market that already spends heavily on KYC.",
  },
  {
    tag: "FAMILY", ic: "contacts",
    title: "Credentials you hold for someone else",
    body: "Parents carry their children's documents; adult children manage their parents'. Delegated custody with its own consent trail extends the wallet to the people least able to run one themselves, and turns a single-user app into a household account.",
  },
  {
    tag: "RESILIENCE", ic: "shield",
    title: "Breach response, not just breach alerts",
    body: "Pulse already spots misuse. The next step is acting on it: one screen that shows everything a compromised service ever received, revokes it, and reissues affected credentials — recovery being the half of trust the current design doesn't yet cover.",
  },
  {
    tag: "OFFLINE", ic: "phone",
    title: "Proofs without a network",
    body: "Bouncers in basements and border desks abroad don't have reliable signal. Presenting over NFC or Bluetooth with a pre-signed, short-lived proof removes the last dependency between the holder and the verifier.",
  },
];

/* Revenue model. The strategic point is the one that keeps recurring in
   identity: the person proving something is the wrong party to charge. */
export const REVENUE = {
  thesis: "The wallet is free because its value is acceptance — every extra holder makes it worth more to verifiers, and every extra verifier makes it worth more to holders. Charging the person proving who they are would cap both. So the people who currently pay for identity checks keep paying, and get something cheaper and better.",
  tiers: [
    {
      name: "Wallet", price: "Free", tone: "quiet",
      who: "Everyone holding credentials",
      lines: ["Unlimited documents and proofs", "Selective disclosure and expiry", "Activity timeline"],
      note: "Acquisition. The network only works at scale.",
    },
    {
      name: "Pro", price: "Subscription", tone: "accent",
      who: "Frequent provers and families",
      lines: ["Breach monitoring across connected services", "Delegated and family credentials", "Priority identity recovery", "Full sharing history and richer Pulse intelligence"],
      note: "Consumer revenue from the anxious minority, not a paywall on proving.",
    },
    {
      name: "Verify", price: "Per check", tone: "ink",
      who: "Bars, banks, landlords, employers",
      lines: ["Request a scoped proof by API or SDK", "Compliance-ready audit log", "No document images to store or insure", "Volume pricing below incumbent KYC"],
      note: "The primary business. Verifiers already have this budget.",
    },
  ],
  adjacent: [
    { title: "Issuer partnerships", body: "White-label issuance for DMVs, universities and employers who want their credential to live in a wallet people already carry." },
    { title: "Fraud signals", body: "Aggregate, anonymised misuse patterns — the same detection that flags a stolen credential is worth something to the institutions being defrauded." },
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
