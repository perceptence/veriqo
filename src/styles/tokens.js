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
  /* Tertiary text. Darkened from #A49E94 after the 2026-08 contrast audit:
     the old value was 2.16:1 on bone, failing even the 3:1 large-text floor.
     4.5:1 would require ~#69655F, which is indistinguishable from `sub` and
     collapses the three-tier hierarchy — so this sits at 3.82:1 on bone /
     4.71:1 on paper and is reserved for supporting metadata (timestamps,
     hints, unit labels), never for content a user must read to act. */
  faint: "#78736A",
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

/* ---- Spacing scale (px) ----
   Single source of truth for gap / margin / padding. Keys ARE the pixel value.
   The 4px ramp (4,8,12,16,20,24,28,32,40) carries layout rhythm; the half-step
   (6) and micro tier (1,2,3) exist for tight badge/label/hairline spacing.
   Reference these — never inline a raw spacing number. For multi-axis
   padding/margin use the sp() shorthand below. */
export const SPACE = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 6: 6, 8: 8,
  12: 12, 16: 16, 20: 20, 24: 24, 28: 28, 32: 32, 40: 40,
};

/* Multi-axis shorthand: sp(20, 20, 24) -> "20px 20px 24px".
   Each argument must be a SPACE key. */
export const sp = (...v) => v.map((n) => `${SPACE[n]}px`).join(" ");

/* ---- Layout constants (px) ----
   One-off STRUCTURAL clearances that are deliberately NOT on the rhythm scale
   (safe-area, empty-state centering, scroll-list bottom gutter). Kept separate
   from SPACE so the rhythm scale stays clean.
   NOTE: scrollGutter MUST remain 92 — index.css keys the no-scroll fix off the
   literal `[style*="padding-bottom: 92px"]`; change both together or not at all. */
export const LAYOUT = {
  safeTop: 36,      // extra top padding on some full-screen flows (verify)
  emptyBlock: 48,   // vertical padding around centered empty/placeholder states
  scrollGutter: 92, // bottom padding on scroll lists so the last item clears chrome
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
