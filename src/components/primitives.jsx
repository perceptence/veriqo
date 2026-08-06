import React from "react";
import { C, DISP, MONO, SPACE, sp, STATUS } from "../styles/tokens.js";
import { Ic } from "./Icon.jsx";

/* ---- Back button ---- */
export function Back({ onClick, light = false }) {
  return (
    <button onClick={onClick} style={{
      background: light ? "rgba(255,255,255,.1)" : C.paper,
      border: `1px solid ${light ? "rgba(255,255,255,.15)" : C.line}`,
      cursor: "pointer", width: 42, height: 42, borderRadius: 13,
      color: light ? "#fff" : C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}

/* ---- Screen header: back row, eyebrow, title ---- */
export function Header({ back, eyebrow, title, light = false, action }) {
  return (
    <>
      {(back || action) && <div className="fu" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SPACE[16] }}>
        {back ? <Back onClick={back} light={light} /> : <span />}
        {action || null}
      </div>}
      <div className="fu1">
        {eyebrow && <div style={{ fontFamily: MONO, fontSize: 11, color: light ? C.glow : C.acc, fontWeight: 700, letterSpacing: ".12em", marginBottom: SPACE[6] }}>{eyebrow}</div>}
        <h1 style={{ fontFamily: DISP, fontSize: 30, fontWeight: 900, color: light ? "#fff" : C.ink, letterSpacing: "-.025em", lineHeight: 0.98 }}>{title}</h1>
      </div>
    </>
  );
}

/* ---- Primary/ghost button ---- */
export function Btn({ label, onClick, ghost = false, disabled = false, variant = "ink" }) {
  /* danger's fill is STATUS.danger.text, not .color — white text on the raw
     .color (#D9583F) measures 3.88:1 and fails AA. The darker `text` variant
     was tuned to clear 4.5:1 as text on a light bg, which is symmetric with
     white text on it as a solid fill: 6.62:1. */
  const styles = {
    ink: { bg: C.ink, fg: "#fff", sh: "0 10px 20px rgba(20,18,16,.22)" },
    light: { bg: "#fff", fg: C.ink, sh: "0 10px 20px rgba(0,0,0,.2)" },
    danger: { bg: STATUS.danger.text, fg: "#fff", sh: "0 10px 20px rgba(168,52,28,.28)" },
  };
  const v = ghost ? { bg: "transparent", fg: C.ink, sh: "none" }
    : disabled ? { bg: "#C5C0B7", fg: "#fff", sh: "none" } : styles[variant];
  return (
    <button onClick={disabled ? undefined : onClick}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      style={{ width: "100%", padding: sp(16, 20),
        border: ghost ? `1.5px solid ${C.line}` : "none", borderRadius: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: DISP, fontSize: 15.5, fontWeight: 700, letterSpacing: "-.01em",
        background: v.bg, color: v.fg,
        display: "flex", alignItems: "center", justifyContent: "center", gap: SPACE[8],
        boxShadow: v.sh, transition: "transform .12s", opacity: disabled ? 0.9 : 1 }}>{label}</button>
  );
}

/* ---- Toggle switch ---- */
export function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 46, height: 27, borderRadius: 16, border: "none",
      cursor: "pointer", background: on ? C.acc : "rgba(20,18,16,.16)", position: "relative",
      transition: "background .25s", padding: 0 }}>
      <div style={{ width: 21, height: 21, borderRadius: "50%", background: "#fff", position: "absolute",
        top: 3, left: on ? 22 : 3, transition: "left .25s cubic-bezier(.16,1,.3,1)",
        boxShadow: "0 1px 3px rgba(0,0,0,.25)" }} />
    </button>
  );
}

/* ---- List row ---- */
export function Row({ ic, title, sub, right, onClick, danger, last }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: SPACE[12],
      padding: sp(12, 16), cursor: onClick ? "pointer" : "default",
      borderTop: last ? "none" : "none" }}>
      {/* Icon fill stays STATUS.danger.color (a graphic, needs 3:1 — 3.17:1
          on this tint). The title is real text, so it takes .text instead:
          .color measured 3.88:1 there and failed AA. */}
      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: danger ? STATUS.danger.bg : C.bone, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ic n={ic} s={17} c={danger ? STATUS.danger.color : C.ink} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: DISP, fontSize: 14.5, fontWeight: 700, color: danger ? STATUS.danger.text : C.ink, letterSpacing: "-.01em" }}>{title}</div>
        {sub && <div style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.faint, marginTop: SPACE[1] }}>{sub}</div>}
      </div>
      {right}
      {onClick && !right && <Ic n="chev" s={16} c={C.faint} />}
    </div>
  );
}

/* ---- Grouped card container (adds dividers between children) ---- */
export function Group({ children }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden" }}>
      {React.Children.toArray(children).map((ch, i) => (
        <div key={i} style={{ borderTop: i ? `1px solid ${C.line}` : "none" }}>{ch}</div>
      ))}
    </div>
  );
}

/* ---- Inline status notice ---- */
export function Notice({ icon = "shield", title, sub, type = "info", className, style = {}, onClick }) {
  /* This used to carry its own copy of STATUS with the same three failing
     text colours the case study's audit found (warning 3.18:1, error
     4.07:1) — reading from the shared token means this can't drift out of
     sync with it again. */
  const T = STATUS[type] || STATUS.info;
  return (
    <div className={className} onClick={onClick} style={{ background: T.bg, borderRadius: 13, padding: sp(12, 12), ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: sub ? 5 : 0 }}>
        <Ic n={icon} s={13} c={T.color} />
        <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{title}</span>
      </div>
      {sub && <p style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: T.text, lineHeight: 1.5, margin: sp(4, 0, 0, 0) }}>{sub}</p>}
    </div>
  );
}

/* ---- Data rows (dark credential field list) ---- */
export function DataRows({ rows }) {
  return (
    <div style={{ background: C.ink, borderRadius: 16, overflow: "hidden", boxShadow: "0 14px 18px -14px rgba(20,18,16,.32)" }}>
      {rows.map(([k, v], i) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: sp(12, 16),
          borderTop: i ? "1px solid rgba(255,255,255,.08)" : "none" }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,.5)", letterSpacing: ".05em" }}>{k}</span>
          <span style={{ fontFamily: MONO, fontSize: 13, color: "#fff", fontWeight: 700, letterSpacing: ".02em" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- Progress bar (4-step onboarding) ---- */
export function PBar({ step }) {
  return (
    <div style={{ display: "flex", gap: SPACE[4], margin: sp(16, 0, 0) }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ flex: 1, height: 6, borderRadius: 6, overflow: "hidden", background: "rgba(20,18,16,.09)" }}>
          <div style={{ height: "100%", borderRadius: 6, width: i < step ? "100%" : i === step ? "55%" : "0%", background: C.ink, transition: "width .6s cubic-bezier(.16,1,.3,1)" }} />
        </div>
      ))}
    </div>
  );
}

/* ---- Step dots (capture flows) ---- */
export function StepDots({ total, current, light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: SPACE[4] }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 3, borderRadius: 2, transition: "all .35s cubic-bezier(.16,1,.3,1)",
          width: i === current ? 22 : 8,
          background: i < current ? (light ? C.acc : C.ink) : i === current ? (light ? "rgba(255,255,255,.9)" : C.ink) : (light ? "rgba(255,255,255,.5)" : "rgba(20,18,16,.12)") }} />
      ))}
    </div>
  );
}

/* ---- Progress dots (onboarding 3-step) ---- */
export function ProgressDots({ current, total }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: SPACE[4], paddingBottom: SPACE[8] }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ height: 3, borderRadius: 2, transition: "all .3s ease",
          background: i < current ? C.ink : "rgba(20,18,16,.12)", width: i === current - 1 ? 22 : 8 }} />
      ))}
    </div>
  );
}
