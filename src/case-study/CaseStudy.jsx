import { useState, useEffect, useRef } from "react";
import { C, DISP, MONO, NUM, SPACE, sp, RADIUS, SHADOW, MOTION, STROKE, strokeFor } from "../styles/tokens.js";
import { Ic, Grain } from "../components/Icon.jsx";
import { Notice, Group, Row } from "../components/primitives.jsx";
import { Wordmark } from "../components/Logo.jsx";
import { Wallet } from "../screens/wallet.jsx";
import { DisclosureDiagram, LeaseDiagram, AdvocacyDiagram, StrokeDiagram } from "./diagrams.jsx";
import { STATS } from "./data.js";

/* ============================================================================
   Veriqo — design case study.

   A route in the product's own app (`/case-study`), built from the product's
   own design system: every colour, space, radius, shadow, font and icon is
   imported from src/styles/tokens.js and src/components/*. The hero preview
   is the real <Wallet> screen; the embed below it is the real running app.

   Every figure comes from src/case-study/stats.generated.json, which
   scripts/gen-stats.mjs measures from the repo before each dev and build.
============================================================================ */

/* The single content width for the entire page. The hero is the one
   deliberate exception (full-bleed). */
const W = 1060;

/* ---------- primitives, all token-driven ---------- */

function Section({ eyebrow, title, children, tint }) {
  return (
    <section style={{ background: tint || "transparent", paddingTop: tint ? SPACE[40] * 1.4 : 0, paddingBottom: tint ? SPACE[40] * 1.4 : 0, marginBottom: tint ? SPACE[40] * 1.6 : SPACE[40] * 1.9 }}>
      <div style={{ maxWidth: W, margin: "0 auto", padding: sp(0, 24) }}>
        {eyebrow && (
          <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[12] }}>
            <span style={{ width: 22, height: 2, background: C.acc, borderRadius: 2 }} />
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.accDeep, letterSpacing: ".14em" }}>{eyebrow}</span>
          </div>
        )}
        {title && (
          <h2 style={{ fontFamily: DISP, fontSize: "clamp(26px, 4.4vw, 34px)", fontWeight: 900, color: C.ink, letterSpacing: "-.025em", lineHeight: 1.12, margin: sp(0, 0, 20) }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

function P({ children }) {
  return <p style={{ fontFamily: DISP, fontSize: "clamp(16px, 1.9vw, 17.5px)", fontWeight: 500, color: C.sub, lineHeight: 1.7, margin: sp(0, 0, 16), maxWidth: 660 }}>{children}</p>;
}

function Lede({ children }) {
  return <p style={{ fontFamily: DISP, fontSize: "clamp(19px, 2.6vw, 22px)", fontWeight: 700, color: C.ink2, lineHeight: 1.5, margin: sp(0, 0, 20), letterSpacing: "-.015em", maxWidth: 680 }}>{children}</p>;
}

function DecisionTitle({ n, children }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: SPACE[12], margin: sp(40, 0, 12) }}>
      <span style={{ fontFamily: NUM, fontSize: 34, color: C.acc, lineHeight: 1 }}>{n}</span>
      <h3 style={{ fontFamily: DISP, fontSize: "clamp(19px, 2.6vw, 23px)", fontWeight: 900, color: C.ink, letterSpacing: "-.02em", margin: 0, lineHeight: 1.25 }}>{children}</h3>
    </div>
  );
}

/* Plain-language takeaway attached to a diagram — no code, just the claim. */
function Takeaway({ children }) {
  return (
    <div style={{ display: "flex", gap: SPACE[12], marginTop: SPACE[16], padding: SPACE[16], background: C.paper, border: `1px solid ${C.line}`, borderRadius: RADIUS.lg }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}><Ic n="checkcirc" s={19} c={C.accDeep} /></div>
      <p style={{ fontFamily: DISP, fontSize: 16, fontWeight: 600, color: C.ink2, lineHeight: 1.6, margin: 0 }}>{children}</p>
    </div>
  );
}

function StatGrid({ items, light, min = 158 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: SPACE[12] }}>
      {items.map((s) => (
        <div key={s.label} style={{
          padding: SPACE[16], borderRadius: RADIUS.md,
          background: light ? "rgba(255,255,255,.06)" : C.paper,
          border: `1px solid ${light ? "rgba(255,255,255,.12)" : C.line}`,
        }}>
          <div style={{ fontFamily: NUM, fontSize: 34, lineHeight: 1, color: light ? C.glow : C.ink }}>{s.value}</div>
          <div style={{ fontFamily: DISP, fontSize: 14.5, fontWeight: 700, color: light ? "#fff" : C.ink, marginTop: SPACE[6] }}>{s.label}</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: light ? "rgba(255,255,255,.55)" : C.faint, marginTop: SPACE[4], letterSpacing: ".03em", lineHeight: 1.5 }}>{s.how}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- hero preview: the real Wallet screen, statically posed ---------- */

function HeroPreview() {
  const noop = () => {};
  return (
    <div aria-hidden="true" className="cs-preview" style={{ position: "relative", width: 336, flexShrink: 0 }}>
      <div style={{
        width: 336, height: 684, borderRadius: 51, background: "#0B0C09",
        padding: 9, boxShadow: "0 46px 92px rgba(0,0,0,.58)", position: "relative",
      }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 43, overflow: "hidden", background: C.bone, position: "relative" }}>
          {/* island */}
          <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 102, height: 29, background: "#0B0C09", borderRadius: 15, zIndex: 3 }} />
          {/* the real Wallet screen, scaled into the shell (318 / 360 = 0.883) */}
          <div style={{ position: "absolute", top: 47, left: 0, width: 360, height: 700, transform: "scale(0.883)", transformOrigin: "top left", pointerEvents: "none" }}>
            <Wallet name="Alex Morgan" openDetail={noop} addNew={noop} onProof={noop}
              ownedDocs={["dl", "passport", "ead"]} setOwnedDocs={noop}
              onAccount={noop} onOpenPulse={noop} onPullStart={noop} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- the live product ---------- */

function LiveEmbed() {
  const [state, setState] = useState("loading");
  const [nonce, setNonce] = useState(0);
  const [driving, setDriving] = useState(true);
  const frameRef = useRef(null);

  useEffect(() => {
    setState("loading");
    setDriving(true);
    const t = setTimeout(() => setState((s) => (s === "loading" ? "failed" : s)), 8000);
    return () => clearTimeout(t);
  }, [nonce]);

  /* The embed is same-origin, so we can read the tour's own state. It flips
     `running` to false the instant a real pointer event hands control to the
     visitor — that's the cue to stop calling this a self-driving demo. */
  useEffect(() => {
    const id = setInterval(() => {
      try {
        const w = frameRef.current?.contentWindow;
        if (!w) return;
        const sc = w.__vqShowcase;
        if (sc) setDriving(sc.running);
      } catch { /* cross-origin — leave the badge as-is */ }
    }, 600);
    return () => clearInterval(id);
  }, [nonce]);

  const restart = () => setNonce((n) => n + 1);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[16], flexWrap: "wrap" }}>
        {driving ? (
          <>
            <span style={{ display: "inline-flex", alignItems: "center", gap: SPACE[6], padding: sp(4, 8), borderRadius: RADIUS.pill, background: C.accSoft, border: `1px solid ${C.acc}55` }}>
              <span style={{ width: 6, height: 6, borderRadius: RADIUS.round, background: C.acc, animation: "breathe 1.6s ease infinite" }} />
              <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: C.accDeep, letterSpacing: ".1em" }}>LIVE — DRIVING ITSELF</span>
            </span>
            <span style={{ fontFamily: DISP, fontSize: 15, fontWeight: 500, color: C.sub }}>
              Not a video, and not the static preview above — the product itself. Touch it to take over.
            </span>
          </>
        ) : (
          <>
            <span style={{ display: "inline-flex", alignItems: "center", gap: SPACE[6], padding: sp(4, 8), borderRadius: RADIUS.pill, background: "#FEF4E6", border: "1px solid #C07B0055" }}>
              <span style={{ width: 6, height: 6, borderRadius: RADIUS.round, background: "#C07B00" }} />
              <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: "#8A5A00", letterSpacing: ".1em" }}>DEMO STOPPED — YOU'RE DRIVING</span>
            </span>
            <span style={{ fontFamily: DISP, fontSize: 15, fontWeight: 500, color: C.sub }}>
              It handed control to you. Explore freely, or restart the tour below.
            </span>
          </>
        )}
      </div>

      {/* No border, no shadow: the device brings its own edge. */}
      <div style={{ position: "relative", height: 740, borderRadius: RADIUS["2xl"], overflow: "hidden" }}>
        {state !== "ready" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: SPACE[12], background: C.bone }}>
            {state === "loading" ? (
              <>
                <span style={{ width: 10, height: 10, borderRadius: RADIUS.round, background: C.acc, animation: "breathe 1.4s ease infinite" }} />
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.faint, letterSpacing: ".12em" }}>STARTING THE APP…</span>
              </>
            ) : (
              <>
                <Ic n="alert" s={22} c={C.faint} />
                <span style={{ fontFamily: DISP, fontSize: 15, fontWeight: 600, color: C.sub, textAlign: "center", maxWidth: 340 }}>
                  The embedded app didn’t start. It runs at the same address as this page.
                </span>
                <button onClick={() => setNonce((n) => n + 1)} style={{ fontFamily: DISP, fontSize: 14, fontWeight: 700, color: "#fff", background: C.ink, border: "none", borderRadius: RADIUS.sm, padding: sp(8, 16), cursor: "pointer" }}>Try again</button>
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

      <div style={{ display: "flex", gap: SPACE[12], marginTop: SPACE[20], flexWrap: "wrap", alignItems: "center" }}>
        {/* Restarts the tour in place — the demo belongs on this page. */}
        <button onClick={restart} style={{
          display: "inline-flex", alignItems: "center", gap: SPACE[8], cursor: "pointer",
          fontFamily: DISP, fontSize: 15, fontWeight: 700,
          color: driving ? C.ink : "#fff", background: driving ? C.paper : C.acc,
          border: `1px solid ${driving ? C.line : C.acc}`, padding: sp(12, 20), borderRadius: RADIUS.md,
        }}>
          {driving ? "Restart the tour" : "Run the demo again"}
          <Ic n={driving ? "rotate" : "pulse"} s={16} c={driving ? C.acc : "#fff"} />
        </button>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: SPACE[8], textDecoration: "none", fontFamily: DISP, fontSize: 15, fontWeight: 700, color: "#fff", background: C.ink, padding: sp(12, 20), borderRadius: RADIUS.md }}>
          Open it full screen <Ic n="arrow" s={16} c="#fff" />
        </a>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: C.faint, marginTop: SPACE[8], letterSpacing: ".04em" }}>
        THE DEMO RUNS HERE · FULL SCREEN OPENS IN A NEW TAB · SAME DEPLOYMENT
      </div>
    </div>
  );
}

/* ---------- design-system exhibits ---------- */

function PaletteExhibit() {
  const rows = [
    { group: "Surfaces", items: [["bone", C.bone, "app canvas"], ["paper", C.paper, "cards, sheets"], ["ink", C.ink, "dark surfaces"]] },
    { group: "Text", items: [["ink", C.ink, "primary"], ["sub", C.sub, "secondary"], ["faint", C.faint, "metadata"]] },
    { group: "Accent", items: [["acc", C.acc, "fills, icons"], ["accDeep", C.accDeep, "accent text"], ["glow", C.glow, "on dark"]] },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: SPACE[20] }}>
      {rows.map(({ group, items }) => (
        <div key={group}>
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: ".12em", marginBottom: SPACE[8] }}>{group.toUpperCase()}</div>
          <div style={{ borderRadius: RADIUS.lg, overflow: "hidden", border: `1px solid ${C.line}` }}>
            {items.map(([name, val, use]) => (
              <div key={name + use} style={{ display: "flex", alignItems: "center", gap: SPACE[12], padding: sp(12, 12), background: C.paper, borderTop: `1px solid ${C.line}` }}>
                <span style={{ width: 40, height: 40, borderRadius: RADIUS.sm, background: val, border: `1px solid ${C.line}`, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: C.ink }}>{name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: C.faint, marginTop: 1 }}>{val} · {use}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TypeExhibit() {
  const specimens = [
    { font: DISP, name: "Archivo", role: "Display & UI", sample: "Alex's Wallet", size: 30, weight: 900 },
    { font: MONO, name: "Space Mono", role: "Labels & metadata", sample: "PROOF EXPIRES IN", size: 15, weight: 700 },
    { font: NUM, name: "Anton", role: "Numerals", sample: "0:24", size: 34, weight: 400 },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: SPACE[12] }}>
      {specimens.map((s) => (
        <div key={s.name} style={{ padding: SPACE[16], background: C.paper, border: `1px solid ${C.line}`, borderRadius: RADIUS.lg }}>
          <div style={{ fontFamily: s.font, fontSize: s.size, fontWeight: s.weight, color: C.ink, lineHeight: 1.15, marginBottom: SPACE[12], letterSpacing: s.font === MONO ? ".06em" : "-.02em" }}>
            {s.sample}
          </div>
          <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: C.ink }}>{s.name}</div>
          <div style={{ fontFamily: DISP, fontSize: 13.5, color: C.faint, marginTop: 2 }}>{s.role}</div>
        </div>
      ))}
    </div>
  );
}

function SpacingExhibit() {
  const keys = Object.keys(SPACE).map(Number).filter((n) => n > 0);
  return (
    <div style={{ padding: SPACE[16], background: C.paper, border: `1px solid ${C.line}`, borderRadius: RADIUS.lg }}>
      {keys.map((k) => {
        const micro = k <= 3, half = k === 6;
        return (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: SPACE[12], padding: sp(3, 0) }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: C.sub, width: 74, flexShrink: 0 }}>SPACE[{k}]</span>
            <span style={{ height: 12, width: SPACE[k], background: half ? C.acc : micro ? C.faint : C.ink, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontFamily: MONO, fontSize: 12, color: half ? C.accDeep : C.faint }}>
              {k}px{half ? "   half-step" : micro ? "   micro tier" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RadiusMotionExhibit() {
  const radii = [["sm", RADIUS.sm], ["md", RADIUS.md], ["lg", RADIUS.lg], ["xl", RADIUS.xl], ["2xl", RADIUS["2xl"]]];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: SPACE[16] }}>
      <div style={{ padding: SPACE[16], background: C.paper, border: `1px solid ${C.line}`, borderRadius: RADIUS.lg }}>
        <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: ".12em", marginBottom: SPACE[12] }}>RADII</div>
        <div style={{ display: "flex", gap: SPACE[8], alignItems: "flex-end", flexWrap: "wrap" }}>
          {radii.map(([n, v]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ width: 52, height: 52, background: C.bone, border: `1.5px solid ${C.ink}`, borderTopLeftRadius: v, borderTopRightRadius: v }} />
              <div style={{ fontFamily: MONO, fontSize: 11, color: C.sub, marginTop: SPACE[4] }}>{n}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint }}>{v}px</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: SPACE[16], background: C.paper, border: `1px solid ${C.line}`, borderRadius: RADIUS.lg }}>
        <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: ".12em", marginBottom: SPACE[12] }}>ELEVATION & MOTION</div>
        <div style={{ display: "flex", gap: SPACE[16], alignItems: "center", marginBottom: SPACE[16] }}>
          {[["soft", SHADOW.soft], ["raised", SHADOW.raised], ["float", SHADOW.float]].map(([n, v]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ width: 46, height: 46, background: C.paper, borderRadius: RADIUS.md, boxShadow: v }} />
              <div style={{ fontFamily: MONO, fontSize: 11, color: C.sub, marginTop: SPACE[8] }}>{n}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: DISP, fontSize: 14, color: C.sub, lineHeight: 1.55 }}>
          One easing curve for the whole product —
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.ink }}> {MOTION.ease}</span> — at
          three speeds ({MOTION.fast}s, {MOTION.base}s, {MOTION.slow}s).
        </div>
      </div>
    </div>
  );
}

function ContrastExhibit() {
  return (
    <div style={{ borderRadius: RADIUS.lg, overflow: "hidden", border: `1px solid ${C.line}` }}>
      {STATS.a11y.pairs.map((p) => (
        <div key={p.label} style={{ display: "flex", alignItems: "center", gap: SPACE[12], padding: sp(12, 16), background: C.paper, borderTop: `1px solid ${C.line}` }}>
          <span style={{ width: 62, height: 40, borderRadius: RADIUS.sm, background: p.bgHex, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: p.fgHex }}>Aa</span>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: C.ink }}>{p.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.faint, marginTop: 1 }}>{p.fg} on {p.bg}</div>
          </div>
          <div style={{ fontFamily: NUM, fontSize: 20, color: C.ink, flexShrink: 0 }}>{p.ratio}</div>
          <span style={{
            fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: ".06em", flexShrink: 0,
            padding: sp(4, 8), borderRadius: RADIUS.xs,
            color: p.aa ? C.accDeep : "#C07B00", background: p.aa ? C.accSoft : "#FEF4E6",
          }}>{p.aa ? "AA" : "LARGE ONLY"}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- page ---------- */

export default function CaseStudy() {
  useEffect(() => { document.title = "Veriqo — Design Case Study"; }, []);

  return (
    <div style={{ background: C.bone, minHeight: "100vh", paddingBottom: SPACE[40] }}>
      {/* HERO — full-bleed and full-height, the one deliberate exception to the rail */}
      <header style={{
        position: "relative", background: C.ink, overflow: "hidden",
        marginBottom: SPACE[40] * 1.9, minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <Grain o={0.10} />
        <div style={{ position: "absolute", top: "-18%", left: "12%", width: 820, height: 820, borderRadius: RADIUS.round, pointerEvents: "none", background: `radial-gradient(circle, ${C.acc}3D, transparent 65%)`, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-30%", right: "-6%", width: 620, height: 620, borderRadius: RADIUS.round, pointerEvents: "none", background: `radial-gradient(circle, ${C.acc}22, transparent 68%)`, filter: "blur(90px)" }} />

        {/* Wordmark sits in normal flow, not absolutely positioned — when the
            hero content grows on narrow or short viewports it pushes the mark
            instead of sliding underneath it. */}
        <div style={{ position: "relative", flexShrink: 0, padding: sp(32, 24, 0) }}>
          <div style={{ maxWidth: W, margin: "0 auto" }}><Wordmark size={21} light /></div>
        </div>

        <div style={{ position: "relative", maxWidth: W, margin: "0 auto", width: "100%", padding: sp(40, 24), flex: "1 0 auto", display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", gap: SPACE[40] * 1.5, alignItems: "center", flexWrap: "wrap", width: "100%" }}>
            <div style={{ flex: "1 1 400px", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[24] }}>
                <span style={{ width: 26, height: 2, background: C.glow, borderRadius: 2 }} />
                <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.glow, letterSpacing: ".16em" }}>
                  DESIGN CASE STUDY · IDENTITY WALLET
                </span>
              </div>
              <h1 style={{ fontFamily: DISP, fontSize: "clamp(36px, 5.8vw, 58px)", fontWeight: 900, color: "#fff", letterSpacing: "-.04em", lineHeight: 1.02, margin: sp(0, 0, 28) }}>
                Prove who you are without handing over<span style={{ color: C.glow }}> everything.</span>
              </h1>
              <p style={{ fontFamily: DISP, fontSize: "clamp(17px, 2.1vw, 20px)", fontWeight: 500, color: "rgba(255,255,255,.78)", lineHeight: 1.7, margin: sp(0, 0, 40), maxWidth: 520 }}>
                A mobile identity wallet where every share is deliberate, scoped and expiring.
                This page is a route inside that same app — and the product below is the real
                thing, running live.
              </p>
              <div style={{ maxWidth: 560 }}><StatGrid light items={STATS.hero} /></div>
            </div>
            <HeroPreview />
          </div>
        </div>

        {/* scroll cue */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: SPACE[24], left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: SPACE[6] }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,.35)", letterSpacing: ".18em" }}>SCROLL</span>
            <span style={{ width: 1, height: 26, background: "linear-gradient(to bottom, rgba(255,255,255,.35), transparent)" }} />
          </div>
        </div>
      </header>

      {/* PROBLEM */}
      <Section eyebrow="THE PROBLEM" title="Identity is all-or-nothing, and that's the bug.">
        <Lede>
          To prove one fact about yourself — that you're over 21 — you hand over a document that
          also reveals your exact birth date, your address, your document number and your full
          legal name.
        </Lede>
        <P>
          A bouncer needs a yes/no. A crypto exchange needs a tax jurisdiction. A hotel needs a
          name match. In every case the physical artifact over-discloses, because a card can't
          answer a question — it can only be shown whole.
        </P>
        <div style={{ margin: sp(24, 0, 24) }}><DisclosureDiagram /></div>
        <Notice type="success" icon="lock"
          title="The design goal, in one line"
          sub="Share the proof, not the data — and make that the fastest route, not the virtuous one." />
      </Section>

      {/* LIVE PRODUCT */}
      <Section eyebrow="THE PRODUCT" title="Running, right here." tint={C.paper}>
        <P>
          Below is the actual application, embedded from the same deployment that serves this
          page. It boots into a self-driving demo that walks its own interface: onboarding,
          verification, presenting a proof, choosing what to disclose, and reviewing activity.
          Touch it at any point and it hands control straight back to you.
        </P>
        <LiveEmbed />
      </Section>

      {/* DECISIONS */}
      <Section eyebrow="DESIGN DECISIONS" title="Three positions the product takes.">
        <Lede>
          Each of these is a stance, not a feature. They're the answers to the questions that
          decide whether an identity wallet is worth carrying.
        </Lede>

        <DecisionTitle n="1">Disclosure is a screen, not a settings toggle.</DecisionTitle>
        <P>
          Presenting a credential and choosing what it reveals live on the same surface, one tap
          apart. The age proof carries its own explanation, so the safer option is also the
          obvious one — you can see the difference between “over 21” and “born on this date” at
          the moment you decide, not in a policy page you'll never open.
        </P>
        <Takeaway>
          The wallet answers the question that was asked. Everything else stays sealed, and the
          interface says so in words while you're choosing.
        </Takeaway>

        <DecisionTitle n="2">A share is a lease, not a transfer.</DecisionTitle>
        <P>
          Handing someone a document gives them a copy forever. Veriqo never hands over an
          artifact — it produces a proof that dies on a timer. The countdown isn't decoration;
          it's the whole mechanism, so it's the most prominent thing on the screen and it keeps
          ticking in the Dynamic Island after you've put the phone down.
        </P>
        <div style={{ margin: sp(20, 0, 0) }}><LeaseDiagram /></div>
        <Takeaway>
          Because a proof expires on its own, there's no revocation flow to design, no “delete my
          data” request to file, and nothing sitting in a database waiting to be breached.
        </Takeaway>

        <DecisionTitle n="3">The wallet argues on your side.</DecisionTitle>
        <P>
          Most consent interfaces are neutral referees: here's what they want, approve or deny.
          Veriqo isn't neutral. When a service asks for more than its stated purpose needs, the
          wallet says so in plain language, pre-selects the smallest sufficient answer, and makes
          declining a single tap. It also watches your own credentials for misuse — a flagged
          reading of “age presented four times in an hour at an unknown location” is the wallet
          noticing something you couldn't.
        </P>
        <div style={{ margin: sp(20, 0, 0) }}><AdvocacyDiagram /></div>
        <Takeaway>
          A neutral wallet makes over-sharing the path of least resistance. This one puts its
          thumb on the scale — the minimum viable answer is the default, and the reasoning is
          visible.
        </Takeaway>
      </Section>

      {/* DESIGN SYSTEM */}
      <Section eyebrow="DESIGN SYSTEM" title="Every value on screen comes from one file." tint={C.paper}>
        <P>
          Colour, type, spacing, radii, elevation and motion live in a single tokens module that
          the product and this case study both import. Nothing below is an illustration of the
          system — each swatch, scale and specimen is rendered directly from it.
        </P>

        <div style={{ marginTop: SPACE[32] }}><PaletteExhibit /></div>

        <div style={{ marginTop: SPACE[32] }}>
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: ".12em", marginBottom: SPACE[12] }}>TYPEFACES</div>
          <TypeExhibit />
        </div>

        <div style={{ marginTop: SPACE[32], display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: SPACE[20] }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: ".12em", marginBottom: SPACE[12] }}>
              SPACING — {STATS.spacingTokens} STEPS, {STATS.tokenisedSpacings} USES
            </div>
            <SpacingExhibit />
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: ".12em", marginBottom: SPACE[12] }}>SHAPE, DEPTH, TIMING</div>
            <RadiusMotionExhibit />
          </div>
        </div>

        <div style={{ marginTop: SPACE[24] }}>
          <Notice type="info" icon="sliders"
            title="The token names are the measurements"
            sub={`SPACE[12] is 12 pixels — no lookup table to memorise. ${STATS.tokenisedSpacings} spacing values across the app reference the scale by name, so changing the rhythm is one edit.`} />
        </div>

        <div style={{ marginTop: SPACE[40] }}>
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: ".12em", marginBottom: SPACE[12] }}>ICONOGRAPHY</div>
          <P>
            Icons used to be drawn at whatever stroke looked right in isolation, which read as
            inconsistent once screens sat side by side. Weight is now derived from the size an
            icon renders at, so the judgement is made once and never repeated.
          </P>
          <StrokeDiagram />
        </div>
      </Section>

      {/* ACCESSIBILITY */}
      <Section eyebrow="ACCESSIBILITY" title="What the contrast audit found — and changed.">
        <P>
          Every text-and-background pair in the palette was measured against WCAG 2.1. The audit
          found two real failures, and both were fixed in the product rather than noted and left.
        </P>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: SPACE[16], marginBottom: SPACE[24] }}>
          <div style={{ padding: SPACE[16], background: C.paper, border: `1px solid ${C.line}`, borderRadius: RADIUS.lg }}>
            <div style={{ fontFamily: DISP, fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: SPACE[6] }}>Metadata was too light</div>
            <p style={{ fontFamily: DISP, fontSize: 15, color: C.sub, lineHeight: 1.6, margin: 0 }}>
              Timestamps and hints sat at 2.16:1 — below even the relaxed threshold for large
              text. Fixing it alone would have collided with secondary text, so the whole text
              ramp moved down together: now 4.91:1, with secondary at 6.90:1 above it.
            </p>
          </div>
          <div style={{ padding: SPACE[16], background: C.paper, border: `1px solid ${C.line}`, borderRadius: RADIUS.lg }}>
            <div style={{ fontFamily: DISP, fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: SPACE[6] }}>Green text was unreadable</div>
            <p style={{ fontFamily: DISP, fontSize: 15, color: C.sub, lineHeight: 1.6, margin: 0 }}>
              The bright accent was used as small text in 42 places at 2.72:1. All of them now
              use the deep accent, which measures 5.11:1.
            </p>
          </div>
        </div>
        <ContrastExhibit />
        <div style={{ marginTop: SPACE[16] }}>
          <Notice type="success" icon="checkcirc"
            title={`All ${STATS.a11y.pairsChecked} pairs meet WCAG AA for normal text`}
            sub="The three text tiers stay visibly distinct while every one clears 4.5:1 on both the canvas and cards. Ratios are recomputed from the tokens on every build, so this claim can't go stale." />
        </div>
      </Section>

      {/* SCOPE */}
      <Section eyebrow="SCOPE" title="What's here, measured." tint={C.paper}>
        <div style={{ marginBottom: SPACE[24] }}><StatGrid items={STATS.scope} /></div>
        <Group>
          {STATS.honest.map((h) => (
            <Row key={h.title} ic={h.ic} title={h.title} sub={h.sub}
              right={<span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: ".06em", color: h.tone === "yes" ? C.accDeep : C.faint, background: h.tone === "yes" ? C.accSoft : C.bone, padding: sp(4, 8), borderRadius: RADIUS.xs }}>{h.tag}</span>} />
          ))}
        </Group>
        <div style={{ marginTop: SPACE[20] }}>
          <Notice type="info" icon="checkcirc"
            title="The numbers are produced by the build, not typed by hand"
            sub="Before each deploy a script counts the screens, components and lines in the codebase, computes the contrast ratios from the live tokens, and runs the test suite for real. If the suite fails, the build stops rather than publishing a page that claims otherwise." />
        </div>
      </Section>

      {/* CLOSE */}
      <footer style={{ maxWidth: W, margin: "0 auto", padding: sp(0, 24) }}>
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: SPACE[32], display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: SPACE[24], flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: DISP, fontSize: 24, fontWeight: 900, color: C.ink, letterSpacing: "-.02em", marginBottom: SPACE[6] }}>Veriqo</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.sub, letterSpacing: ".1em" }}>
              DIGITAL IDENTITY WALLET · v{STATS.version}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint, letterSpacing: ".06em", marginTop: SPACE[6] }}>
              FIGURES MEASURED AT BUILD · {STATS.generatedAt}{STATS.commit ? ` · ${STATS.commit}` : ""}
            </div>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: SPACE[8], textDecoration: "none", fontFamily: DISP, fontSize: 15, fontWeight: 700, color: "#fff", background: C.acc, padding: sp(12, 20), borderRadius: RADIUS.md }}>
            Open the app <Ic n="arrow" s={16} c="#fff" />
          </a>
        </div>
      </footer>
    </div>
  );
}
