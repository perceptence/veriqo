import { C, DISP, MONO, NUM, RADIUS, SPACE, sp, strokeFor } from "../styles/tokens.js";
import { Ic } from "../components/Icon.jsx";

/* ============================================================================
   Diagrams for the case study — drawn with the product's own tokens, so the
   explanations look like they belong to the same system as the product.
   Each one replaces a code listing with the idea the code expresses.
============================================================================ */

const Label = ({ children, tone = C.faint }) => (
  <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: tone, letterSpacing: ".1em" }}>{children}</div>
);

const Card = ({ tone = C.line, bg = C.paper, children, style }) => (
  <div style={{ flex: 1, minWidth: 0, background: bg, border: `1.5px solid ${tone}`, borderRadius: RADIUS.lg, padding: SPACE[16], ...style }}>
    {children}
  </div>
);

const Arrow = () => (
  <div aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: sp(0, 4), color: C.faint, flexShrink: 0 }}>
    <Ic n="arrow" s={20} c={C.faint} />
  </div>
);

/* ---- 1 · what a physical ID reveals vs what a proof reveals ---------- */
export function DisclosureDiagram() {
  const fields = [
    ["Full legal name", true], ["Exact date of birth", true], ["Home address", true],
    ["Document number", true], ["Photograph", true], ["Over 21", true],
  ];
  return (
    <div style={{ display: "flex", gap: SPACE[16], flexWrap: "wrap", alignItems: "stretch" }}>
      <Card tone="#E4C9C4" bg="#FDF6F5">
        <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[12] }}>
          <Ic n="card" s={18} c="#D93025" />
          <Label tone="#D93025">SHOWING A PHYSICAL ID</Label>
        </div>
        {fields.map(([f]) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: SPACE[8], padding: sp(4, 0) }}>
            <Ic n="eye" s={14} c="#D93025" />
            <span style={{ fontFamily: DISP, fontSize: 14, fontWeight: 600, color: C.ink }}>{f}</span>
          </div>
        ))}
        <div style={{ fontFamily: MONO, fontSize: 11, color: "#D93025", marginTop: SPACE[12], letterSpacing: ".05em" }}>6 OF 6 REVEALED</div>
      </Card>

      <Arrow />

      <Card tone={C.acc} bg={C.accSoft}>
        <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[12] }}>
          <Ic n="shield" s={18} c={C.accDeep} />
          <Label tone={C.accDeep}>PRESENTING A VERIQO PROOF</Label>
        </div>
        {fields.map(([f]) => {
          const shown = f === "Over 21";
          return (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: SPACE[8], padding: sp(4, 0), opacity: shown ? 1 : 0.45 }}>
              <Ic n={shown ? "check" : "lock"} s={14} c={shown ? C.accDeep : C.faint} />
              <span style={{ fontFamily: DISP, fontSize: 14, fontWeight: shown ? 800 : 500, color: shown ? C.ink : C.faint, textDecoration: shown ? "none" : "line-through" }}>{f}</span>
            </div>
          );
        })}
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.accDeep, marginTop: SPACE[12], letterSpacing: ".05em" }}>1 OF 6 REVEALED</div>
      </Card>
    </div>
  );
}

/* ---- 2 · stroke weight derived from render size ---------------------- */
export function StrokeDiagram() {
  const steps = [
    { size: 12, band: "≤ 14px", why: "badges, inline marks" },
    { size: 18, band: "15 – 24px", why: "rows, buttons, tabs" },
    { size: 32, band: "≥ 25px", why: "headers, empty states" },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: SPACE[12], flexWrap: "wrap" }}>
        {steps.map((s) => (
          <Card key={s.size} style={{ textAlign: "center" }}>
            <div style={{ height: 76, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="shield" s={s.size} c={C.ink} />
            </div>
            <Label>{s.band}</Label>
            <div style={{ fontFamily: DISP, fontSize: 22, fontWeight: 900, color: C.accDeep, marginTop: SPACE[4] }}>{strokeFor(s.size)}</div>
            <div style={{ fontFamily: DISP, fontSize: 13, color: C.sub, marginTop: SPACE[2] }}>stroke weight</div>
            <div style={{ fontFamily: DISP, fontSize: 13, color: C.faint, marginTop: SPACE[6] }}>{s.why}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginTop: SPACE[12], padding: sp(12, 16), background: C.bone, borderRadius: RADIUS.md }}>
        <Ic n="bulb" s={17} c={C.accDeep} />
        <span style={{ fontFamily: DISP, fontSize: 14.5, fontWeight: 600, color: C.sub }}>
          Smaller icon → heavier stroke, so all three read at the same visual weight.
        </span>
      </div>
    </div>
  );
}

/* ---- 2 · a share is a lease, not a transfer -------------------------- */
export function LeaseDiagram() {
  const Ring = ({ pct, label }) => {
    const r = 26, circ = 2 * Math.PI * r;
    return (
      <svg width="68" height="68" viewBox="0 0 68 68" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(20,18,16,.10)" strokeWidth="5" />
        <circle cx="34" cy="34" r={r} fill="none" stroke={C.acc} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} />
      </svg>
    );
  };
  return (
    <div style={{ display: "flex", gap: SPACE[16], flexWrap: "wrap", alignItems: "stretch" }}>
      <Card tone="#E4C9C4" bg="#FDF6F5">
        <Label tone="#D93025">HANDING OVER A COPY</Label>
        <div style={{ marginTop: SPACE[16], display: "flex", alignItems: "center", gap: SPACE[12] }}>
          <Ic n="card" s={26} c="#D93025" />
          <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 800, color: C.ink }}>Permanent</div>
        </div>
        <div style={{ marginTop: SPACE[12], display: "flex", flexDirection: "column", gap: SPACE[6] }}>
          {["Lives on their server indefinitely", "Can be copied, sold or breached", "You cannot take it back"].map((t) => (
            <div key={t} style={{ display: "flex", gap: SPACE[8], alignItems: "flex-start" }}>
              <span style={{ marginTop: 6, width: 5, height: 5, borderRadius: RADIUS.round, background: "#D93025", flexShrink: 0 }} />
              <span style={{ fontFamily: DISP, fontSize: 14, fontWeight: 500, color: C.sub, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      </Card>

      <Arrow />

      <Card tone={C.acc} bg={C.accSoft}>
        <Label tone={C.accDeep}>PRESENTING A PROOF</Label>
        <div style={{ marginTop: SPACE[12], display: "flex", alignItems: "center", gap: SPACE[12] }}>
          <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
            <Ring pct={0.72} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontFamily: NUM, fontSize: 19, color: C.ink, lineHeight: 1 }}>0:21</span>
            </div>
          </div>
          <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 800, color: C.ink }}>Expires as you watch</div>
        </div>
        <div style={{ marginTop: SPACE[12], display: "flex", flexDirection: "column", gap: SPACE[6] }}>
          {["Valid for 30 seconds, then dead", "One-time PIN works once", "Nothing to store, so nothing to leak"].map((t) => (
            <div key={t} style={{ display: "flex", gap: SPACE[8], alignItems: "flex-start" }}>
              <span style={{ marginTop: 3, flexShrink: 0 }}><Ic n="check" s={13} c={C.accDeep} /></span>
              <span style={{ fontFamily: DISP, fontSize: 14, fontWeight: 500, color: C.sub, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---- 3 · the wallet argues on the holder's behalf -------------------- */
export function AdvocacyDiagram() {
  const opts = [
    { l: "Full address", d: "Street, city, state, ZIP", risk: "High exposure", tone: "#C07B00", bg: "#FEF4E6", on: false },
    { l: "City only", d: "San Francisco", risk: "Recommended", tone: C.accDeep, bg: C.accSoft, on: true },
    { l: "State only", d: "California", risk: "Minimal exposure", tone: "#C07B00", bg: "#FEF4E6", on: false },
    { l: "Decline", d: "Revoke this request", risk: "", tone: C.faint, bg: C.bone, on: false },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: SPACE[12], flexWrap: "wrap", alignItems: "stretch" }}>
        <Card tone="#E4C9C4" bg="#FDF6F5" style={{ flex: "1 1 210px" }}>
          <Label tone="#D93025">WHAT WAS ASKED FOR</Label>
          <div style={{ marginTop: SPACE[12], display: "flex", alignItems: "center", gap: SPACE[8] }}>
            <Ic n="plug" s={18} c="#D93025" />
            <span style={{ fontFamily: DISP, fontSize: 15, fontWeight: 800, color: C.ink }}>Coinbase</span>
          </div>
          <div style={{ fontFamily: DISP, fontSize: 14, color: C.sub, marginTop: SPACE[6], lineHeight: 1.5 }}>
            Added an <strong style={{ color: C.ink }}>Address</strong> field to an existing request.
          </div>
        </Card>

        <Arrow />

        <Card tone={C.acc} bg={C.paper} style={{ flex: "1 1 320px" }}>
          <Label tone={C.accDeep}>WHAT THE WALLET RECOMMENDS</Label>
          <div style={{ display: "flex", gap: SPACE[8], marginTop: SPACE[12], marginBottom: SPACE[12], padding: sp(8, 12), background: C.accSoft, borderRadius: RADIUS.sm }}>
            <span style={{ flexShrink: 0, marginTop: 2 }}><Ic n="pulse" s={14} c={C.accDeep} /></span>
            <span style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 600, color: C.accDeep, lineHeight: 1.5 }}>
              City is enough for tax residency. Sharing your full address gives Coinbase more than they need.
            </span>
          </div>
          {opts.map((o) => (
            <div key={o.l} style={{ display: "flex", alignItems: "center", gap: SPACE[8], padding: sp(6, 0) }}>
              <span style={{
                width: 15, height: 15, borderRadius: RADIUS.round, flexShrink: 0,
                border: `2px solid ${o.on ? C.acc : C.line}`, background: o.on ? C.acc : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{o.on && <span style={{ width: 5, height: 5, borderRadius: RADIUS.round, background: "#fff" }} />}</span>
              <span style={{ fontFamily: DISP, fontSize: 14, fontWeight: o.on ? 800 : 500, color: o.on ? C.ink : C.sub, flex: 1 }}>{o.l}</span>
              {o.risk && (
                <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: o.tone, background: o.bg, padding: sp(2, 6), borderRadius: RADIUS.xs, letterSpacing: ".04em", flexShrink: 0 }}>{o.risk}</span>
              )}
            </div>
          ))}
        </Card>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginTop: SPACE[12], padding: sp(12, 16), background: C.bone, borderRadius: RADIUS.md }}>
        <Ic n="shield" s={17} c={C.accDeep} />
        <span style={{ fontFamily: DISP, fontSize: 14.5, fontWeight: 600, color: C.sub }}>
          The safest option is the one already selected — declining costs one tap, not a menu dive.
        </span>
      </div>
    </div>
  );
}
