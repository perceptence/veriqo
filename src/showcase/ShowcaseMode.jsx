import { useEffect, useRef } from "react";
import "./showcase.css";

/* ============================================================================
   ShowcaseMode — self-driving product demo (full app tour).

   Mounts inside .vq-frame when opened with ?showcase. A ghost cursor performs
   REAL interactions (dispatched clicks + native input typing) on the live UI,
   so every genuine animation, transition and loading state plays exactly as it
   would for a user. Runs this exact sequence, then loops:

     splash -> onboarding (welcome, details, verify email/phone, Face ID)
     -> wallet -> tap identity (main ID view) -> Present proof
     -> One-time PIN tab -> Choose-what-to-share pane -> back to wallet
     -> Profile -> scroll to bottom -> scroll to top -> close
     -> pull down for Pulse -> Feed->Timeline->Feed
     -> scroll to Attention / Coinbase -> open -> Approve (City only)
     -> Authenticate -> close Pulse -> splash (loop)

   Performance: cursor + ripple + press use compositor-only transform/opacity
   (WAAPI / keyframes); scrolls are rAF-eased. Nothing animates layout.
   Every wait races a timeout so a backgrounded (rAF-throttled) tab degrades to
   slow-motion instead of stalling. Any real (trusted) pointer aborts the tour.

   SPEED < 1 makes the whole tour proportionally faster (0.75 = 25% faster).

   api: { setView, setIsland, setPulseOpen } — state setters used for the
   splash beat, pull-to-Pulse, and as guaranteed fallbacks so the tour can
   never wedge on a missed tap.
============================================================================ */

const EASE = "cubic-bezier(.16,1,.3,1)"; // the app's signature curve
const SPEED = 0.75; // 25% faster than baseline

export default function ShowcaseMode({ api }) {
  const layerRef = useRef(null);
  const cursorRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    if (window.__vqShowcaseActive) return; // singleton (StrictMode / HMR)
    window.__vqShowcaseActive = true;
    /* Public state so an embedder (the case study) can tell whether the tour
       is still driving or the visitor has taken over. `running` flips to false
       the moment a real pointer event hands control back. */
    window.__vqShowcase = { running: true };

    const alive = { ok: true };
    const frame = layerRef.current.closest(".vq-frame");
    const cursor = cursorRef.current;
    const ripple = rippleRef.current;
    const pos = { x: 180, y: 430 };

    const assertAlive = () => { if (!alive.ok) throw new Error("showcase-stopped"); };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms * SPEED)).then(assertAlive);

    /* ---- geometry: viewport rect -> frame-local (pre-scale) coords ---- */
    const frameRel = (el) => {
      const fr = frame.getBoundingClientRect();
      const s = fr.width / frame.offsetWidth; // total ancestor scale
      const r = el.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - fr.left) / s, y: (r.top + r.height / 2 - fr.top) / s };
    };

    /* ---- cursor primitives ---- */
    const move = (x, y, durOverride) => {
      const dist = Math.hypot(x - pos.x, y - pos.y);
      const dur = (durOverride ?? Math.min(820, Math.max(280, dist * 1.1))) * SPEED;
      const anim = cursor.animate(
        [
          { transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` },
          { transform: `translate3d(${x}px, ${y}px, 0)` },
        ],
        { duration: dur, easing: EASE, fill: "forwards" }
      );
      pos.x = x; pos.y = y;
      // Race a timeout: hidden windows throttle WAAPI/rAF and .finished stalls.
      return Promise.race([
        anim.finished.catch(() => {}),
        new Promise((r) => setTimeout(r, dur + 300)),
      ]).then(assertAlive);
    };
    const pressVisual = async () => {
      cursor.classList.add("press");
      ripple.classList.remove("go"); void ripple.offsetWidth; ripple.classList.add("go");
      await sleep(100);
    };
    const releaseVisual = async () => { await sleep(120); cursor.classList.remove("press"); };
    const clickAt = (el) => {
      const r = el.getBoundingClientRect();
      el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true,
        clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }));
    };
    const tap = async (el) => {
      if (!el) return false;
      const p = frameRel(el);
      await move(p.x, p.y);
      await pressVisual();
      clickAt(el);
      await releaseVisual();
      return true;
    };

    /* ---- native input typing (drives React onChange) ---- */
    const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    const typeInto = async (input, text) => {
      if (!input) return;
      const p = frameRel(input);
      await move(p.x, p.y); await pressVisual(); await releaseVisual();
      input.focus();
      for (let i = 1; i <= text.length; i++) {
        if (!alive.ok) return;
        nativeSet.call(input, text.slice(0, i));
        input.dispatchEvent(new Event("input", { bubbles: true }));
        await sleep(105);
      }
    };

    /* ---- lookups (visible-only, inside the frame) ---- */
    // On-screen AND not inside a visibility:hidden subtree. The Pulse panel is
    // always rendered but visibility:hidden + translated offscreen when closed;
    // visibility inherits, so checking the element's own computed value rejects
    // it (otherwise findInput/findBtn would match the hidden panel's controls).
    const visible = (el) => {
      if (!el || el.offsetParent === null) return false;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return false;
      return getComputedStyle(el).visibility !== "hidden";
    };
    const btns = () => [...frame.querySelectorAll("button")].filter(visible);
    const findBtn = (txt, exact = false) =>
      btns().find((b) => { const t = b.textContent.trim(); return exact ? t === txt : t.startsWith(txt); });
    const findText = (txt) => {
      const hits = [...frame.querySelectorAll("div,span,p,h1")].filter((d) => visible(d) && d.textContent.includes(txt));
      return hits.sort((a, b) => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return ra.width * ra.height - rb.width * rb.height;
      })[0];
    };
    const findInput = () => [...frame.querySelectorAll("input")].filter(visible)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    const findBack = () => {
      const fr = frame.getBoundingClientRect();
      return btns().filter((b) => b.textContent.trim() === "" && b.querySelector("svg") &&
        b.getBoundingClientRect().top < fr.top + fr.height * 0.16)
        .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)[0];
    };
    const findAvatar = () => {
      const fr = frame.getBoundingClientRect();
      return btns().filter((b) => b.textContent.trim() === "" && b.querySelector("svg,canvas,img") &&
        b.getBoundingClientRect().width < 70 && b.getBoundingClientRect().top < fr.top + fr.height * 0.22)
        .sort((a, b) => b.getBoundingClientRect().left - a.getBoundingClientRect().left)[0]; // right-most
    };
    const scroller = () => [...frame.querySelectorAll("div")]
      .filter((d) => visible(d) && getComputedStyle(d).overflowY === "auto" && d.clientHeight > 260)
      .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];

    /* ---- rAF-eased scroll (throttle-safe) ---- */
    const scrollTo = (el, axis, to, dur) =>
      new Promise((res) => {
        if (!el) return res();
        const prop = axis === "x" ? "scrollLeft" : "scrollTop";
        const from = el[prop], t0 = performance.now(); let done = false;
        const finish = () => { if (!done) { done = true; el[prop] = to; res(); } };
        const step = (t) => {
          if (!alive.ok || done) return res();
          const k = Math.min(1, (t - t0) / (dur * SPEED));
          el[prop] = from + (to - from) * (1 - Math.pow(1 - k, 3));
          k < 1 ? requestAnimationFrame(step) : finish();
        };
        requestAnimationFrame(step);
        setTimeout(finish, dur * SPEED + 400);
      }).then(assertAlive);
    // reveal a horizontally-overflowed element by scrolling its scroll-parent
    const revealX = async (el) => {
      if (!el) return;
      let p = el.parentElement;
      while (p && p !== frame && !(p.scrollWidth > p.clientWidth + 4 && /auto|scroll/.test(getComputedStyle(p).overflowX))) p = p.parentElement;
      if (p && p !== frame) {
        const to = el.offsetLeft - (p.clientWidth - el.offsetWidth) / 2;
        await scrollTo(p, "x", Math.max(0, to), 620);
      }
    };

    /* =============================== TOUR =============================== */
    const settle = (ms = 650) => sleep(ms);

    const script = async () => {
      // assumes we're on the splash (set at run() start or end of prior lap)
      api.setPulseOpen?.(false);
      cursor.classList.remove("on");
      await sleep(1900); // let the splash breathe

      // 1 — ONBOARDING ------------------------------------------------------
      api.setView?.("welcome");
      await settle(700);
      cursor.classList.add("on");
      await tap(findBtn("Get started"));          // Welcome -> Details
      await settle(750);

      const agree = btns().find((b) => b.textContent.includes("I agree to Veriqo"));
      await tap(agree);                            // check the ToS box
      await settle(500);
      await tap(findBtn("Continue"));              // Details -> Verify
      await settle(750);

      await tap(btns().find((b) => b.textContent.includes("SIMULATE"))); // email link
      await sleep(1050);                           // "VERIFYING…" -> verified
      await typeInto(findInput(), "482913");       // SMS code, digit by digit
      await settle(500);
      await tap(findBtn("Continue"));              // Verify -> Face ID
      await settle(750);

      await tap(findBtn("Secure with Face ID"));   // Face ID scan animation
      await sleep(1150);
      api.setView?.("wallet");                     // land on the wallet (main ID)
      await settle(900);

      // 2 — MAIN ID VIEW -> PRESENT PROOF ----------------------------------
      await tap(findText("Verified Identity"));    // open the identity detail
      await settle(1100);
      await tap(findBtn("Present proof"));          // -> Share sheet
      await settle(900);

      // 3 — ONE-TIME PIN TAB ------------------------------------------------
      await tap(findBtn("One-time PIN", true));
      await settle(1400);                          // PIN + countdown ring

      // 4 — CHOOSE WHAT TO SHARE PANE --------------------------------------
      await tap(findBtn("Choose what to share"));
      await settle(1500);                          // selective-disclosure pane
      await tap(findBtn("Done", true));
      await settle(650);

      // 5 — BACK TO WALLET (Share -> Detail -> Wallet) ---------------------
      await tap(findBack()); await settle(600);    // Share -> Detail
      await tap(findBack()); await settle(500);    // Detail -> Wallet
      api.setView?.("wallet");
      await settle(700);

      // 6 — PROFILE, scroll to bottom, back to top, close ------------------
      await tap(findAvatar());                     // -> Account
      await settle(900);
      const acc = scroller();
      if (acc) {
        await scrollTo(acc, "y", acc.scrollHeight, 1300);
        await settle(800);
        await scrollTo(acc, "y", 0, 1100);
        await settle(600);
      }
      await tap(findBack() || findAvatar());       // close (top icon) -> Wallet
      api.setView?.("wallet");
      await settle(800);

      // 7 — PULL DOWN FOR PULSE --------------------------------------------
      const handle = findText("PULL FOR UPDATES");
      if (handle) {
        const hp = frameRel(handle);
        await move(hp.x, hp.y - 6);
        await pressVisual();
        await move(hp.x, hp.y + 58, 420);          // mimic the pull
        await releaseVisual();
      }
      api.setPulseOpen?.(true);                    // guarantee it opens
      await settle(1100);

      // 8 — FEED -> TIMELINE -> FEED ---------------------------------------
      await tap(findBtn("Timeline", true));
      await settle(1500);
      await tap(findBtn("Feed", true));
      await settle(900);

      // 9 — SCROLL TO ATTENTION / COINBASE, open it ------------------------
      const feed = scroller();
      if (feed) { await scrollTo(feed, "y", 210, 900); await settle(600); }
      const coinTitle = findText("Coinbase wants more");
      await revealX(coinTitle);
      await settle(500);
      await tap(findText("Coinbase wants more")); // open the consent tray
      await settle(1300);

      // 10 — APPROVE (City only is the default) -> AUTHENTICATE ------------
      await tap(findBtn("Approve", true));         // City only preselected
      await settle(1000);
      await tap(findBtn("Authenticate", true));    // Face ID confirm
      await settle(1600);                          // "Sharing updated" beat

      // 11 — CLOSE PULSE ----------------------------------------------------
      api.setPulseOpen?.(false);
      cursor.classList.remove("on");
      await settle(900);

      // 12 — END ON SPLASH (loops back to the top) -------------------------
      api.setView?.("splash");
      await sleep(2100);
    };

    const run = async () => {
      api.setView?.("splash");
      await sleep(300);
      while (alive.ok) {
        try { await script(); }
        catch (e) { if (!alive.ok) return; throw e; }
        await sleep(250);
      }
    };

    /* ---- hand control back on any real user input ---- */
    const stop = () => {
      alive.ok = false;
      if (window.__vqShowcase) window.__vqShowcase.running = false;
      cursor.classList.remove("on");
      window.removeEventListener("pointerdown", onRealInput, true);
    };
    const onRealInput = (e) => { if (e.isTrusted && alive.ok) stop(); };
    window.addEventListener("pointerdown", onRealInput, true);

    run().catch(() => {});

    return () => { stop(); delete window.__vqShowcaseActive; delete window.__vqShowcase; };
  }, []); // api setters are stable

  return (
    <div ref={layerRef} className="sc-layer" aria-hidden="true">
      <div ref={cursorRef} className="sc-cursor">
        <div ref={rippleRef} className="sc-ripple" />
        <div className="sc-dot" />
      </div>
    </div>
  );
}
