import React, { useState } from "react";
import { C, DISP, MONO, NUM } from "../styles/tokens.js";
import { Ic } from "./Icon.jsx";

export function DynamicIsland({ island, onDismiss, onOpenRequest }) {
  const active = island.mode !== "idle";
  const sy = React.useRef(null);
  const [dy, setDy] = useState(0);
  const dims = active
    ? { w: 312, h: island.mode === "added" ? 58 : 78, r: 24 }
    : { w: 118, h: 27, r: 16 };
  const onDown = (e) => { if (active) sy.current = e.clientY; };
  const onMove = (e) => { if (sy.current != null) { const d = Math.min(0, e.clientY - sy.current); setDy(d); } };
  const onUp = () => {
    if (sy.current != null) {
      if (dy < -18) onDismiss();
      else if (island.mode === "request") onOpenRequest && onOpenRequest();
      else onDismiss();
      sy.current = null; setDy(0);
    }
  };
  return (
    <div
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
      style={{ position: "absolute", top: 9, left: "50%", zIndex: 320, background: "#080806",
        transform: `translateX(-50%) translateY(${dy}px)`,
        width: dims.w, height: dims.h, borderRadius: dims.r, overflow: "hidden",
        cursor: active ? "grab" : "default", opacity: active ? (1 + dy / 60) : 1, touchAction: "none",
        transition: sy.current != null ? "none" : "width .42s cubic-bezier(.6,0,.2,1.2), height .42s cubic-bezier(.6,0,.2,1.2), border-radius .42s, transform .25s, opacity .25s",
        boxShadow: active ? "0 12px 30px rgba(0,0,0,.5)" : "none" }}>
      {active && (
        <div style={{ padding: "0 16px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", animation: "islandIn .3s ease both" }}>
          {island.mode !== "added" && <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 32, height: 3, borderRadius: 3, background: "rgba(255,255,255,.22)" }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: island.mode === "added" ? 0 : 6 }}>
            {island.mode === "verify" && <>
              <svg width="26" height="26" viewBox="0 0 26 26" style={{ animation: "spinArc .9s linear infinite", flexShrink: 0 }}>
                <circle cx="13" cy="13" r="10" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2.6" />
                <circle cx="13" cy="13" r="10" fill="none" stroke={C.glow} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="20 100" />
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: "#fff" }}>Verifying identity</div>
                <div style={{ fontFamily: MONO, fontSize: 9.5, color: "rgba(255,255,255,.55)", marginTop: 2, letterSpacing: ".06em" }}>VERIQO NETWORK · LIVE</div>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.glow, animation: "breathe 1.4s ease infinite" }} />
            </>}
            {island.mode === "share" && <>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: C.acc + "30", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic n="share" s={16} c={C.glow} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: "#fff" }}>Sharing with {island.sub}</div>
                <div style={{ fontFamily: MONO, fontSize: 9.5, color: "rgba(255,255,255,.55)", marginTop: 2, letterSpacing: ".06em" }}>PROOF EXPIRES IN</div>
              </div>
              <div style={{ fontFamily: NUM, fontSize: 24, color: C.glow, lineHeight: 1 }}>0:{String(island.t).padStart(2, "0")}</div>
            </>}
            {island.mode === "request" && <>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic n={island.ic || "globe"} s={16} c="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{island.name} wants to connect</div>
                <div style={{ fontFamily: MONO, fontSize: 9.5, color: "rgba(255,255,255,.55)", marginTop: 2, letterSpacing: ".06em" }}>TAP TO REVIEW</div>
              </div>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.glow, animation: "breathe 1.4s ease infinite" }} />
            </>}
            {island.mode === "added" && <>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.acc, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic n="check" s={15} c="#fff" sw={3} />
              </div>
              <div style={{ flex: 1, fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: "#fff" }}>Added to Apple Wallet</div>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}

export function TabBar({ tab, setTab }) {
  const tabs = [{ k: "wallet", ic: "wallet", l: "Wallet" }, { k: "pulse", ic: "pulse", l: "Pulse" }];
  return (
    <div style={{ position: "absolute", bottom: 14, left: 20, right: 20, height: 60, borderRadius: 26,
      zIndex: 120, display: "flex", alignItems: "center", padding: "0 6px",
      background: "rgba(248,245,239,.66)", backdropFilter: "blur(22px) saturate(180%)",
      WebkitBackdropFilter: "blur(22px) saturate(180%)", border: "1px solid rgba(255,255,255,.55)",
      boxShadow: "0 12px 34px rgba(20,18,16,.2), inset 0 1px 0 rgba(255,255,255,.6)" }}>
      {tabs.map((t) => {
        const a = tab === t.k;
        return (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, height: 48, margin: "0 2px",
            background: a ? "rgba(20,18,16,.07)" : "transparent", borderRadius: 18, border: "none",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, transition: "background .2s" }}>
            <Ic n={t.ic} s={20} c={a ? C.ink : C.faint} sw={a ? 2.4 : 2} />
            <span style={{ fontFamily: DISP, fontSize: 10, fontWeight: a ? 800 : 600, color: a ? C.ink : C.faint, letterSpacing: "-.01em" }}>{t.l}</span>
          </button>
        );
      })}
    </div>
  );
}
