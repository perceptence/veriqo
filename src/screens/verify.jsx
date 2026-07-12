import { useState, useEffect } from "react";
import { C, DISP, MONO, NUM } from "../styles/tokens.js";
import { S, CREDS, credBy } from "../data/credentials.js";
import { Grain, Ic } from "../components/Icon.jsx";
import { BitAvatar } from "../components/BitAvatar.jsx";
import { Header, PBar, Btn, StepDots, Group, Row, DataRows } from "../components/primitives.jsx";
import { IDCard } from "../components/cards.jsx";

/* ---- Permission ---- */
export function Permission({ go, back }) {
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="PERMISSION" title="We'll need your camera." />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", marginTop: 18 }}>
        <div className="fu2" style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 84, height: 84, borderRadius: 22, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 14px 30px rgba(20,18,16,.25)" }}>
              <Grain o={0.07} />
              <svg width="58" height="42" viewBox="0 0 58 42" fill="none">
                <rect x="1" y="1" width="56" height="40" rx="5" stroke={C.glow} strokeWidth="2" />
                <rect x="1" y="1" width="56" height="5" rx="4" fill={C.glow} opacity=".5" />
                <rect x="6" y="11" width="14" height="18" rx="3" fill="rgba(255,255,255,.18)" />
                <circle cx="13" cy="17" r="4" fill="rgba(255,255,255,.35)" />
                <path d="M7 29 a6 5 0 0 1 12 0" fill="rgba(255,255,255,.35)" />
                <rect x="26" y="13" width="22" height="3" rx="1.5" fill={C.glow} opacity=".8" />
                <rect x="26" y="20" width="16" height="2.5" rx="1.2" fill="rgba(255,255,255,.35)" />
                <rect x="26" y="26" width="19" height="2.5" rx="1.2" fill="rgba(255,255,255,.35)" />
                <rect x="6" y="33" width="9" height="6" rx="1.5" fill="rgba(255,255,255,.2)" stroke="rgba(255,255,255,.3)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
        <p className="fu2" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: 16, lineHeight: 1.5 }}>
          Used only while we verify. Nothing is recorded or saved to your phone.
        </p>
        <div className="fu3" style={{ display: "flex", flexDirection: "column", gap: 1, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", background: C.paper }}>
          {[
            { ic: "card", t: "Scan your ID", d: "Read live as you hold it up" },
            { ic: "face", t: "Match your face", d: "A liveness check confirms it's you" },
            { ic: "trash", t: "Then it's gone", d: "Frames are never stored on device" },
          ].map((i, idx) => (
            <div key={i.t} style={{ display: "flex", gap: 13, padding: "13px 16px", alignItems: "center", borderTop: idx ? `1px solid ${C.line}` : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: C.bone, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic n={i.ic} s={18} c={C.ink} />
              </div>
              <div>
                <div style={{ fontFamily: DISP, fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: "-.01em" }}>{i.t}</div>
                <div style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 500, color: C.faint, marginTop: 1 }}>{i.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, marginTop: 14 }}>
        <Btn label="Allow camera" onClick={() => go(S.IS)} />
      </div>
    </div>
  );
}

/* ---- ID Select ---- */
export function IDSelect({ go, back, sel, setSel, owned = [], onViewExisting }) {
  const common = CREDS.filter((c) => c.tier === "common");
  const more = CREDS.filter((c) => c.tier === "more");
  const [showMore, setShowMore] = useState(false);
  const [query, setQuery] = useState("");
  const [requested, setRequested] = useState([]);
  const allOwned = common.every((c) => owned.includes(c.key));
  const q = query.trim().toLowerCase();
  const filtered = more.filter((c) => !q || c.type.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  const categories = [...new Set(filtered.map((c) => c.category))];

  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow={allOwned ? "DOCUMENTS" : "STEP 1 OF 2"} title={allOwned ? "You're all set." : "Which ID do you have?"} />
        {!allOwned && <PBar step={1} />}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 11, marginTop: 20, paddingBottom: 2 }}>
        {allOwned && (
          <p className="fu1" style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginBottom: 2 }}>
            Your common documents are already in your wallet. Open one below if it needs updating, or look under more document types.
          </p>
        )}
        {common.map((c) => {
          const a = sel === c.key;
          const isOwned = owned.includes(c.key);
          if (isOwned) {
            return (
              <button key={c.key} onClick={() => onViewExisting && onViewExisting(c.key)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", background: C.bone, border: `1.5px solid ${C.line}`, borderRadius: 16, cursor: "pointer", textAlign: "left", width: "100%", flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(20,18,16,.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ic n={c.ic} s={21} c={C.faint} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: C.sub, letterSpacing: "-.01em" }}>{c.type}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                    <Ic n="check" s={10} c={C.acc} sw={3} />
                    <span style={{ fontFamily: MONO, fontSize: 9.5, color: C.accDeep, letterSpacing: ".02em" }}>ALREADY ADDED</span>
                  </div>
                </div>
                <span style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: C.acc, flexShrink: 0 }}>View</span>
              </button>
            );
          }
          return (
            <button key={c.key} onClick={() => setSel(c.key)} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "15px 16px",
              background: a ? C.ink : C.paper, border: `1.5px solid ${a ? C.ink : C.line}`, borderRadius: 16, cursor: "pointer",
              textAlign: "left", width: "100%", transition: "all .22s cubic-bezier(.16,1,.3,1)",
              boxShadow: a ? "0 10px 20px rgba(20,18,16,.2)" : "0 2px 8px rgba(20,18,16,.03)", flexShrink: 0 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: a ? "rgba(255,255,255,.12)" : C.bone, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic n={c.ic} s={21} c={a ? C.glow : C.ink} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: a ? "#fff" : C.ink, letterSpacing: "-.01em" }}>{c.type}</div>
                <div style={{ fontFamily: MONO, fontSize: 9.5, color: a ? C.glow : C.faint, marginTop: 3, letterSpacing: ".02em" }}>
                  {(a ? c.hint : c.d).toUpperCase()}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: a ? C.acc : "transparent",
                border: `2px solid ${a ? C.acc : "rgba(20,18,16,.18)"}`, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s", animation: a ? "rise .3s cubic-bezier(.16,1,.3,1)" : "none" }}>
                {a && <Ic n="check" s={13} c="#fff" sw={2.6} />}
              </div>
            </button>
          );
        })}

        <button onClick={() => setShowMore((s) => !s)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", padding: "14px", background: "transparent", border: "none", cursor: "pointer", marginTop: 2 }}>
          <Ic n={showMore ? "x" : "plus"} s={14} c={C.sub} sw={2.2} />
          <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.sub }}>{showMore ? "Hide document types" : "More document types"}</span>
        </button>

        {showMore && (
          <div style={{ animation: "chipIn .25s ease both" }}>
            <div style={{ position: "relative", margin: "2px 0 14px" }}>
              <input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus placeholder="Search document types"
                style={{ width: "100%", padding: "12px 16px 12px 40px", background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: 13, fontFamily: DISP, fontSize: 14, fontWeight: 600, color: C.ink, outline: "none" }} />
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                <Ic n="search" s={15} c={C.faint} sw={2.2} />
              </div>
            </div>

            {categories.length === 0 && (
              <div style={{ textAlign: "center", padding: "8px 6px 6px" }}>
                <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.faint, marginBottom: 13, lineHeight: 1.5 }}>No document types match "{query}".</p>
                {requested.includes(q) ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 17px", background: C.accSoft, borderRadius: 12 }}>
                    <Ic n="check" s={13} c={C.acc} sw={2.8} />
                    <span style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: C.accDeep }}>We'll notify you when it's added</span>
                  </div>
                ) : (
                  <button onClick={() => setRequested((r) => [...r, q])} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", background: C.ink, border: "none", borderRadius: 12, cursor: "pointer" }}>
                    <Ic n="bell" s={13} c="#fff" sw={2.4} />
                    <span style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: "#fff" }}>Notify me when added</span>
                  </button>
                )}
              </div>
            )}

            {categories.map((cat) => (
              <div key={cat} style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", marginBottom: 8, paddingLeft: 2 }}>{cat.toUpperCase()}</p>
                <Group>
                  {filtered.filter((c) => c.category === cat).map((c) => {
                    const isOwned = owned.includes(c.key);
                    return isOwned ? (
                      <Row key={c.key} ic={c.ic} title={c.type} sub="Already added"
                        onClick={() => onViewExisting && onViewExisting(c.key)}
                        right={<span style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: C.acc }}>View</span>} />
                    ) : (
                      <Row key={c.key} ic={c.ic} title={c.type} sub={c.issuer} onClick={() => { setSel(c.key); go(S.IC); }} />
                    );
                  })}
                </Group>
              </div>
            ))}
          </div>
        )}
      </div>

      {!allOwned && <div style={{ flexShrink: 0, marginTop: 14 }}>
        <Btn label={sel ? "Continue" : "Choose one to continue"} onClick={() => go(S.IC)} disabled={!sel} />
      </div>}
    </div>
  );
}

/* ---- ID Capture ---- */
export function IDCapture({ go }) {
  const [ph, setPh] = useState(0);
  const [loading, setLoading] = useState(false);
  const phases = [
    { msg: "Frame your ID", sub: "MOVE A LITTLE CLOSER", lock: false },
    { msg: "Reducing glare", sub: "TILT AWAY FROM THE LIGHT", lock: false },
    { msg: "Hold steady", sub: "LOOKING GOOD", lock: true },
    { msg: "Capturing", sub: "KEEP STILL", lock: true },
  ];
  useEffect(() => {
    if (loading) { const t = setTimeout(() => go(S.IR), 2400); return () => clearTimeout(t); }
    const ts = [1900, 2000, 1900, 1300];
    const t = setTimeout(() => { ph < 3 ? setPh((p) => p + 1) : setLoading(true); }, ts[ph]);
    return () => clearTimeout(t);
  }, [ph, loading]);
  const P = phases[ph];
  const fc = loading || P.lock ? C.acc : "rgba(255,255,255,.34)";
  return (
    <div className="si" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: C.ink }}>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%,#26221A,#141210)" }} />
        <Grain o={0.06} />
        <div className="fu" style={{ position: "absolute", top: 56, left: 24, right: 24, zIndex: 10, textAlign: "center" }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.glow, fontWeight: 700, letterSpacing: ".14em", marginBottom: 6 }}>SCANNING DOCUMENT</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: loading || P.lock ? C.acc : "#fff", animation: "breathe 1.8s ease infinite" }} />
            <span style={{ fontFamily: DISP, fontSize: 20, color: "#fff", fontWeight: 800, letterSpacing: "-.02em" }}>{loading ? "Captured" : P.msg}</span>
          </div>
        </div>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "78%", height: "42%" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", transition: "transform .5s cubic-bezier(.16,1,.3,1)", transform: P.lock ? "scale(1.01)" : "scale(.98)" }}>
            {[
              { top: -2, left: -2, bt: 1, bl: 1, r: "16px 0 0 0" },
              { top: -2, right: -2, bt: 1, br: 1, r: "0 16px 0 0" },
              { bottom: -2, left: -2, bb: 1, bl: 1, r: "0 0 0 16px" },
              { bottom: -2, right: -2, bb: 1, br: 1, r: "0 0 16px 0" },
            ].map((cn, i) => (
              <div key={i} style={{ position: "absolute", width: 30, height: 30,
                borderTop: cn.bt ? `3px solid ${fc}` : "none", borderBottom: cn.bb ? `3px solid ${fc}` : "none",
                borderLeft: cn.bl ? `3px solid ${fc}` : "none", borderRight: cn.br ? `3px solid ${fc}` : "none",
                borderRadius: cn.r, top: cn.top, left: cn.left, right: cn.right, bottom: cn.bottom, transition: "border-color .5s" }} />
            ))}
            {P.lock && !loading && <div style={{ position: "absolute", left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,transparent,${C.acc},transparent)`, animation: "scanSweep 2.1s ease-in-out infinite", top: "7%" }} />}
            <div style={{ position: "absolute", inset: "12%", display: "flex", gap: 13, opacity: loading ? 0.04 : 0.55, transition: "opacity .6s" }}>
              <div style={{ width: 36, height: 44, background: "rgba(255,255,255,.9)", borderRadius: 8, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 7 }}>
                <div style={{ height: 7, background: "rgba(255,255,255,.9)", borderRadius: 3, width: "70%" }} />
                <div style={{ height: 5, background: "rgba(255,255,255,.7)", borderRadius: 3, width: "88%" }} />
                <div style={{ height: 5, background: "rgba(255,255,255,.7)", borderRadius: 3, width: "52%" }} />
              </div>
            </div>
            {loading && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, animation: "rise .4s ease both" }}>
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ animation: "spinArc .9s linear infinite" }}>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="3.5" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke={C.glow} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="40 200" />
                </svg>
                <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>PROCESSING SCAN</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px 22px", background: "linear-gradient(transparent,rgba(20,18,16,.96))" }}>
          <div style={{ marginBottom: 12 }}>
            <StepDots total={4} current={loading ? 4 : ph} light />
          </div>
          <p style={{ textAlign: "center", fontFamily: MONO, fontSize: 10.5, color: "rgba(255,255,255,.5)", letterSpacing: ".06em" }}>{loading ? "ALL FOUR CHECKS PASSED" : P.sub}</p>
        </div>
      </div>
      <div style={{ padding: "14px 20px 16px", background: C.ink }}>
        <button onClick={() => go(S.IR)} style={{ width: "100%", padding: "13px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 13, fontFamily: DISP, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,.82)", cursor: "pointer" }}>
          Capture manually
        </button>
      </div>
    </div>
  );
}

/* ---- ID Review ---- */
export function IDReview({ go, retake, vsel }) {
  const credKey = vsel || "dl";
  const c = credBy(credKey);
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={retake} eyebrow="QUICK CHECK" title="Looking sharp?" />
        <PBar step={2} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18, paddingTop: 10 }}>
        <div className="fu2" style={{ display: "flex", justifyContent: "center", position: "relative", marginBottom: 18 }}>
          <IDCard w={196} h={124} photo={40} credKey={credKey} />
          <div style={{ position: "absolute", top: -9, right: 28, background: C.acc, borderRadius: 11, padding: "5px 12px", display: "flex", alignItems: "center", gap: 5, animation: "rise .4s cubic-bezier(.16,1,.3,1) .25s both", boxShadow: `0 6px 14px ${C.acc}55` }}>
            <Ic n="check" s={11} c="#fff" sw={3} />
            <span style={{ fontFamily: DISP, fontSize: 11, color: "#fff", fontWeight: 800 }}>CLEAR</span>
          </div>
        </div>
        <div className="fu3">
          <p style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", marginBottom: 8, paddingLeft: 2 }}>CREDENTIALS</p>
          <DataRows rows={c.fields} />
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
        <Btn label="Retake" ghost onClick={retake} />
        <Btn label="Looks good" onClick={() => go(S.SI)} />
      </div>
    </div>
  );
}

/* ---- Selfie Intro ---- */
export function SelfieIntro({ go, back }) {
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="STEP 2 OF 2" title="Now a quick selfie." />
        <PBar step={3} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", marginTop: 14 }}>
        <div className="fu2" style={{ display: "flex", justifyContent: "center", margin: "2px 0 14px", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 118, height: 118, borderRadius: "50%", background: `radial-gradient(circle,${C.acc}30,transparent 70%)`, animation: "glowPulse 3.4s ease-in-out infinite" }} />
          <div style={{ position: "relative", borderRadius: "50%", overflow: "hidden", width: 90, height: 90 }}>
            <BitAvatar size={90} />
          </div>
        </div>
        <p className="fu3" style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, marginBottom: 14, lineHeight: 1.45 }}>
          We'll ask you to blink and turn slightly — that proves you're really here.
        </p>
        <div className="fu3" style={{ display: "flex", flexDirection: "column", gap: 1, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", background: C.paper }}>
          {[
            { ic: "bulb", t: "Find good light", d: "Face a window if you can" },
            { ic: "glasses", t: "Hats & shades off", d: "Keep your face clearly visible" },
            { ic: "phone", t: "Arm's length", d: "Camera at eye level" },
          ].map((t, i) => (
            <div key={t.t} style={{ display: "flex", gap: 12, padding: "11px 16px", alignItems: "center", borderTop: i ? `1px solid ${C.line}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.bone, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic n={t.ic} s={17} c={C.ink} />
              </div>
              <div>
                <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: C.ink, letterSpacing: "-.01em" }}>{t.t}</div>
                <div style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.faint, marginTop: 1 }}>{t.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, marginTop: 14 }}>
        <Btn label="I'm ready" onClick={() => go(S.SC)} />
      </div>
    </div>
  );
}

/* ---- Selfie Capture ---- */
export function SelfieCapture({ go }) {
  const [step, setStep] = useState(0);
  const [aligned, setAligned] = useState(false);
  const steps = [
    { msg: "Look straight ahead", sub: "CENTER YOUR FACE", ic: "eye" },
    { msg: "Now blink slowly", sub: "LIVENESS CONFIRMED", ic: "check" },
    { msg: "Turn slightly right", sub: "JUST A TOUCH", ic: "rotate" },
    { msg: "Hold still", sub: "ALMOST THERE", ic: "scan" },
  ];
  useEffect(() => {
    const ts = [2200, 1800, 1800, 1800];
    if (step === 0) {
      const t1 = setTimeout(() => setAligned(true), 1000);
      const t2 = setTimeout(() => setStep(1), ts[0]);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    if (step < steps.length - 1) { const t = setTimeout(() => setStep((s) => s + 1), ts[step]); return () => clearTimeout(t); }
    const t = setTimeout(() => go(S.PR), ts[step]); return () => clearTimeout(t);
  }, [step]);
  const St = steps[step];
  const done = step >= 1;
  const oc = done ? C.acc : "#fff";
  const oa = done ? "ovalDone 2s ease infinite" : aligned ? "ovalActive 2s ease infinite" : "none";
  return (
    <div className="si" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: C.ink }}>
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center,#26221A,#141210)" }} />
        <Grain o={0.06} />
        <div className="fu" style={{ position: "absolute", top: 56, left: 24, right: 24, zIndex: 5, textAlign: "center" }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: done ? C.glow : "rgba(255,255,255,.6)", fontWeight: 700, letterSpacing: ".14em", marginBottom: 6 }}>LIVENESS CHECK</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
            <Ic n={St.ic} s={18} c={done ? C.acc : "#fff"} />
            <span style={{ fontFamily: DISP, fontSize: 20, color: "#fff", fontWeight: 800, letterSpacing: "-.02em" }}>{St.msg}</span>
          </div>
        </div>
        <div style={{ width: 170, height: 212, border: `2.5px solid ${oc}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", animation: oa, transition: "border-color .5s", position: "relative", zIndex: 2, overflow: "visible", opacity: aligned || done ? 1 : 0.5 }}>
          <div style={{ width: 150, height: 150, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center", transition: "transform .5s cubic-bezier(.16,1,.3,1)", transform: step === 2 ? "rotate(7deg) translateX(5px)" : "none" }}>
            <BitAvatar size={150} />
          </div>
          {[{ top: -26, left: "50%", mx: 1 }, { bottom: -26, left: "50%", mx: 1 }, { left: -26, top: "50%", my: 1 }, { right: -26, top: "50%", my: 1 }].map((l, i) => (
            <div key={i} style={{ position: "absolute", top: l.top, bottom: l.bottom, left: l.left, right: l.right, transform: l.mx ? "translateX(-50%)" : "translateY(-50%)", width: l.mx ? 2 : 14, height: l.my ? 2 : 14, background: `${oc}99`, borderRadius: 2, transition: "background .5s" }} />
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 36, left: 24, right: 24 }}>
          <StepDots total={4} current={step} light />
        </div>
        <div style={{ position: "absolute", bottom: 14, left: 24, right: 24, textAlign: "center" }}>
          <p style={{ fontFamily: MONO, fontSize: 10.5, color: "rgba(255,255,255,.5)", letterSpacing: ".08em" }}>{St.sub}</p>
        </div>
      </div>
    </div>
  );
}

/* ---- Processing ---- */
export function Processing({ go }) {
  const [prog, setProg] = useState(0);
  const [si, setSi] = useState(0);
  const msgs = ["UPLOADING SECURELY", "READING YOUR ID", "MATCHING YOUR FACE", "CONFIRMING LIVENESS", "WRAPPING UP", "ALMOST DONE"];
  useEffect(() => {
    const iv = setInterval(() => setProg((p) => {
      const n = Math.min(p + 1.1, 100);
      if (n >= 100) { clearInterval(iv); setTimeout(() => go(S.SU), 700); }
      return n;
    }), 52);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    const iv = setInterval(() => setSi((i) => Math.min(i + 1, msgs.length - 1)), 1250);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", position: "relative", overflow: "hidden", background: C.bone }}>
      <Grain o={0.05} />
      <div style={{ position: "absolute", top: 36, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.acc, fontWeight: 700, letterSpacing: ".2em" }}>VERIFYING IDENTITY</span>
      </div>
      <div style={{ position: "relative", marginBottom: 4 }}>
        <span style={{ position: "absolute", left: 5, top: 6, fontFamily: NUM, fontSize: 168, color: C.acc, lineHeight: 1, opacity: 0.32 }}>{Math.round(prog)}</span>
        <span style={{ position: "relative", fontFamily: NUM, fontSize: 168, color: C.ink, lineHeight: 1, letterSpacing: "-.02em" }}>{Math.round(prog)}</span>
        <span style={{ position: "absolute", right: -20, top: 14, fontFamily: NUM, fontSize: 38, color: C.ink, opacity: 0.7 }}>%</span>
      </div>
      <div key={si} style={{ marginTop: 14, marginBottom: 34, animation: "ticker .4s ease both" }}>
        <span style={{ fontFamily: DISP, fontSize: 18, color: C.ink, fontWeight: 800, letterSpacing: "-.01em" }}>{msgs[si]}</span>
      </div>
      <div className="fu3" style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {[{ ic: "card", done: prog > 38 }, { ic: "face", done: prog > 66 }].map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "12px 17px", borderRadius: 13, transition: "all .5s", background: it.done ? C.ink : C.paper, border: `1px solid ${it.done ? "transparent" : C.line}` }}>
            <Ic n={it.ic} s={17} c={it.done ? C.glow : C.faint} />
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: ".06em", color: it.done ? "#fff" : C.faint }}>{it.done ? "DONE" : "···"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Success ---- */
export function SuccessScreen({ restart, unlocked = [] }) {
  const has = unlocked.length > 0;
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "36px 20px 26px", position: "relative", overflow: "hidden", background: C.bone }}>
      <Grain o={0.05} />
      <div style={{ position: "absolute", top: "30%", left: "50%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle,${C.acc}2E,transparent 65%)`, animation: "glowPulse 4s ease-in-out infinite" }} />
      <div style={{ textAlign: "center", zIndex: 2, width: "100%" }}>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.acc, fontWeight: 700, letterSpacing: ".2em" }}>IDENTITY CONFIRMED</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", zIndex: 2 }}>
        <div style={{ position: "relative", animation: "rise .55s cubic-bezier(.16,1,.3,1) .1s both", marginBottom: 4 }}>
          <div style={{ borderRadius: "50%", overflow: "hidden", width: has ? 110 : 150, height: has ? 110 : 150 }}>
            <BitAvatar size={has ? 110 : 150} />
          </div>
          <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: has ? 88 : 120, height: 14, borderRadius: "50%", background: "rgba(20,18,16,.16)", filter: "blur(7px)" }} />
        </div>
        <h2 className="fu2" style={{ fontFamily: DISP, fontSize: has ? 38 : 46, fontWeight: 900, color: C.ink, textAlign: "center", marginTop: has ? 14 : 20, marginBottom: 8, letterSpacing: "-.03em", lineHeight: 0.9 }}>
          You're<br />verified.
        </h2>
        <p className="fu3" style={{ fontFamily: DISP, fontSize: 14, fontWeight: 500, color: C.sub, textAlign: "center", lineHeight: 1.5, maxWidth: "80%" }}>
          {has ? "New Quick Proofs are ready to share — no need to hand over your full ID." : "Your identity is confirmed and your account is good to go."}
        </p>
      </div>
      {has && <div style={{ width: "100%", zIndex: 2, background: C.paper, borderRadius: 16, overflow: "hidden", animation: "chipIn .45s cubic-bezier(.16,1,.3,1) .5s both", boxShadow: "0 8px 20px -6px rgba(20,18,16,.13)" }}>
        <div style={{ height: 3, background: C.acc }} />
        <div style={{ padding: "11px 14px 13px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
            <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: ".14em", color: C.acc, fontWeight: 700 }}>JUST UNLOCKED</span>
            <Ic n="spark" s={14} c={C.acc} />
          </div>
          {unlocked.map((p) => (
            <div key={p.k} style={{ display: "flex", alignItems: "center", gap: 9, paddingTop: 8, borderTop: `1px solid ${C.line}` }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: C.acc + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ic n={p.ic} s={14} c={C.acc} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: C.ink }}>{p.full}</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: C.sub, letterSpacing: ".05em", marginTop: 1 }}>FROM {p.from.toUpperCase()}</div>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 8, color: C.acc, fontWeight: 700, letterSpacing: ".08em", background: C.acc + "18", borderRadius: 4, padding: "2px 6px" }}>NEW</span>
            </div>
          ))}
        </div>
      </div>}
      <div style={{ width: "100%", zIndex: 2 }}>
        <Btn label="View your ID" onClick={restart} />
      </div>
    </div>
  );
}
