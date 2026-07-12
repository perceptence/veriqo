import { useState } from "react";
import { C, DISP, MONO, SPACE, sp } from "../styles/tokens.js";
import { CREDS } from "../data/credentials.js";
import { Ic } from "../components/Icon.jsx";
import { Notice } from "../components/primitives.jsx";

const ACT_GROUPS = [
  { day: "TODAY", items: [
    { time: "2:14 PM", who: "The Crown Pub", what: "Shared age over 21", cred: "dl", kind: "shared" },
    { time: "11:02 AM", who: "Coinbase", what: "Confirmed your identity", cred: "vera", kind: "verified" },
  ] },
  { day: "YESTERDAY", items: [
    { time: "6:48 PM", who: "Global Entry · SFO", what: "Shared your passport", cred: "passport", kind: "shared" },
    { time: "3:21 PM", who: "Unknown location", what: "Age over 21 presented 4× in 1 hour", cred: "dl", kind: "alert" },
  ] },
  { day: "EARLIER", items: [
    { time: "Mon", who: "Total Wine", what: "Shared your state ID", cred: "stateid", kind: "shared" },
    { time: "Sun", who: "TSA PreCheck", what: "Confirmed your identity", cred: "vera", kind: "verified" },
    { time: "Oct 28", who: "Robinhood", what: "Confirmed your identity", cred: "vera", kind: "verified" },
    { time: "Oct 25", who: "Hertz", what: "Shared driver license", cred: "dl", kind: "shared" },
  ] },
];

export function Pulse({ onViewCred, onClose }) {
  const [view, setPulseView] = useState("feed");
  const [query, setQuery] = useState("");
  const [aiResp, setAiResp] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [dismissed, setDismissed] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [consentStep, setConsentStep] = useState(null);
  const [fieldChoice, setFieldChoice] = useState("city");
  const [trayExiting, setTrayExiting] = useState(false);
  const closeTray = () => setTrayExiting(true);

  const ITEMS = [
    { id: 1, kind: "critical", icon: "shield", title: "Unusual activity flagged", short: "Age credential used 4× in 1 hour yesterday",
      body: "Your Driver's License was used to prove age 4 times between 3:10–4:05 PM at an unrecognised location. This pattern may indicate your credential is being shared without your knowledge.",
      action: "Review activity", actionFn: () => onViewCred?.("dl"), time: "2h ago" },
    { id: 2, kind: "warning", icon: "license", title: "Driver's License expires in 16 days", short: "Jul 10, 2026 — online renewal takes 4+ weeks",
      body: "New York DMV online renewal typically takes 4–6 weeks. Starting today gives you the minimum buffer. You'll need to re-verify in Veriqo once your renewed license arrives.",
      action: "Start renewal", time: "Today" },
    { id: 3, kind: "critical", icon: "passport", title: "Passport is expired", short: "Expired Jun 1, 2026 — 23 days ago",
      body: "Your passport expired 23 days ago. International travel, financial verifications, and federal identity checks will fail until renewed. Current U.S. processing time is 6–8 weeks.",
      action: "Renew passport", time: "3w ago" },
    { id: 4, kind: "warning", icon: "plug", title: "Coinbase wants more of your data", short: "New request: Address field", body: "", time: "2d ago", consent: true },
    { id: 5, kind: "neutral", icon: "history", title: "7 age verifications this month", short: "~14 minutes of document handling saved",
      body: "Your Driver's License is your most-used credential. Those 7 verifications replaced physical ID checks — saving roughly 14 minutes of document handling and manual data entry.", time: "3d ago" },
    { id: 6, kind: "neutral", icon: "calendar", title: "Date of birth shared with 3 services", short: "Consider switching to age-only mode",
      body: "Coinbase, TSA PreCheck, and Robinhood can see your full date of birth. Switching to age-only confirmation gives identical outcomes with less personal data exposure.",
      action: "Review sharing", time: "5d ago" },
    { id: 7, kind: "neutral", icon: "checkcirc", title: "Robinhood verification — clean", short: "Zero-knowledge proof · no documents transmitted",
      body: "Your identity was confirmed in 1.2 seconds. No document photos or raw data were transmitted — Robinhood received only a cryptographic confirmation.", time: "1w ago" },
  ];

  const SECTIONS = [
    { k: "critical", label: "Security", col: "#D93025", bg: "#FEE8E6" },
    { k: "warning", label: "Attention", col: "#C07B00", bg: "#FEF4E6" },
    { k: "neutral", label: "Insights", col: C.sub, bg: C.bone },
  ];
  const kindMeta = {
    critical: { col: "#D93025", bg: "#FEE8E6" },
    warning: { col: "#C07B00", bg: "#FEF4E6" },
    neutral: { col: C.sub, bg: C.bone },
  };
  const active = ITEMS.filter((i) => !dismissed.includes(i.id));

  const askPulse = async () => {
    if (!query.trim() || aiLoading) return;
    setAiLoading(true); setAiResp(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: `You are Pulse, the identity guardian inside Veriqo. Be concise and direct — 2-3 sentences max. No bullet points. No hedging. Speak like a trusted expert.

User identity state:
- Driver's License: expires Jul 10 2026 (16 days)
- Passport: EXPIRED Jun 1 2026 (23 days ago)
- EAD Card: valid until Jun 30 2027
- Suspicious: age credential used 4× in 1 hour yesterday at unknown location
- Coinbase: pending new permission (Address field)
- Date of birth visible to Coinbase, TSA PreCheck, Robinhood
- 7 age verifications this month`,
          messages: [{ role: "user", content: query }],
        }),
      });
      const data = await res.json();
      setAiResp(data.content?.map((b) => b.text || "").join("") || "I couldn't connect. Try again.");
    } catch (e) { setAiResp("Connection issue. Please try again."); }
    setAiLoading(false);
  };

  const PulseIcon = ({ loading }) => (
    <svg viewBox="0 0 24 24" width={16} height={16} style={{ flexShrink: 0 }}>
      <polyline fill="none" stroke={C.acc} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        points="2,12 5,12 7,5 9,19 11,12 13,15 15,9 17,12 22,12"
        style={loading ? { strokeDasharray: 52, strokeDashoffset: 52, animation: "ekg 1.6s linear infinite" } : {}} />
    </svg>
  );

  const FIELD_OPTS = [
    { k: "full", l: "Full address", d: "Street, city, state, ZIP", risk: "High exposure" },
    { k: "city", l: "City only", d: "San Francisco", risk: "Recommended" },
    { k: "state", l: "State only", d: "California", risk: "Minimal exposure" },
    { k: "decline", l: "Decline", d: "Revoke this request", risk: "" },
  ];

  const ConsentFlow = () => {
    if (consentStep === "done") return (
      <div style={{ padding: SPACE[12], animation: "popIn .3s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], background: C.accSoft, borderRadius: 12, padding: sp(12, 12), marginBottom: SPACE[12] }}>
          <Ic n="checkcirc" s={20} c={C.acc} />
          <div>
            <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: C.accDeep }}>{fieldChoice === "decline" ? "Request declined" : "Sharing updated"}</div>
            <div style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.acc, marginTop: SPACE[1] }}>
              {fieldChoice === "decline" ? "Coinbase notified — no address data shared" : `Coinbase now receives: ${FIELD_OPTS.find((f) => f.k === fieldChoice)?.d}`}
            </div>
          </div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.faint, letterSpacing: ".05em", textAlign: "center" }}>
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · CONSENT RECORDED
        </div>
      </div>
    );
    if (consentStep === "biometric") return (
      <div style={{ padding: sp(20, 12), display: "flex", flexDirection: "column", alignItems: "center", animation: "popIn .25s ease both" }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".08em", marginBottom: SPACE[16] }}>CONFIRM WITH FACE ID</div>
        <div style={{ width: 72, height: 72, borderRadius: "50%", border: `2.5px solid ${C.acc}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: SPACE[16], boxShadow: `0 0 0 6px ${C.accSoft}, 0 0 0 12px rgba(21,160,106,.12)`, animation: "ovalDone 1.8s ease infinite" }}>
          <Ic n="faceid" s={32} c={C.acc} />
        </div>
        <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, marginBottom: SPACE[20] }}>
          Sharing {fieldChoice === "decline" ? "nothing" : FIELD_OPTS.find((f) => f.k === fieldChoice)?.l.toLowerCase()} with Coinbase
        </div>
        <button onClick={() => setConsentStep("done")} style={{ background: C.acc, border: "none", borderRadius: 10, padding: sp(12, 28), cursor: "pointer", fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: "#fff" }}>Authenticate</button>
      </div>
    );
    return (
      <div style={{ padding: SPACE[12], animation: "popIn .25s ease both" }}>
        <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, lineHeight: 1.55, marginBottom: SPACE[12] }}>
          Coinbase added an Address field to their data request. Choose exactly what to share.
        </div>
        <div style={{ display: "flex", gap: SPACE[8], alignItems: "flex-start", background: C.bone, borderRadius: 11, padding: sp(8, 12), marginBottom: SPACE[12] }}>
          <svg viewBox="0 0 24 24" width={14} height={14} style={{ flexShrink: 0, marginTop: SPACE[2] }}>
            <polyline fill="none" stroke={C.acc} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" points="2,12 5,12 7,5 9,19 11,12 13,15 15,9 17,12 22,12" />
          </svg>
          <p style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 500, color: C.accDeep, margin: 0, lineHeight: 1.5 }}>
            City is enough for tax residency verification. Sharing your full address gives Coinbase more than they need.
          </p>
        </div>
        <div style={{ background: C.paper, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.line}`, marginBottom: SPACE[12] }}>
          {FIELD_OPTS.map((opt, i) => (
            <div key={opt.k} onClick={() => setFieldChoice(opt.k)} style={{ display: "flex", alignItems: "center", gap: SPACE[12], padding: sp(12, 12), cursor: "pointer", borderTop: i ? `1px solid ${C.line}` : "none", background: fieldChoice === opt.k ? C.bone : "transparent", transition: "background .15s" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: `2px solid ${fieldChoice === opt.k ? C.acc : C.line}`, background: fieldChoice === opt.k ? C.acc : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                {fieldChoice === opt.k && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: C.ink }}>{opt.l}</div>
                <div style={{ fontFamily: DISP, fontSize: 12, color: C.faint, marginTop: SPACE[1] }}>{opt.d}</div>
              </div>
              {opt.risk && (
                <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 700, flexShrink: 0, padding: sp(2, 6), borderRadius: 5, letterSpacing: ".04em",
                  color: opt.k === "city" ? C.acc : opt.k === "decline" ? C.faint : "#C07B00",
                  background: opt.k === "city" ? C.accSoft : opt.k === "decline" ? C.bone : "#FEF4E6" }}>{opt.risk}</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: SPACE[8] }}>
          <button onClick={() => { setDismissed((d) => [...d, 4]); setExpanded(null); }} style={{ flex: 1, padding: SPACE[12], background: "transparent", border: `1.5px solid ${C.line}`, borderRadius: 11, cursor: "pointer", fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.faint }}>Later</button>
          <button onClick={() => setConsentStep("biometric")} style={{ flex: 1, padding: SPACE[12], background: fieldChoice === "decline" ? "#D93025" : C.acc, border: "none", borderRadius: 11, cursor: "pointer", fontFamily: DISP, fontSize: 13, fontWeight: 700, color: "#fff" }}>
            {fieldChoice === "decline" ? "Decline request" : "Approve"}
          </button>
        </div>
      </div>
    );
  };

  const ActivityView = () => (
    <div style={{ padding: "4px 0 88px" }}>
      {ACT_GROUPS.map((g) => (
        <div key={g.day} className="fu2">
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(6, 0, 8, 2) }}>{g.day}</div>
          <div style={{ background: C.paper, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}`, marginBottom: SPACE[12] }}>
            {g.items.map((it, ii) => {
              const cr = CREDS.find((c) => c.key === it.cred) || { ic: "shield", type: it.cred };
              const tone = it.kind === "alert" ? "#D93025" : it.kind === "verified" ? C.acc : C.ink;
              const bg = it.kind === "alert" ? "#FEE8E6" : it.kind === "verified" ? C.accSoft : C.bone;
              return (
                <div key={ii} style={{ display: "flex", alignItems: "flex-start", gap: SPACE[12], padding: sp(12, 12), borderTop: ii ? `1px solid ${C.line}` : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Ic n={it.kind === "alert" ? "alert" : cr.ic} s={14} c={tone} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: C.ink }}>{it.who}</div>
                    <div style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.faint, marginTop: SPACE[1] }}>{it.what}</div>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 9, color: C.faint, letterSpacing: ".04em", flexShrink: 0 }}>{it.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <Notice type="info" icon="lock" title="Every share was approved by you" sub="Nothing leaves your wallet without Face ID confirmation." />
    </div>
  );

  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", background: C.bone, position: "relative", overflow: "hidden" }}>
      <div style={{ padding: sp(20, 20, 0), flexShrink: 0, touchAction: "pan-x" }}
        onPointerDown={(e) => { if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return; e.currentTarget.setPointerCapture(e.pointerId); e.currentTarget._sy = e.clientY; }}
        onPointerMove={(e) => { if (e.currentTarget._sy === undefined) return; if (e.clientY - e.currentTarget._sy > 60) { onClose && onClose(); delete e.currentTarget._sy; e.currentTarget.releasePointerCapture(e.pointerId); } }}
        onPointerUp={(e) => { delete e.currentTarget._sy; }} onPointerCancel={(e) => { delete e.currentTarget._sy; }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.acc, fontWeight: 700, letterSpacing: ".12em", marginBottom: SPACE[3] }}>IDENTITY INTELLIGENCE</div>
        <div style={{ fontFamily: DISP, fontSize: 28, fontWeight: 900, color: C.ink, letterSpacing: "-.02em", marginBottom: SPACE[16] }}>Pulse</div>
        <div style={{ background: C.paper, borderRadius: 14, border: `1px solid ${C.line}`, marginBottom: SPACE[12], overflow: "hidden" }}>
          <div style={{ padding: sp(8, 12), display: "flex", alignItems: "center", gap: SPACE[8] }}>
            <PulseIcon loading={aiLoading} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askPulse()} placeholder="Ask anything about your identity…" style={{ flex: 1, border: "none", background: "none", fontFamily: DISP, fontSize: 13.5, color: C.ink, outline: "none" }} />
            {(query || aiResp) && (
              <button onClick={() => { setQuery(""); setAiResp(null); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: 0.35, lineHeight: 0 }}>
                <Ic n="x" s={14} c={C.ink} />
              </button>
            )}
          </div>
          {aiResp && (
            <div style={{ borderTop: `1px solid ${C.line}`, padding: sp(8, 12) }}>
              <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, margin: 0, color: C.sub, lineHeight: 1.55 }}>{aiResp}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", background: "rgba(20,18,16,.07)", borderRadius: 10, padding: SPACE[3], margin: sp(0, 20, 12), flexShrink: 0 }}>
        {[{ v: "feed", ic: "pulse", l: "Feed" }, { v: "timeline", ic: "history", l: "Timeline" }].map(({ v, ic, l }) => {
          const on = view === v;
          return (
            <button key={v} onClick={() => setPulseView(v)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: SPACE[4], padding: sp(4, 12), borderRadius: 8, border: "none", cursor: "pointer", transition: "all .2s", background: on ? C.paper : "transparent", boxShadow: on ? "0 1px 4px rgba(20,18,16,.12)" : "none" }}>
              <Ic n={ic} s={13} c={on ? C.ink : C.faint} sw={on ? 2 : 1.8} />
              <span style={{ fontFamily: DISP, fontSize: 12, fontWeight: 700, color: on ? C.ink : C.faint }}>{l}</span>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: `0 20px ${active.some((i) => i.id === expanded) ? "62%" : "32px"}` }}>
        {view === "timeline" && <ActivityView />}
        {view === "feed" && (
          <>
            {SECTIONS.map((sec) => {
              const items = active.filter((i) => i.kind === sec.k);
              if (items.length === 0) return null;
              return (
                <div key={sec.k} style={{ marginBottom: SPACE[20] }}>
                  <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[8] }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: sec.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ic n={sec.k === "critical" ? "alert" : sec.k === "warning" ? "clock" : "eye"} s={12} c={sec.col} />
                    </div>
                    <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink, flex: 1 }}>{sec.label}</span>
                    <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: sec.col, background: sec.bg, padding: sp(2, 6), borderRadius: 5, letterSpacing: ".04em" }}>{items.length}</span>
                  </div>
                  <div style={{ display: "flex", gap: SPACE[8], overflowX: "auto", scrollbarWidth: "none", marginLeft: -20, paddingLeft: SPACE[20], marginRight: -20, paddingRight: SPACE[20], paddingBottom: SPACE[4] }}>
                    {items.map((item) => {
                      const m = kindMeta[item.kind] || kindMeta.neutral;
                      const isExp = expanded === item.id;
                      return (
                        <div key={item.id} onClick={() => setExpanded(isExp ? null : item.id)} style={{ width: 172, flexShrink: 0, borderRadius: 12, cursor: "pointer", display: "flex", flexDirection: "column", padding: sp(12, 12, 8), gap: SPACE[6], background: isExp ? m.bg : C.paper, border: isExp ? `1.5px solid ${m.col}` : `1px solid ${C.line}`, transition: "background .2s, border-color .2s" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                            <div style={{ width: 26, height: 26, borderRadius: 7, background: isExp ? "rgba(255,255,255,.55)" : m.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}>
                              <Ic n={item.icon} s={12} c={m.col} />
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setDismissed((d) => [...d, item.id]); if (expanded === item.id) { setExpanded(null); setTrayExiting(false); } }} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.3, padding: SPACE[1], lineHeight: 0 }}>
                              <Ic n="x" s={10} c={C.ink} />
                            </button>
                          </div>
                          <div style={{ fontFamily: DISP, fontSize: 12, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{item.title}</div>
                          <p style={{ fontFamily: DISP, fontSize: 11, fontWeight: 500, color: C.faint, margin: 0, lineHeight: 1.4, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.short}</p>
                          <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: ".05em", color: isExp ? m.col : C.faint, transition: "color .2s" }}>{item.time.toUpperCase()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {active.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: C.accSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Ic n="checkcirc" s={26} c={C.acc} />
                </div>
                <p style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: C.ink, margin: sp(0, 0, 4) }}>All clear</p>
                <p style={{ fontFamily: DISP, fontSize: 13, color: C.faint, margin: 0 }}>Nothing needs your attention.</p>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ flexShrink: 0, height: 44, marginTop: -44, pointerEvents: "none", background: `linear-gradient(to bottom, ${C.bone}00, ${C.bone})`, position: "relative", zIndex: 2 }} />

      {(active.some((i) => i.id === expanded) || trayExiting) && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, boxShadow: "0 -8px 40px rgba(20,18,16,.14)", borderRadius: "20px 20px 0 0", background: C.paper, maxHeight: "62%", display: "flex", flexDirection: "column", animation: trayExiting ? "slideDown .35s cubic-bezier(.32,0,.15,1) both" : "slideUp .38s cubic-bezier(.32,0,.15,1) both" }}
          onAnimationEnd={() => { if (trayExiting) { setExpanded(null); setTrayExiting(false); setConsentStep(null); } }}>
          <div style={{ display: "flex", justifyContent: "center", padding: sp(8, 0, 4), flexShrink: 0, touchAction: "none", cursor: "grab" }}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); e.currentTarget._sy = e.clientY; }}
            onPointerMove={(e) => { if (e.currentTarget._sy === undefined) return; if (e.clientY - e.currentTarget._sy > 50) { closeTray(); delete e.currentTarget._sy; e.currentTarget.releasePointerCapture(e.pointerId); } }}
            onPointerUp={(e) => { delete e.currentTarget._sy; }} onPointerCancel={(e) => { delete e.currentTarget._sy; }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(20,18,16,.18)" }} />
          </div>
          {(() => {
            const ei = active.find((i) => i.id === expanded);
            const es = SECTIONS.find((s) => s.k === ei?.kind) || { col: C.sub, label: "Detail" };
            const m = kindMeta[ei?.kind] || kindMeta.neutral;
            return ei ? (
              <>
                <div style={{ padding: sp(4, 20, 12), borderBottom: `1px solid ${C.line}`, flexShrink: 0, touchAction: "none", cursor: "grab" }}
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); e.currentTarget._sy = e.clientY; }}
                  onPointerMove={(e) => { if (e.currentTarget._sy === undefined) return; if (e.clientY - e.currentTarget._sy > 50) { closeTray(); delete e.currentTarget._sy; e.currentTarget.releasePointerCapture(e.pointerId); } }}
                  onPointerUp={(e) => { delete e.currentTarget._sy; }} onPointerCancel={(e) => { delete e.currentTarget._sy; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: SPACE[8] }}>
                    <Ic n={ei.icon} s={13} c={m.col} />
                    <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: m.col, letterSpacing: ".06em" }}>{es.label.toUpperCase()}</span>
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {ei.consent
                    ? <ConsentFlow />
                    : <div style={{ padding: sp(16, 20, 24) }}>
                        <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: C.ink, marginBottom: SPACE[8], lineHeight: 1.3 }}>{ei.title}</div>
                        <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, lineHeight: 1.6, margin: sp(0, 0, 16) }}>{ei.body}</p>
                        {ei.action && (
                          <button onClick={ei.actionFn} style={{ background: m.col === C.sub ? C.ink : m.col, border: "none", borderRadius: 10, padding: sp(12, 20), cursor: "pointer", fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{ei.action}</button>
                        )}
                      </div>}
                </div>
              </>
            ) : null;
          })()}
        </div>
      )}

      <div onPointerDown={(e) => {
          const sy = e.clientY;
          const move = (mv) => { if (sy - mv.clientY > 50) { onClose && onClose(); window.removeEventListener("pointermove", move); } };
          window.addEventListener("pointermove", move, { passive: true });
          window.addEventListener("pointerup", () => window.removeEventListener("pointermove", move), { once: true });
        }} onClick={onClose}
        style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: SPACE[4], paddingBottom: SPACE[12], cursor: "pointer", touchAction: "none", position: "relative", zIndex: 3 }}>
        <div style={{ width: 88, height: 5, borderRadius: 3, background: "rgba(20,18,16,.2)" }} />
      </div>
    </div>
  );
}
