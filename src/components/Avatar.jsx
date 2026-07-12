import { C, MONO, SPACE, sp } from "../styles/tokens.js";
import { Ic } from "./Icon.jsx";
import { BitAvatar as BitAvatarBase } from "./BitAvatar.jsx";

export { BitAvatar } from "./BitAvatar.jsx";

/* Avatar wrapped in the verified ring + badge */
export function BadgedAvatar({ size = 62 }) {
  const ring = size + 6;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 0 }}>
      <div style={{ width: ring, height: ring, borderRadius: "50%", border: `2px solid ${C.acc}`, padding: SPACE[2], boxSizing: "border-box" }}>
        <div style={{ borderRadius: "50%", overflow: "hidden", width: "100%", height: "100%" }}>
          <BitAvatarBase size={size} />
        </div>
      </div>
      <div style={{ marginTop: -10, background: C.acc, borderRadius: 20, padding: sp(3, 8),
        display: "flex", alignItems: "center", gap: SPACE[4], whiteSpace: "nowrap",
        border: `1.5px solid ${C.paper}`, zIndex: 1 }}>
        <Ic n="shield" s={10} c="#fff" />
        <span style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: "#fff", letterSpacing: ".06em" }}>VERIFIED</span>
      </div>
    </div>
  );
}

/* Selectable avatar swatches (used by profile/recovery customization) */
export const AVTS = [
  { id: 0, bg: "#E8C9A0", top: "#3D2010" },
  { id: 1, bg: "#C68642", top: "#1A0A04" },
  { id: 2, bg: "#8D5524", top: "#050201" },
  { id: 3, bg: "#FFDBAC", top: "#6B3A1F" },
  { id: 4, bg: "#F1C27D", top: "#2C1810" },
  { id: 5, bg: "#6B3D24", top: "#0A0402" },
  { id: 6, bg: "#A67C52", top: "#2C1005" },
  { id: 7, bg: "#D4956A", top: "#1A0804" },
  { id: 8, bg: "#F5CBA7", top: "#C0392B" },
  { id: 9, bg: "#D6E4F0", top: "#2C3E50" },
  { id: 10, bg: "#E8DAEF", top: "#6C3483" },
  { id: 11, bg: "#D5F5E3", top: "#1E8449" },
];

export const AvatarOpt = ({ a, size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="32" fill={a.bg} />
    <ellipse cx="32" cy="48" rx="18" ry="14" fill={a.top} opacity=".9" />
    <circle cx="32" cy="28" r="11" fill={a.bg} />
    <ellipse cx="32" cy="18" rx="14" ry="10" fill={a.top} />
  </svg>
);
