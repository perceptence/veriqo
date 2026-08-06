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
  /* Text tiers are set so all three clear WCAG AA (4.5:1) on both surfaces
     while staying visibly distinct from one another. Darkening `faint` alone
     would have collided with `sub`, so the whole ramp moved down together:
       ink   15.17:1 on bone / 18.69:1 on paper
       sub    6.90:1        /  8.50:1
       faint  4.91:1        /  6.04:1
     (was sub #6B665E 4.62:1, faint #A49E94 2.16:1 — the latter failed even
      the 3:1 large-text floor.) */
  sub: "#514C45",
  faint: "#67625B",
  line: "rgba(20,18,16,.1)",
  acc: "#15A06A",
  accDeep: "#0C6E48",
  accSoft: "#E1F2EA",
  glow: "#22E08C",
};

/* Semantic status colors — used by Notice, expiry badges, alerts */
/* `color` is the fill — icons, dots, rules — and only has to clear 3:1 as a
   non-text graphic. `text` is the same hue darkened until it clears 4.5:1 on
   this status's own `bg`, which is the only place it's used. success/info
   already followed that rule; warning, error and danger were reusing `color`
   as text and measured 3.18, 4.07 and 3.17:1. Every pair is now checked at
   build time (see scripts/gen-stats.mjs) so they can't drift back. */
export const STATUS = {
  success: { color: C.acc, bg: C.accSoft, text: C.accDeep },
  warning: { color: "#C07B00", bg: "#FEF4E6", text: "#8A5A00" },
  error: { color: "#D93025", bg: "#FEE8E6", text: "#C92A20" },
  info: { color: C.faint, bg: C.bone, text: C.sub },
  danger: { color: "#D9583F", bg: "#FBE3DF", text: "#A8341C" },
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
