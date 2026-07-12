import { C, DISP, MONO, SPACE, sp } from "../styles/tokens.js";
import { Grain, Ic } from "./Icon.jsx";
import { BitAvatar } from "./BitAvatar.jsx";
import { credBy, expiryOf, EXP } from "../data/credentials.js";

/* Straight, static ID card (used in review/hero contexts) */
export function IDCard({ w = 222, h = 140, photo = 46, credKey = "dl" }) {
  const c = credBy(credKey);
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 16,
      background: `linear-gradient(150deg,${C.ink2},${C.ink})`, overflow: "hidden",
      boxShadow: "0 22px 26px -18px rgba(20,18,16,.4)" }}>
      <Grain o={0.08} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: c.accent }} />
      <div style={{ position: "absolute", top: 16, left: 15, right: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 8, color: "rgba(255,255,255,.5)", fontWeight: 700, letterSpacing: ".1em" }}>{(c.short || c.type).toUpperCase()}</div>
        <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: c.accent + "26", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ic n={c.ic} s={11} c={c.accent} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 34, left: 15, display: "flex", gap: SPACE[12], alignItems: "center" }}>
        <div style={{ width: photo, height: photo * 1.25, borderRadius: 8, overflow: "hidden", background: C.bone, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <BitAvatar size={photo * 1.18} />
        </div>
        <div>
          {[58, 40, 48].map((wd, i) => (
            <div key={i} style={{ height: 6, width: wd, marginBottom: SPACE[6], borderRadius: 3, background: i === 0 ? C.glow : "rgba(255,255,255,.28)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Full credential card with holder row */
export function CredCard({ c, onClick, h = 152, showPhoto = true }) {
  return (
    <div onClick={onClick} style={{ position: "relative", width: "100%", height: h, borderRadius: 18,
      overflow: "hidden", cursor: onClick ? "pointer" : "default",
      background: "linear-gradient(150deg,#2A2620,#141210)", boxShadow: "0 24px 26px -24px rgba(20,18,16,.5)" }}>
      <Grain o={0.08} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: c.accent }} />
      <div style={{ position: "relative", padding: sp(16, 16, 16), height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: DISP, fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-.01em" }}>{c.type}</div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,.55)", marginTop: SPACE[4], letterSpacing: ".08em" }}>{c.issuer.toUpperCase()}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, background: c.accent + "26", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n={c.ic} s={19} c={c.accent} />
          </div>
        </div>
        <div style={{ flex: 1 }} />
        {showPhoto && (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: SPACE[8], alignItems: "center" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", background: C.bone, flexShrink: 0 }}><BitAvatar size={34} /></div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 8, color: "rgba(255,255,255,.5)", letterSpacing: ".08em" }}>{c.token ? "TOKENISED" : "HOLDER"}</div>
                <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: "#fff", marginTop: SPACE[1] }}>{c.fields[0][1]}</div>
              </div>
            </div>
            <span style={{ fontFamily: DISP, fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,.5)", letterSpacing: ".06em" }}>VERIQO</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* Compact credential tile with expiry badge */
export function CredTile({ c, onClick }) {
  const exp = expiryOf(c);
  const status = exp?.status || "valid";
  return (
    <button onClick={onClick} style={{ position: "relative", height: 146, borderRadius: 18,
      overflow: "hidden", cursor: "pointer", border: "none", padding: 0, textAlign: "left", width: "100%",
      background: "linear-gradient(155deg,#2A2620,#141210)", boxShadow: "0 16px 18px -16px rgba(20,18,16,.42)" }}>
      <Grain o={0.08} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: c.accent }} />
      <div style={{ position: "relative", padding: SPACE[16], height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: c.accent + "26", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n={c.ic} s={19} c={c.accent} />
          </div>
          {status === "valid"
            ? <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.glow, marginTop: SPACE[4] }} />
            : <div style={{ padding: sp(3, 8), borderRadius: 20, background: EXP[status].bg, display: "flex", alignItems: "center", gap: SPACE[4] }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: EXP[status].color }} />
                <span style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: EXP[status].color, letterSpacing: ".05em" }}>{EXP[status].label}</span>
              </div>}
        </div>
        <div>
          <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-.01em" }}>{c.type}</div>
          <div style={{ fontFamily: MONO, fontSize: 8.5, color: "rgba(255,255,255,.5)", marginTop: SPACE[4], letterSpacing: ".06em" }}>{c.issuer.toUpperCase()}</div>
        </div>
      </div>
    </button>
  );
}

/* Deterministic QR code */
export function QR({ size = 176, seed = "vera-token-7Q2K" }) {
  const n = 25, cell = size / n;
  let h = 2166136261;
  for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
  const fin = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const cells = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (fin(x, y)) continue;
    if (rnd() > 0.5) cells.push(<rect key={x + "-" + y} x={x * cell} y={y * cell} width={cell} height={cell} fill={C.ink} />);
  }
  const finder = (ox, oy) => (
    <g key={ox + "f" + oy}>
      <rect x={ox * cell} y={oy * cell} width={7 * cell} height={7 * cell} fill={C.ink} rx={cell} />
      <rect x={(ox + 1) * cell} y={(oy + 1) * cell} width={5 * cell} height={5 * cell} fill="#fff" rx={cell * 0.7} />
      <rect x={(ox + 2) * cell} y={(oy + 2) * cell} width={3 * cell} height={3 * cell} fill={C.ink} rx={cell * 0.5} />
    </g>
  );
  return (
    <div style={{ padding: SPACE[12], background: "#fff", borderRadius: 18, boxShadow: "0 12px 30px rgba(20,18,16,.14)" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {cells}
        {finder(0, 0)}{finder(n - 7, 0)}{finder(0, n - 7)}
        <rect x={size / 2 - cell * 2.4} y={size / 2 - cell * 2.4} width={cell * 4.8} height={cell * 4.8} rx={cell * 1.4} fill="#fff" />
        <rect x={size / 2 - cell * 1.7} y={size / 2 - cell * 1.7} width={cell * 3.4} height={cell * 3.4} rx={cell} fill={C.acc} />
      </svg>
    </div>
  );
}
