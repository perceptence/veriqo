import { C, DISP } from "../styles/tokens.js";
import { Grain } from "./Icon.jsx";

/* Logo concept marks — the live brand is `prism`. */
export function markSvg(name) {
  const I = {
    prism: (<>
      <polygon points="16,16 5.6,10 16,4" fill="#3BE7A4" />
      <polygon points="16,16 16,4 26.4,10" fill="#22C588" />
      <polygon points="16,16 26.4,10 26.4,22" fill="#15A06A" />
      <polygon points="16,16 26.4,22 16,28" fill="#0A5E3E" />
      <polygon points="16,16 16,28 5.6,22" fill="#084E34" />
      <polygon points="16,16 5.6,22 5.6,10" fill="#128A5C" />
      <polygon points="16,4 26.4,10 26.4,22 16,28 5.6,22 5.6,10" fill="none" stroke="#46F0AE" strokeWidth="0.8" opacity="0.5" />
      <polygon points="16,16 5.6,10 16,4" fill="#FFFFFF" opacity="0.14" />
    </>),
    ascent: (<>
      <path d="M7.5 15 L13 21.6" stroke="#15A06A" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 21.6 L25.6 6" stroke="#2FE38F" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
    </>),
    beacon: (<>
      <path d="M23.3 9.8 A10.8 10.8 0 0 1 23.3 22.2" fill="none" stroke="#15A06A" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
      <path d="M8.7 22.2 A10.8 10.8 0 0 1 8.7 9.8" fill="none" stroke="#15A06A" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
      <circle cx="16" cy="16" r="7.2" fill="none" stroke="#1BB078" strokeWidth="2.4" />
      <circle cx="16" cy="16" r="3.6" fill="#2FE38F" />
    </>),
    vee: (<>
      <path d="M6.8 7 L16 23.4" stroke="#15A06A" strokeWidth="4.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 23.4 L25.2 7" stroke="#2FE38F" strokeWidth="4.3" strokeLinecap="round" strokeLinejoin="round" />
    </>),
    vcheck: (<>
      <path d="M6 9 L14 21.6" stroke="#15A06A" strokeWidth="4.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 21.6 L27 5" stroke="#2FE38F" strokeWidth="4.3" strokeLinecap="round" strokeLinejoin="round" />
    </>),
    tick: (<>
      <path d="M7 16.6 L13.4 23 L25 8" stroke="#2FE38F" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
    </>),
    vbadge: (<>
      <circle cx="16" cy="16" r="11.6" fill="none" stroke="#15A06A" strokeWidth="2.4" />
      <path d="M10.4 16.2 L14.4 20.4 L22 11" stroke="#2FE38F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>),
  };
  return I[name] || I.prism;
}

export const LOGO = "prism";

export function LogoMark({ size = 30, mark = LOGO }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: C.ink,
      display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      overflow: "hidden", flexShrink: 0 }}>
      <Grain o={0.08} />
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 32 32" fill="none" style={{ position: "relative" }}>{markSvg(mark)}</svg>
    </div>
  );
}

export function Wordmark({ size = 30 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.32 }}>
      <LogoMark size={size} />
      <span style={{ fontFamily: DISP, fontSize: size * 0.64, fontWeight: 900, color: C.ink, letterSpacing: ".01em", lineHeight: 1 }}>VERIQO</span>
    </div>
  );
}
