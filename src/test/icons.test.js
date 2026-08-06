import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { C } from "../styles/tokens.js";

/* The favicon is the one asset nothing in the app imports, so a rename or a
   deleted file breaks it silently — the page still builds, the tab just goes
   blank. These read the real files off disk and the real <link> tags. */

const root = path.resolve(import.meta.dirname, "../..");
const pub = (f) => path.join(root, "public", f);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

describe("favicon assets", () => {
  it("ships every file index.html points at", () => {
    const hrefs = [...html.matchAll(/<link[^>]*rel="(?:apple-touch-)?icon"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual(expect.arrayContaining(["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png"]));
    for (const h of hrefs) {
      expect(fs.existsSync(pub(h.slice(1))), `${h} is referenced but missing from public/`).toBe(true);
    }
  });

  it("declares the SVG icon with a type so browsers can prefer it", () => {
    expect(html).toMatch(/href="\/favicon\.svg"[^>]*type="image\/svg\+xml"|type="image\/svg\+xml"[^>]*href="\/favicon\.svg"/);
  });

  it("draws the mark from brand tokens, not invented colour", () => {
    const svg = fs.readFileSync(pub("favicon.svg"), "utf8");
    expect(svg).toContain(C.ink);   // container on light chrome
    expect(svg).toContain(C.ink2);  // and the lighter step for dark chrome
    expect(svg).toContain(C.acc);   // the mid plane is the brand accent
    expect(svg).toMatch(/prefers-color-scheme: dark/);
  });

  it("keeps the small icon simplified — three planes, not six facets", () => {
    const svg = fs.readFileSync(pub("favicon.svg"), "utf8");
    // one flat hexagon underneath to kill antialiasing seams, plus three planes
    expect(svg.match(/<polygon/g)).toHaveLength(4);
  });

  it("has a real multi-size .ico", () => {
    const ico = fs.readFileSync(pub("favicon.ico"));
    expect(ico.readUInt16LE(0)).toBe(0); // reserved
    expect(ico.readUInt16LE(2)).toBe(1); // type 1 = icon
    const count = ico.readUInt16LE(4);
    expect(count).toBe(3);
    const sizes = [];
    for (let i = 0; i < count; i++) {
      const e = 6 + 16 * i;
      sizes.push(ico.readUInt8(e));
      // every entry must point at bytes that are actually inside the file
      const len = ico.readUInt32LE(e + 8);
      const off = ico.readUInt32LE(e + 12);
      expect(off + len, `entry ${i} runs past the end of the file`).toBeLessThanOrEqual(ico.length);
    }
    expect(sizes).toEqual([16, 32, 48]);
  });

  it("ships a 180px apple-touch-icon with no baked corner radius", () => {
    const png = fs.readFileSync(pub("apple-touch-icon.png"));
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(180);
    expect(png.readUInt32BE(20)).toBe(180);
    // iOS masks its own superellipse, so ours must be square and full-bleed
    const src = fs.readFileSync(pub("apple-touch-icon.svg"), "utf8");
    expect(src).not.toMatch(/\brx=/);
  });
});
