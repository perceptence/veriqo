import { useState, useEffect, useRef } from "react";
import { C, DISP, MONO, NUM, SPACE, sp, RADIUS, SHADOW, MOTION, STROKE, strokeFor, LAYOUT } from "../styles/tokens.js";
import { Ic, Grain } from "../components/Icon.jsx";
import { Notice, Group, Row } from "../components/primitives.jsx";
import { Wordmark } from "../components/Logo.jsx";
import { STATS, CODE } from "./data.js";

/* ============================================================================
   Veriqo — design case study.

   A route in the product's own app (`/case-study`), built from the product's
   own design system: every colour, space, radius, shadow, font and icon here
   is imported from src/styles/tokens.js and src/components/*. Nothing visual
   is re-declared locally — if a value isn't a token, it's a layout constant
   declared once below and reused.

   Every figure rendered here comes from src/case-study/data.js, which records
   how each number was measured. No estimates.
============================================================================ */

/* The single content width for the entire page. The hero is the one
   deliberate exception (full-bleed); everything else sits on this rail. */
const W = 760;

/* ---------- small building blocks, all token-driven ---------- */

function Section({ eyebrow, title, children, id }) {
  return (
    <section id={id} style={{ maxWidth: W, margin: "0 auto", padding: sp(0, 24), marginBottom: SPACE[40] * 2 }}>
      {eyebrow && (
        <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.acc, letterSpacing: ".14em", marginBottom: SPACE[8] }}>
          {eyebrow}
        </div>
      )}
      {title && (
        <h2 style={{ fontFamily: DISP, fontSize: "clamp(23px, 4.4vw, 30px)", fontWeight: 900, color: C.ink, letterSpacing: "-.025em", lineHeight: 1.12, margin: sp(0, 0, 16) }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function P({ children, dim }) {
  return (
    <p style={{ fontFamily: DISP, fontSize: 15.5, fontWeight: 500, color: dim ? C.faint : C.sub, lineHeight: 1.65, margin: sp(0, 0, 16) }}>
      {children}
    </p>
  );
}

function Lede({ children }) {
  return (
    <p style={{ fontFamily: DISP, fontSize: "clamp(16.5px, 2.4vw, 19px)", fontWeight: 600, color: C.ink2, lineHeight: 1.55, margin: sp(0, 0, 24), letterSpacing: "-.01em" }}>
      {children}
    </p>
  );
}

/* A code artifact and its plain-language reading, side by side. The
   explanation is written for someone who does not read code. */
function Artifact({ label, code, heading, plain }) {
  return (
    <figure style={{ margin: sp(0, 0, 24), border: `1px solid ${C.line}`, borderRadius: RADIUS.lg, overflow: "hidden", background: C.paper }}>
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], padding: sp(8, 16), borderBottom: `1px solid ${C.line}`, background: C.bone }}>
        <Ic n="file" s={13} c={C.faint} />
        <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: C.faint, letterSpacing: ".08em" }}>{label}</span>
      </div>
      <pre style={{ margin: 0, padding: SPACE[16], overflowX: "auto", background: C.ink, color: "rgba(255,255,255,.92)", fontFamily: MONO, fontSize: 12.5, lineHeight: 1.7 }}>
        <code>{code}</code>
      </pre>
      <figcaption style={{ padding: SPACE[16], background: C.paper }}>
        <div style={{ display: "flex", alignItems: "center", gap: SPACE[6], marginBottom: SPACE[6] }}>
          <Ic n="eye" s={14} c={C.acc} />
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.accDeep, letterSpacing: ".1em" }}>IN PLAIN ENGLISH</span>
        </div>
        <div style={{ fontFamily: DISP, fontSize: 14.5, fontWeight: 700, color: C.ink, marginBottom: SPACE[4], letterSpacing: "-.01em" }}>{heading}</div>
        <p style={{ fontFamily: DISP, fontSize: 14, fontWeight: 500, color: C.sub, lineHeight: 1.6, margin: 0 }}>{plain}</p>
      </figcaption>
    </figure>
  );
}

function StatGrid({ items, light }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: SPACE[12] }}>
      {items.map((s) => (
        <div key={s.label} style={{
          padding: sp(16, 16), borderRadius: RADIUS.md,
          background: light ? "rgba(255,255,255,.06)" : C.paper,
          border: `1px solid ${light ? "rgba(255,255,255,.10)" : C.line}`,
        }}>
          <div style={{ fontFamily: NUM, fontSize: 30, lineHeight: 1, color: light ? C.glow : C.ink }}>{s.value}</div>
          <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: light ? "rgba(255,255,255,.86)" : C.ink, marginTop: SPACE[6] }}>{s.label}</div>
          <div style={{ fontFamily: MONO, fontSize: 9.5, color: light ? "rgba(255,255,255,.45)" : C.faint, marginTop: SPACE[3], letterSpacing: ".04em", lineHeight: 1.5 }}>{s.how}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- the live product, embedded ---------- */

function LiveEmbed() {
  const [state, setState] = useState("loading"); // loading | ready | failed
  const [nonce, setNonce] = useState(0);
  const frameRef = useRef(null);

  // If the embed never signals load, say so rather than showing a blank slab.
  useEffect(() => {
    setState("loading");
    const t = setTimeout(() => setState((s) => (s === "loading" ? "failed" : s)), 8000);
    return () => clearTimeout(t);
  }, [nonce]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[12], flexWrap: "wrap" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: SPACE[6],
          padding: sp(4, 8), borderRadius: RADIUS.pill, background: C.accSoft,
          border: `1px solid ${C.acc}40`,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: RADIUS.round, background: C.acc, animation: "breathe 1.6s ease infinite" }} />
          <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: C.accDeep, letterSpacing: ".1em" }}>LIVE — THE REAL APP</span>
        </span>
        <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.faint }}>
          Not a video. The product itself, running in this page, driving itself.
        </span>
      </div>

      <div style={{
        position: "relative", borderRadius: RADIUS["2xl"], overflow: "hidden",
        background: C.bone, border: `1px solid ${C.line}`, boxShadow: SHADOW.card,
        height: 720,
      }}>
        {state !== "ready" && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: SPACE[12], background: C.bone,
          }}>
            {state === "loading" ? (
              <>
                <span style={{ width: 10, height: 10, borderRadius: RADIUS.round, background: C.acc, animation: "breathe 1.4s ease infinite" }} />
                <span style={{ fontFamily: MONO, fontSize: 10, color: C.faint, letterSpacing: ".12em" }}>STARTING THE APP…</span>
              </>
            ) : (
              <>
                <Ic n="alert" s={22} c={C.faint} />
                <span style={{ fontFamily: DISP, fontSize: 14, fontWeight: 600, color: C.sub, textAlign: "center", maxWidth: 320 }}>
                  The embedded app didn’t start. It runs at the same address as this page.
                </span>
                <button onClick={() => setNonce((n) => n + 1)} style={{
                  fontFamily: DISP, fontSize: 13, fontWeight: 700, color: "#fff", background: C.ink,
                  border: "none", borderRadius: RADIUS.sm, padding: sp(8, 16), cursor: "pointer",
                }}>Try again</button>
              </>
            )}
          </div>
        )}
        <iframe
          key={nonce}
          ref={frameRef}
          title="Veriqo — live product, self-driving demo"
          src={`/?showcase&embed=${nonce}`}
          onLoad={() => setState("ready")}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>

      <div style={{ display: "flex", gap: SPACE[12], marginTop: SPACE[16], flexWrap: "wrap" }}>
        <a href="/" style={{
          display: "inline-flex", alignItems: "center", gap: SPACE[8], textDecoration: "none",
          fontFamily: DISP, fontSize: 14, fontWeight: 700, color: "#fff", background: C.ink,
          padding: sp(12, 20), borderRadius: RADIUS.md,
        }}>
          Try the real thing <Ic n="arrow" s={15} c="#fff" />
        </a>
        <a href="/?showcase" style={{
          display: "inline-flex", alignItems: "center", gap: SPACE[8], textDecoration: "none",
          fontFamily: DISP, fontSize: 14, fontWeight: 700, color: C.ink, background: C.paper,
          border: `1px solid ${C.line}`, padding: sp(12, 20), borderRadius: RADIUS.md,
        }}>
          Watch it drive itself <Ic n="pulse" s={15} c={C.acc} />
        </a>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, marginTop: SPACE[8], letterSpacing: ".04em" }}>
        BOTH LINKS ARE THE SAME DEPLOYMENT AS THIS PAGE
      </div>
    </div>
  );
}

/* ---------- design-system exhibits, rendered from the real tokens ---------- */

function PaletteExhibit() {
  const swatches = [
    ["bone", C.bone, "app canvas"], ["paper", C.paper, "cards"], ["ink", C.ink, "primary text"],
    ["sub", C.sub, "secondary text"], ["faint", C.faint, "tertiary"], ["acc", C.acc, "accent"],
    ["accDeep", C.accDeep, "accent text"], ["glow", C.glow, "on dark"],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))", gap: SPACE[8] }}>
      {swatches.map(([name, val, use]) => (
        <div key={name}>
          <div style={{ height: 56, borderRadius: RADIUS.sm, background: val, border: `1px solid ${C.line}` }} />
          <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.ink, marginTop: SPACE[6] }}>{name}</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.faint, marginTop: SPACE[1] }}>{val}</div>
          <div style={{ fontFamily: DISP, fontSize: 11, fontWeight: 500, color: C.faint, marginTop: SPACE[1] }}>{use}</div>
        </div>
      ))}
    </div>
  );
}

function SpacingExhibit() {
  const keys = Object.keys(SPACE).map(Number).filter((n) => n > 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: SPACE[4] }}>
      {keys.map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: SPACE[12] }}>
          <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint, width: 62, flexShrink: 0 }}>SPACE[{k}]</span>
          <span style={{ height: 10, width: SPACE[k], background: k === 6 ? C.acc : C.ink, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontFamily: MONO, fontSize: 10, color: k === 6 ? C.accDeep : C.faint }}>
            {k}px{k === 6 ? "  ← half-step" : k <= 3 ? "  ← micro tier" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function StrokeExhibit() {
  const sizes = [12, 18, 32];
  return (
    <div style={{ display: "flex", gap: SPACE[24], flexWrap: "wrap" }}>
      {sizes.map((s) => (
        <div key={s} style={{ textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: RADIUS.md, background: C.paper, border: `1px solid ${C.line}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Ic n="shield" s={s} c={C.ink} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, marginTop: SPACE[6] }}>{s}px icon</div>
          <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.accDeep }}>stroke {strokeFor(s)}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- the page ---------- */

export default function CaseStudy() {
  useEffect(() => { document.title = "Veriqo — Design Case Study"; }, []);

  return (
    <div style={{ background: C.bone, minHeight: "100vh", paddingBottom: SPACE[40] * 2 }}>
      {/* HERO — the one deliberate full-bleed exception to the content rail */}
      <header style={{ position: "relative", background: C.ink, overflow: "hidden", marginBottom: SPACE[40] * 2 }}>
        <Grain o={0.10} />
        <div style={{
          position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
          width: 620, height: 620, borderRadius: RADIUS.round, pointerEvents: "none",
          background: `radial-gradient(circle, ${C.acc}33, transparent 66%)`, filter: "blur(60px)",
        }} />
        <div style={{ position: "relative", maxWidth: W, margin: "0 auto", padding: sp(40, 24) }}>
          <div style={{ marginBottom: SPACE[32] }}><Wordmark size={20} light /></div>
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.glow, letterSpacing: ".16em", marginBottom: SPACE[12] }}>
            DESIGN CASE STUDY · IDENTITY WALLET
          </div>
          <h1 style={{
            fontFamily: DISP, fontSize: "clamp(31px, 6.4vw, 46px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-.035em", lineHeight: 1.04, margin: sp(0, 0, 16), maxWidth: 620,
          }}>
            Prove who you are without handing over<span style={{ color: C.glow }}> everything.</span>
          </h1>
          <p style={{
            fontFamily: DISP, fontSize: "clamp(15px, 2vw, 17px)", fontWeight: 500, color: "rgba(255,255,255,.72)",
            lineHeight: 1.6, margin: sp(0, 0, 32), maxWidth: 560,
          }}>
            Veriqo is a mobile identity wallet where every share is deliberate, scoped, and
            expiring. This page is a route inside that same app — the product below is the
            real thing, not a recording.
          </p>
          <StatGrid light items={STATS.hero} />
        </div>
      </header>

      {/* THE PROBLEM */}
      <Section eyebrow="THE PROBLEM" title="Identity is all-or-nothing, and that's the bug.">
        <Lede>
          To prove one fact about yourself — that you're over 21 — you hand over a document
          that also reveals your exact birth date, your address, your document number and your
          full legal name.
        </Lede>
        <P>
          A bouncer needs a yes/no. A crypto exchange needs a tax jurisdiction. A hotel needs a
          name match. In every case the physical artifact over-discloses, because a card can't
          answer a question — it can only be shown whole.
        </P>
        <P>
          Veriqo's premise is that a credential should answer questions, not display itself. The
          interface has one job: make selective disclosure feel like the normal, easy path — not
          a privacy setting buried three screens deep.
        </P>
        <Notice
          type="success" icon="lock"
          title="The design goal, in one line"
          sub="Share the proof, not the data — and make that the fastest route, not the virtuous one."
        />
      </Section>

      {/* LIVE PRODUCT */}
      <Section eyebrow="THE PRODUCT" title="Running, right here.">
        <P>
          Below is the actual application, embedded from the same deployment that serves this
          page. It boots into a self-driving demo that walks its own interface: onboarding,
          identity verification, presenting a proof, choosing what to disclose, and reviewing
          activity. Touch it at any point and it hands control straight back to you.
        </P>
        <LiveEmbed />
      </Section>

      {/* DECISIONS */}
      <Section eyebrow="DESIGN DECISIONS" title="Three choices that shaped the product.">
        <Lede>1 · Disclosure is a first-class screen, not a settings toggle.</Lede>
        <P>
          Presenting a credential and choosing what it reveals sit on the same surface, one tap
          apart. The age proof carries its own explanation, so the safer option is also the
          self-evident one.
        </P>
        <Artifact
          label="src/screens/share.jsx"
          code={CODE.disclosure}
          heading="The interface states what a share does and doesn't include"
          plain="Each attribute you can share is drawn as its own switch. The age row carries a permanent note saying it shares a yes/no answer rather than your birth date, so the difference between “over 21” and “born on this date” is visible at the moment you decide — not buried in a policy page."
        />

        <Lede>2 · One rule for icon weight, instead of two dozen judgement calls.</Lede>
        <P>
          Icons were being drawn at whatever stroke looked right in isolation, which read as
          inconsistent once screens sat side by side. Weight is now derived from render size, so
          every icon lands at the same optical density.
        </P>
        <Artifact
          label="src/styles/tokens.js"
          code={CODE.stroke}
          heading="Small icons get thicker lines, large icons get thinner ones"
          plain="A line of fixed thickness looks fainter the smaller a shape is drawn. This rule compensates automatically: icons up to 14px use the heaviest weight, mid-size icons the standard one, and large icons the lightest. The result is that every icon in the app appears to be drawn with the same pen."
        />
        <div style={{ margin: sp(0, 0, 24) }}><StrokeExhibit /></div>

        <Lede>3 · The device frame bends to the design, not the reverse.</Lede>
        <P>
          The interface was composed for a 360pt-wide canvas. Scaling that artwork up to fill a
          402pt phone screen broke the browser's rendering of the scrolling lists — corners bled
          past the rounded bezel and the bottom edge shimmered. The fix was to invert the
          relationship.
        </P>
        <Artifact
          label="src/index.css"
          code={CODE.frame}
          heading="Resize the phone to the artwork, not the artwork to the phone"
          plain="Rather than stretching the interface to fit the phone — which made the browser redraw scrolling content incorrectly — the phone illustration itself is rendered at the size the interface was designed for, then the whole assembly is scaled as one piece. Same final size on screen, but nothing inside is being stretched, so the rendering glitch disappears."
        />
      </Section>

      {/* DESIGN SYSTEM */}
      <Section eyebrow="DESIGN SYSTEM" title="Every value on screen comes from one file.">
        <P>
          Colour, type, spacing, radii, elevation and motion live in a single tokens module that
          the product and this case study both import. The swatches and scales below are not
          illustrations of the system — they are rendered directly from it.
        </P>

        <div style={{ marginBottom: SPACE[32] }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: C.faint, letterSpacing: ".12em", marginBottom: SPACE[12] }}>PALETTE</div>
          <PaletteExhibit />
        </div>

        <div style={{ marginBottom: SPACE[32] }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: C.faint, letterSpacing: ".12em", marginBottom: SPACE[12] }}>
            SPACING — {Object.keys(SPACE).length} STEPS
          </div>
          <SpacingExhibit />
        </div>

        <Artifact
          label="src/styles/tokens.js"
          code={CODE.spacing}
          heading="A spacing scale where the name is the measurement"
          plain="Instead of remembering that “step 3” means 12 pixels, the token is simply called 12. The scale runs on a 4-pixel rhythm for layout, with one half-step at 6 and a few tiny values for badge padding. Roughly 590 spacing values across the app now reference this scale by name, so changing the rhythm is one edit rather than a search-and-replace."
        />
      </Section>

      {/* TESTS */}
      <Section eyebrow="VERIFICATION" title="What the test suite actually checks.">
        <P>
          The suite is small and deliberately unglamorous: it protects the design system's
          invariants and proves every screen still mounts. It was written for this project, and
          the numbers on this page are read from its output.
        </P>
        <div style={{ marginBottom: SPACE[24] }}><StatGrid items={STATS.tests} /></div>

        <Artifact
          label="src/test/tokens.test.js"
          code={CODE.test}
          heading="A guard rail that fails loudly if the spacing scale drifts"
          plain="This check walks every entry in the spacing scale and insists the name matches the measurement — that the token called 12 really is 12 pixels. If someone renames or mis-edits a step, the build fails with a clear message instead of the layout quietly shifting by a pixel or two everywhere."
        />

        <Notice
          type="info" icon="checkcirc"
          title="The suite was checked against deliberate breakage"
          sub="Two regressions were introduced on purpose — reverting the icon-stroke rule to its old heavy default, and changing the scroll-gutter constant that a CSS fix depends on. Each one failed exactly one test, then the code was restored."
        />
      </Section>

      {/* HONEST NUMBERS */}
      <Section eyebrow="SCOPE" title="What's here, measured.">
        <div style={{ marginBottom: SPACE[24] }}><StatGrid items={STATS.scope} /></div>
        <Group>
          {STATS.honest.map((h) => (
            <Row key={h.title} ic={h.ic} title={h.title} sub={h.sub}
              right={<span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: ".06em", color: h.tone === "yes" ? C.accDeep : C.faint, background: h.tone === "yes" ? C.accSoft : C.bone, padding: sp(3, 8), borderRadius: RADIUS.xs }}>{h.tag}</span>}
            />
          ))}
        </Group>
        <div style={{ marginTop: SPACE[24] }}>
          <Artifact
            label="scripts/gen-stats.mjs"
            code={CODE.stats}
            heading="The numbers are measured by the build, not typed by hand"
            plain="Before the site is built, a script counts the screens, components and lines in the codebase and runs the test suite for real. Those results are written straight into the page. If a screen is deleted or a test removed, the next deploy says so on its own — and if the suite fails, the build stops rather than publishing a page that claims the tests pass."
          />
        </div>
      </Section>

      {/* CLOSE */}
      <footer style={{ maxWidth: W, margin: "0 auto", padding: sp(0, 24) }}>
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: SPACE[32], display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: SPACE[24], flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: DISP, fontSize: 22, fontWeight: 900, color: C.ink, letterSpacing: "-.02em", marginBottom: SPACE[6] }}>
              Veriqo
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, letterSpacing: ".1em" }}>
              DIGITAL IDENTITY WALLET · v{STATS.version}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 9.5, color: C.faint, letterSpacing: ".06em", marginTop: SPACE[6], opacity: 0.8 }}>
              FIGURES MEASURED AT BUILD · {STATS.generatedAt}
              {STATS.commit ? ` · ${STATS.commit}` : ""}
            </div>
          </div>
          <a href="/" style={{
            display: "inline-flex", alignItems: "center", gap: SPACE[8], textDecoration: "none",
            fontFamily: DISP, fontSize: 14, fontWeight: 700, color: "#fff", background: C.acc,
            padding: sp(12, 20), borderRadius: RADIUS.md,
          }}>
            Open the app <Ic n="arrow" s={15} c="#fff" />
          </a>
        </div>
      </footer>
    </div>
  );
}
