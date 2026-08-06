import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/* jsdom lacks a few browser APIs the app touches. Stub the minimum so screens
   can mount without each test having to know about them. */

// PhoneFrame / ShowcaseMode measure and animate; jsdom has neither.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false, media: query, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  });
}
if (!Element.prototype.animate) {
  Element.prototype.animate = () => ({ finished: Promise.resolve(), cancel() {}, play() {}, pause() {} });
}
if (!Element.prototype.scrollTo) Element.prototype.scrollTo = () => {};
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 0);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
}
// The case study's sticky nav observes each section to highlight the current
// stop. Records what was observed so a test can assert the nav is wired to
// real elements rather than silently observing nothing.
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    static observed = [];
    constructor(cb) { this.cb = cb; }
    observe(el) { window.IntersectionObserver.observed.push(el); }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}
// Pulse's "Ask Pulse" calls the network; never hit it from tests.
if (!globalThis.fetch) globalThis.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

afterEach(() => cleanup());
