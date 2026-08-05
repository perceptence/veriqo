import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { STATS } from "../case-study/data.js";
import G from "../case-study/stats.generated.json";
import CaseStudy from "../case-study/CaseStudy.jsx";

/* The case study publishes numbers. These guard the data contract behind it —
   in particular that no figure reaches the page as `undefined`, which is how a
   sentence like "undefined spacing values across the app" once shipped. */

describe("generated stats", () => {
  it("provides every figure the page reads", () => {
    for (const key of ["tests", "testFiles", "testLines", "assertions", "screens",
      "components", "sourceFiles", "sourceLines", "spacingTokens", "tokenisedSpacings", "version"]) {
      expect(G[key], `stats.generated.json is missing ${key}`).toBeDefined();
    }
  });

  it("reports a passing suite with a plausible count", () => {
    expect(G.tests).toBeGreaterThan(0);
    expect(G.testFiles).toBeGreaterThan(0);
  });

  it("carries contrast results for every audited pair", () => {
    expect(G.a11y.pairs.length).toBe(G.a11y.pairsChecked);
    for (const p of G.a11y.pairs) {
      expect(p.ratio, `${p.label} ratio`).toBeGreaterThan(1);
      expect(p.fgHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(p.bgHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(p.aa).toBe(p.ratio >= 4.5);
    }
  });
});

describe("STATS exposed to the page", () => {
  it("never surfaces an undefined value in a stat card", () => {
    for (const group of ["hero", "tests", "scope"]) {
      for (const s of STATS[group]) {
        expect(s.value, `${group}: ${s.label} value`).toBeDefined();
        expect(String(s.value)).not.toMatch(/undefined|NaN/);
        expect(s.label).toBeTruthy();
        expect(s.how).toBeTruthy();
      }
    }
  });

  it("exposes the figures quoted inline in prose", () => {
    expect(String(STATS.spacingTokens)).not.toMatch(/undefined/);
    expect(String(STATS.tokenisedSpacings)).not.toMatch(/undefined/);
  });

  it("gives every scope line a tag and a description", () => {
    for (const h of STATS.honest) {
      expect(h.title).toBeTruthy();
      expect(h.sub).toBeTruthy();
      expect(String(h.sub)).not.toMatch(/undefined|NaN/);
      expect(["yes", "no"]).toContain(h.tone);
    }
  });
});

describe("the rendered page", () => {
  it("mounts without throwing", () => {
    render(<CaseStudy />);
    expect(screen.getByText(/Prove who you are/)).toBeInTheDocument();
  });

  it("never renders the literal text 'undefined' or 'NaN'", () => {
    const { container } = render(<CaseStudy />);
    expect(container.textContent).not.toMatch(/\bundefined\b/);
    expect(container.textContent).not.toMatch(/\bNaN\b/);
  });

  it("links to the product and opens it in a new tab safely", () => {
    const { container } = render(<CaseStudy />);
    const external = [...container.querySelectorAll('a[href="/"]')];
    expect(external.length).toBeGreaterThan(0);
    for (const a of external) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
    }
  });

  it("embeds the live product from the same origin", () => {
    const { container } = render(<CaseStudy />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute("src")).toMatch(/^\/\?showcase/);
  });

  it("shows no code listings — decisions are explained, not pasted", () => {
    const { container } = render(<CaseStudy />);
    expect(container.querySelectorAll("pre").length).toBe(0);
  });
});
