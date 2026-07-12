/* ============================================================
   VERIQO DESIGN TOKENS
   Single source of truth for color, type, spacing, radii, motion.
   Every component reads from here — never hardcode a raw value.
   ============================================================ */

/* ---- Color ---- */
export const C = {
  bone: "#ECE7DE",
  paper: "#FFFFFF",
  ink: "#141210",
  ink2: "#29251F",
  sub: "#6B665E",
  faint: "#A49E94",
  line: "rgba(20,18,16,.1)",
  acc: "#15A06A",
  accDeep: "#0C6E48",
  accSoft: "#E1F2EA",
  glow: "#22E08C",
};

/* Semantic status colors — used by Notice, expiry badges, alerts */
export const STATUS = {
  success: { color: C.acc, bg: C.accSoft, text: C.accDeep },
  warning: { color: "#C07B00", bg: "#FEF4E6", text: "#C07B00" },
  error: { color: "#D93025", bg: "#FEE8E6", text: "#D93025" },
  info: { color: C.faint, bg: C.bone, text: C.sub },
  danger: { color: "#D9583F", bg: "#FBE3DF", text: "#D9583F" },
};

/* ---- Typography ---- */
export const FONT = {
  display: "'Archivo',sans-serif",
  mono: "'Space Mono',monospace",
  numeric: "'Anton',sans-serif",
};
/* Back-compat aliases (mirror the original single-file constants) */
export const DISP = FONT.display;
export const MONO = FONT.mono;
export const NUM = FONT.numeric;

/* ---- Icon strokes ----
   One optical rule for all icons: stroke width is derived from render size
   (strokeWidth is in viewBox units, so small icons need thicker strokes to
   hold the same perceived weight). Components should NOT pass per-site
   stroke widths — let Ic derive it via strokeFor(size). */
export const STROKE = { bold: 2.2, base: 1.8, light: 1.4 };
export const strokeFor = (s) => (s <= 14 ? STROKE.bold : s <= 24 ? STROKE.base : STROKE.light);

/* ---- Radii ---- */
export const RADIUS = {
  xs: 6,
  sm: 9,
  md: 13,
  lg: 16,
  xl: 18,
  "2xl": 22,
  pill: 20,
  round: "50%",
};

/* ---- Spacing scale (px) ---- */
export const SPACE = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 10: 40,
};

/* ---- Motion ---- */
export const EASE = "cubic-bezier(.16,1,.3,1)";
export const MOTION = {
  fast: `.12s`,
  base: `.25s`,
  slow: `.45s`,
  ease: EASE,
};

/* ---- Elevation ---- */
export const SHADOW = {
  card: "0 24px 26px -24px rgba(20,18,16,.5)",
  raised: "0 10px 20px rgba(20,18,16,.22)",
  soft: "0 2px 8px rgba(20,18,16,.03)",
  float: "0 8px 24px rgba(20,18,16,.18)",
};

/* ---- Responsive breakpoints (px) ---- */
export const BP = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};
