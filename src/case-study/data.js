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

/* ----------------------------------------------------------------------------
   Who made this, and what it actually is.

   Both are stated in the hero rather than left for the reader to infer. The
   ownership line claims exactly what happened and no more: there was no team,
   so it does not borrow a team's credibility. The status line is the first
   thing a reviewer would otherwise have to go looking for.
---------------------------------------------------------------------------- */
export const OWNERSHIP = {
  /* Prose, not a chip row. A phase pipeline across the hero would assert
     seniority; a sentence states what happened and lets the page prove it. */
  line: "Built solo — problem framing, product vision, interaction design, the design system and the shipping build — at the standard I'd want a team operating at.",
  note: "AI-assisted implementation.",
};

export const PROJECT_STATUS = {
  label: "Working concept",
  line: "A working product concept, not a shipped service — no live users, no real credentials, no backend. Every screen here is real and running; the trust infrastructure underneath it is the part that isn't built.",
};

/* The end-to-end flows the self-driving demo walks, in the order it walks
   them. Hand-listed rather than counted by the build — grouping steps into
   journeys is an editorial call, not something a script can infer — but every
   one is verifiable by watching the demo at /?showcase. */
export const JOURNEYS = [
  { name: "Onboarding and identity verification", detail: "Sign-up through document scan and Face ID" },
  { name: "Presenting a proof", detail: "Wallet to credential to live share sheet" },
  { name: "Choosing what to disclose", detail: "Scoped attributes and one-time PIN" },
  { name: "Managing the account", detail: "Profile, connected services, privacy controls" },
  { name: "Monitoring activity", detail: "Pulse feed and timeline of every past share" },
  { name: "Renegotiating consent", detail: "A service asks for more; the wallet counters" },
];

export const STATS = {
  version: G.version,
  commit: G.commit,
  generatedAt: G.generatedAt,

  /* Referenced inline in prose, so they're exposed formatted and ready. */
  spacingTokens: n(G.spacingTokens),
  tokenisedSpacings: n(G.tokenisedSpacings),

  /* Hero: the size of the product, not the size of the repository. A reader
     deciding whether to keep scrolling wants to know what was built. */
  hero: [
    { value: n(JOURNEYS.length), label: "End-to-end journeys", how: "flows the live demo walks" },
    { value: n(G.screens), label: "Screens", how: "top-level modules in src/screens" },
    { value: n(G.components), label: "Reusable components", how: "shared across every screen" },
  ],

  tests: [
    { value: n(G.tests), label: "Tests", how: `${G.testSuites} suites, all passing` },
    { value: n(G.assertions), label: "Assertions", how: "expect() calls in the suite" },
    { value: n(G.testFiles), label: "Test files", how: "tokens · components · screens" },
    { value: "2/2", label: "Mutations caught", how: "deliberate regressions, each failed a test" },
  ],

  /* Scope: what the work is verified against. Source-file, line and token
     counts used to sit here — they measured the repository rather than the
     product or its quality, so they're gone. */
  scope: [
    { value: n(G.appStates), label: "App states", how: "distinct views the app routes between" },
    { value: `${G.a11y.passingAA}/${G.a11y.pairsChecked}`, label: "Contrast pairs at AA", how: "computed from the live tokens" },
    { value: n(G.tests), label: "Tests passing", how: "the suite is run before every build" },
    { value: "2/2", label: "Mutations caught", how: "bugs reintroduced on purpose, both failed" },
  ],

  a11y: G.a11y,

  honest: [
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Automated test suite", sub: `${G.tests} tests across tokens, components and screens` },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Design token system", sub: "Colour, type, spacing, radii, motion, elevation in one module" },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Contrast audit", sub: `${G.a11y.passingAA} of ${G.a11y.pairsChecked} pairs meet WCAG AA — five failures found and fixed` },
    { ic: "checkcirc", tone: "yes", tag: "YES", title: "Self-driving demo mode", sub: "Scripted tour of the full product at /?showcase" },
  ],
};

/* Where the product goes next.

   The ordering rule matters more than the list, so it's stated on the page:
   two tests decide the bucket — does the capability reuse a primitive the
   product already has, and does someone already hold a budget for it. Both
   pass, it's NOW. One passes, it's NEXT. Neither — or it depends on adoption
   we don't control — it's LATER. Everything below is sorted by that. */
export const ROADMAP_RULE = {
  tests: [
    { q: "Does it reuse a primitive we already have?", why: "Selective disclosure and expiring proofs are built. Anything that extends them ships in weeks; anything that needs a new mechanism ships in quarters." },
    { q: "Does the payer already have a budget line?", why: "Nobody has a budget for a new category. Plenty of people already pay for age checks and KYC — that's a switch, not a sale." },
  ],
  buckets: {
    NOW: "Both tests pass.",
    NEXT: "One test passes — worth building, but it either needs a new mechanism or a payer we'd have to prove.",
    LATER: "Neither, or it turns on adoption we don't control.",
  },
};

export const NEXT = [
  {
    tag: "FINANCE", ic: "card", when: "NOW",
    title: "Verify once, reuse everywhere",
    body: "Opening a bank, brokerage or crypto account means re-uploading the same documents each time. A reusable, cryptographically-signed identity that any institution can request collapses days of onboarding into one approval — the clearest wedge into a market that already spends heavily on KYC.",
    because: "Pure selective disclosure, and KYC budgets already exist.",
  },
  {
    tag: "COMMERCE", ic: "wine", when: "NOW",
    title: "Age-gated checkout on the web",
    body: "Every alcohol, gaming and pharmacy checkout currently asks for a birth date and stores it. A browser extension that answers “over 21” with a scoped proof turns the wallet's core mechanic into an everyday habit — and puts it in front of merchants who already pay for age checks.",
    because: "It is the core mechanic, on a surface merchants already pay to solve.",
  },
  {
    tag: "RESILIENCE", ic: "shield", when: "NEXT",
    title: "Breach response, not just breach alerts",
    body: "Pulse already spots misuse. The next step is acting on it: one screen that shows everything a compromised service ever received, revokes it, and reissues affected credentials — recovery being the half of trust the current design doesn't yet cover.",
    because: "Pulse exists; the paying subscriber is the part still to prove.",
  },
  {
    tag: "FAMILY", ic: "contacts", when: "NEXT",
    title: "Credentials you hold for someone else",
    body: "Parents carry their children's documents; adult children manage their parents'. Delegated custody with its own consent trail extends the wallet to the people least able to run one themselves, and turns a single-user app into a household account.",
    because: "Extends the credential model, but needs a consent model we haven't designed.",
  },
  {
    tag: "OFFLINE", ic: "phone", when: "LATER",
    title: "Proofs without a network",
    body: "Bouncers in basements and border desks abroad don't have reliable signal. Presenting over NFC or Bluetooth with a pre-signed, short-lived proof removes the last dependency between the holder and the verifier.",
    because: "New transport layer, and no payer of its own — it unblocks others rather than earning alone.",
  },
  {
    tag: "TRAVEL", ic: "book", when: "LATER",
    title: "Border and boarding",
    body: "The passport is already in the wallet. Pairing it with a boarding pass makes the airport the highest-stakes proving ground for expiring proofs — and the place where “I forgot my documents” has the highest cost to solve.",
    because: "The highest-stakes surface, and the one gated entirely on government and airline adoption.",
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
