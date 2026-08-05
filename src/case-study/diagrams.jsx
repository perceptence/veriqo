import { C, DISP, MONO, RADIUS, SPACE, sp, strokeFor } from "../styles/tokens.js";
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

/* ---- 3 · scale the artwork vs scale the device ----------------------- */
export function FrameDiagram() {
  const Phone = ({ w, h, label, stretched }) => (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: w, height: h, margin: "0 auto", borderRadius: 14, background: C.ink,
        border: `2px solid ${C.ink}`, position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          position: "absolute", inset: 5, borderRadius: 10, background: C.bone,
          display: "flex", flexDirection: "column", gap: 4, padding: 7,
        }}>
          {[100, 78, 90].map((pct, i) => (
            <div key={i} style={{
              height: stretched ? 11 : 8, width: `${pct}%`, borderRadius: 3,
              background: i === 0 ? C.acc : "rgba(20,18,16,.16)",
              transform: stretched ? "scaleX(1.06)" : "none", transformOrigin: "left",
            }} />
          ))}
        </div>
      </div>
      <Label tone={stretched ? "#D93025" : C.accDeep}>{label}</Label>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: SPACE[16], flexWrap: "wrap", alignItems: "stretch" }}>
      <Card tone="#E4C9C4" bg="#FDF6F5">
        <div style={{ marginBottom: SPACE[16] }}><Phone w={104} h={150} label="STRETCH THE ARTWORK" stretched /></div>
        <div style={{ fontFamily: DISP, fontSize: 14, fontWeight: 500, color: C.sub, lineHeight: 1.55 }}>
          Scaling the interface up to fill a larger screen made the browser redraw scrolling
          lists incorrectly — corners leaked past the bezel and the bottom edge shimmered.
        </div>
      </Card>
      <Arrow />
      <Card tone={C.acc} bg={C.accSoft}>
        <div style={{ marginBottom: SPACE[16] }}><Phone w={92} h={150} label="RESIZE THE DEVICE" /></div>
        <div style={{ fontFamily: DISP, fontSize: 14, fontWeight: 500, color: C.sub, lineHeight: 1.55 }}>
          Instead the phone illustration is drawn at the size the interface was designed for,
          and the whole assembly scales as one piece. Same result on screen, nothing stretched.
        </div>
      </Card>
    </div>
  );
}
