import { describe, it, expect } from "vitest";
import { C, STATUS, FONT, RADIUS, SPACE, sp, LAYOUT, STROKE, strokeFor, MOTION, SHADOW, BP } from "../styles/tokens.js";

/* The design system is the contract the whole UI depends on. These lock the
   shape and the invariants so a careless edit to tokens.js fails loudly. */

describe("color tokens", () => {
  it("exposes the core palette as hex or rgba", () => {
    for (const key of ["bone", "paper", "ink", "sub", "faint", "acc", "accDeep", "glow"]) {
      expect(C[key], `C.${key}`).toMatch(/^(#[0-9A-Fa-f]{6}|rgba?\()/);
    }
  });

  it("gives every status a color, background and text color", () => {
    for (const [name, s] of Object.entries(STATUS)) {
      expect(s.color, `${name}.color`).toBeTruthy();
      expect(s.bg, `${name}.bg`).toBeTruthy();
      expect(s.text, `${name}.text`).toBeTruthy();
    }
  });
});

describe("spacing scale", () => {
  it("is pixel-keyed: every key equals its own value", () => {
    for (const [key, value] of Object.entries(SPACE)) {
      expect(value, `SPACE[${key}]`).toBe(Number(key));
    }
  });

  it("keeps the 4px rhythm plus the documented half-step and micro tier", () => {
    const keys = Object.keys(SPACE).map(Number).sort((a, b) => a - b);
    expect(keys).toEqual([0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 28, 32, 40]);
    // everything at or above the half-step is on the 4px grid, except 6 itself
    for (const k of keys.filter((k) => k >= 4 && k !== 6)) expect(k % 4).toBe(0);
  });

  it("sp() renders multi-axis padding strings from scale keys", () => {
    expect(sp(20, 20, 24)).toBe("20px 20px 24px");
    expect(sp(12, 16)).toBe("12px 16px");
    expect(sp(0)).toBe("0px");
  });
});

describe("layout constants", () => {
  it("keeps structural clearances off the rhythm scale on purpose", () => {
    for (const key of ["safeTop", "emptyBlock", "scrollGutter"]) {
      expect(typeof LAYOUT[key], `LAYOUT.${key}`).toBe("number");
    }
  });

  it("pins scrollGutter to 92 — index.css keys its no-scroll fix off that literal", () => {
    expect(LAYOUT.scrollGutter).toBe(92);
  });
});

describe("icon stroke rule", () => {
  it("derives weight from size: smaller icons get heavier strokes", () => {
    expect(strokeFor(12)).toBe(STROKE.bold);
    expect(strokeFor(14)).toBe(STROKE.bold);
    expect(strokeFor(18)).toBe(STROKE.base);
    expect(strokeFor(24)).toBe(STROKE.base);
    expect(strokeFor(30)).toBe(STROKE.light);
  });

  it("is monotonic — stroke never gets heavier as the icon grows", () => {
    const sizes = [10, 12, 14, 16, 20, 24, 26, 32, 48];
    const weights = sizes.map(strokeFor);
    for (let i = 1; i < weights.length; i++) expect(weights[i]).toBeLessThanOrEqual(weights[i - 1]);
  });

  it("keeps the common case lighter than the un-tuned 2.0 default", () => {
    // 15–24px is the dominant icon size in the UI; it must read lighter than
    // Lucide's stock 2.0, which is what made the old icons feel heavy.
    for (const s of [16, 18, 20, 22, 24]) expect(strokeFor(s)).toBeLessThan(2.0);
    for (const s of [26, 32, 48]) expect(strokeFor(s)).toBeLessThan(2.0);
  });

  it("deliberately over-weights tiny icons for optical compensation", () => {
    // stroke-width is in viewBox units, so the same weight looks thinner the
    // smaller an icon renders — the <=14px tier compensates by going heavier.
    expect(strokeFor(12)).toBeGreaterThan(strokeFor(18));
    expect(strokeFor(12)).toBeGreaterThan(2.0);
  });
});

describe("type, radii, motion, elevation, breakpoints", () => {
  it("names the three font roles", () => {
    expect(FONT.display).toMatch(/Archivo/);
    expect(FONT.mono).toMatch(/Space Mono/);
    expect(FONT.numeric).toMatch(/Anton/);
  });

  it("orders the radius scale from xs upward", () => {
    const ramp = [RADIUS.xs, RADIUS.sm, RADIUS.md, RADIUS.lg, RADIUS.xl, RADIUS["2xl"]];
    for (let i = 1; i < ramp.length; i++) expect(ramp[i]).toBeGreaterThan(ramp[i - 1]);
    expect(RADIUS.round).toBe("50%");
  });

  it("exposes durations and a shared easing curve", () => {
    for (const k of ["fast", "base", "slow"]) expect(MOTION[k]).toMatch(/^\.?\d/);
    expect(MOTION.ease).toMatch(/^cubic-bezier\(/);
  });

  it("exposes elevation presets as CSS shadows", () => {
    for (const k of ["card", "raised", "soft", "float"]) expect(SHADOW[k]).toMatch(/px/);
  });

  it("orders breakpoints ascending", () => {
    const bps = [BP.sm, BP.md, BP.lg, BP.xl];
    for (let i = 1; i < bps.length; i++) expect(bps[i]).toBeGreaterThan(bps[i - 1]);
  });
});
