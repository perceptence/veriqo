import { C, DISP, MONO } from "../styles/tokens.js";
import { Ic } from "../components/Icon.jsx";
import { LogoMark, LOGO } from "../components/Logo.jsx";

export function IslandShowcase({ fire }) {
  const demos = [
    { k: "share", t: "Sharing a proof", d: "Counts down while a verifier reads it", ic: "share" },
    { k: "request", t: "Incoming connection request", d: "An external app asks to verify you", ic: "plug" },
    { k: "added", t: "Added to Apple Wallet", d: "Confirms a pass was saved", ic: "applewallet" },
    { k: "venue", t: "Venue detected nearby", d: "Walk-in trigger: Veriqo surfaces the required ID", ic: "scan" },
  ];
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.acc, fontWeight: 700, letterSpacing: ".12em", marginBottom: 7 }}>LIVE ACTIVITY</div>
        <h1 style={{ fontFamily: DISP, fontSize: 30, fontWeight: 900, color: C.ink, letterSpacing: "-.025em", lineHeight: 0.98 }}>Dynamic Island.</h1>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18 }}>
        <p style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: 18, lineHeight: 1.5 }}>
          Veriqo surfaces sharing, incoming requests, and pass confirmations right in the Island — glanceable, never buried. Tap a state below and watch the top of the phone.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {demos.map((d) => (
            <button key={d.k} onClick={() => fire(d.k)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: C.paper, border: `1px solid ${C.line}`, borderRadius: 16, cursor: "pointer", textAlign: "left", boxShadow: "0 2px 8px rgba(20,18,16,.03)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.ink, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n={d.ic} s={20} c={C.glow} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: C.ink, letterSpacing: "-.01em" }}>{d.t}</div>
                <div style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 500, color: C.faint, marginTop: 1 }}>{d.d}</div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.acc, fontWeight: 700, letterSpacing: ".06em" }}>PLAY ▸</div>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "13px 15px", background: C.accSoft, borderRadius: 13, marginTop: 18 }}>
          <Ic n="spark" s={16} c={C.acc} />
          <p style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.accDeep, lineHeight: 1.45 }}>
            On a real device these become Live Activities on the Lock Screen too.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LogoStudio() {
  const opts = [
    { k: "prism", name: "Prism Seal", desc: "Holographic seal of a genuine ID" },
    { k: "vcheck", name: "V-Check", desc: "Veriqo's V resolving into a tick" },
    { k: "vee", name: "The V", desc: "A bold V, folded for depth" },
    { k: "tick", name: "Check", desc: "A clean, confident verification" },
    { k: "vbadge", name: "Sealed V", desc: "A check sealed in a ring" },
    { k: "ascent", name: "Ascent", desc: "A folded check on the rise" },
  ];
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 0" }}>
      <div style={{ flexShrink: 0, marginBottom: 6 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.acc, fontWeight: 700, letterSpacing: ".12em", marginBottom: 7 }}>BRAND IDEA</div>
        <h1 style={{ fontFamily: DISP, fontSize: 30, fontWeight: 900, color: C.ink, letterSpacing: "-.025em" }}>From scratch.</h1>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingBottom: 24, marginTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {opts.map((o) => (
            <div key={o.k} style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 18, padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
              {o.k === LOGO && <div style={{ position: "absolute", top: 10, right: 10, fontFamily: MONO, fontSize: 8.5, color: C.acc, fontWeight: 700, letterSpacing: ".06em" }}>● LIVE</div>}
              <LogoMark size={64} mark={o.k} />
              <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 800, color: C.ink, marginTop: 13, letterSpacing: "-.01em" }}>{o.name}</div>
              <div style={{ fontFamily: DISP, fontSize: 11.5, fontWeight: 500, color: C.faint, marginTop: 3, lineHeight: 1.35 }}>{o.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "13px 15px", background: C.accSoft, borderRadius: 13, marginTop: 14 }}>
          <Ic n="spark" s={16} c={C.acc} />
          <p style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.accDeep, lineHeight: 1.45 }}>
            Prism Seal is live. It borrows the one thing every passport and license shares — the shifting holographic seal that proves it's genuine — so it means "verified identity" without drawing a card.
          </p>
        </div>
      </div>
    </div>
  );
}
