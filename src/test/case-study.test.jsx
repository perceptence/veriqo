import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { STATS, NEXT, REVENUE, OWNERSHIP, PROJECT_STATUS, JOURNEYS, ROADMAP_RULE } from "../case-study/data.js";
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

  it("gives every roadmap item a tag, icon, title and body", () => {
    expect(NEXT.length).toBeGreaterThan(0);
    for (const n of NEXT) {
      expect(n.title, "roadmap title").toBeTruthy();
      expect(n.body, `${n.title} body`).toBeTruthy();
      expect(n.tag, `${n.title} tag`).toBeTruthy();
      expect(n.ic, `${n.title} icon`).toBeTruthy();
      expect(String(n.body)).not.toMatch(/undefined|NaN/);
    }
  });

  /* The roadmap's value is the ordering rule, not the list. These keep the
     two from drifting apart — a bucket with no stated criterion, or a list
     sorted differently from the rule it claims to follow, is the exact
     failure the section exists to avoid. */
  it("sorts the roadmap by the rule it publishes", () => {
    const buckets = Object.keys(ROADMAP_RULE.buckets);
    expect(buckets).toEqual(["NOW", "NEXT", "LATER"]);
    for (const b of buckets) expect(ROADMAP_RULE.buckets[b], `${b} criterion`).toBeTruthy();
    expect(ROADMAP_RULE.tests.length).toBe(2);
    for (const t of ROADMAP_RULE.tests) {
      expect(t.q, "test question").toBeTruthy();
      expect(t.why, `${t.q} rationale`).toBeTruthy();
    }
    // every item declares a bucket, gives its reason, and the list is ordered by it
    const order = NEXT.map((n) => buckets.indexOf(n.when));
    expect(order).not.toContain(-1);
    expect(order, "roadmap is not sorted NOW -> NEXT -> LATER").toEqual([...order].sort((a, b) => a - b));
    for (const n of NEXT) expect(n.because, `${n.title} is missing why it sits in ${n.when}`).toBeTruthy();
  });

  it("states ownership and status without borrowing a team's credit", () => {
    expect(OWNERSHIP.line).toMatch(/solo/i);
    expect(OWNERSHIP.note).toBeTruthy();
    // "the bar I'd hold a team to" would be a lie on a solo project
    expect(OWNERSHIP.line).not.toMatch(/\b(we|our|my team|the team)\b/i);
    expect(PROJECT_STATUS.line).toMatch(/no live users/i);
  });

  it("lists the journeys the demo actually walks", () => {
    expect(JOURNEYS.length).toBeGreaterThan(0);
    for (const j of JOURNEYS) {
      expect(j.name, "journey name").toBeTruthy();
      expect(j.detail, `${j.name} detail`).toBeTruthy();
    }
    // the hero quotes this count, so it must come from the list itself
    expect(STATS.hero.find((s) => /journey/i.test(s.label)).value).toBe(String(JOURNEYS.length));
  });

  it("keeps repository metrics out of the metric rows", () => {
    const labels = [...STATS.hero, ...STATS.scope].map((s) => s.label.toLowerCase());
    for (const banned of ["source files", "lines of test", "spacing tokens", "tokenised spacings", "commits"]) {
      expect(labels, `${banned} is a repository metric, not a product one`).not.toContain(banned);
    }
  });

  it("describes a complete revenue model", () => {
    expect(REVENUE.thesis).toBeTruthy();
    expect(REVENUE.tiers.length).toBeGreaterThan(1);
    for (const t of REVENUE.tiers) {
      expect(t.name, "tier name").toBeTruthy();
      expect(t.price, `${t.name} price`).toBeTruthy();
      expect(t.who, `${t.name} audience`).toBeTruthy();
      expect(t.note, `${t.name} rationale`).toBeTruthy();
      expect(t.lines.length, `${t.name} lines`).toBeGreaterThan(0);
      expect(["quiet", "accent", "ink"]).toContain(t.tone);
    }
    // the strategic claim the section rests on: holders aren't the payer
    expect(REVENUE.tiers.some((t) => /free/i.test(t.price))).toBe(true);
    for (const a of REVENUE.adjacent) {
      expect(a.title).toBeTruthy();
      expect(a.body).toBeTruthy();
    }
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

  /* The nav promises five destinations. A link pointing at a section that
     doesn't exist is a dead end a reader finds before any test would. */
  it("gives every nav link a section that exists on the page", () => {
    const { container } = render(<CaseStudy />);
    const links = [...container.querySelectorAll('nav a[href^="#"]')];
    expect(links.length).toBe(5);
    for (const a of links) {
      const id = a.getAttribute("href").slice(1);
      expect(container.querySelector(`#${id}`), `nav links to #${id}, which is not on the page`).toBeTruthy();
    }
  });

  it("wires the nav's active state to real sections", () => {
    window.IntersectionObserver.observed = [];
    render(<CaseStudy />);
    const ids = window.IntersectionObserver.observed.map((el) => el.id);
    expect(ids).toEqual(expect.arrayContaining(["problem", "product", "decisions", "system", "next"]));
  });

  it("puts ownership and status in the hero, above the metrics", () => {
    const { container } = render(<CaseStudy />);
    const text = container.textContent;
    expect(text).toContain(OWNERSHIP.line);
    expect(text).toContain(PROJECT_STATUS.line);
    // both must precede the first stat card's caption, or they aren't leading
    const firstStatHow = STATS.hero[0].how;
    expect(text.indexOf(OWNERSHIP.line)).toBeLessThan(text.indexOf(firstStatHow));
    expect(text.indexOf(PROJECT_STATUS.line)).toBeLessThan(text.indexOf(firstStatHow));
  });

  it("names what the three decisions collectively argue", () => {
    const { container } = render(<CaseStudy />);
    expect(container.textContent).toMatch(/who\s+does the interface work for/i);
  });

  it("hands over the live product from the sticky header", () => {
    const { container } = render(<CaseStudy />);
    const cta = container.querySelector('div[style*="sticky"] a[href="/"]');
    expect(cta, "the sticky header has no link to the product").toBeTruthy();
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(cta.getAttribute("rel")).toContain("noopener");
  });
});
