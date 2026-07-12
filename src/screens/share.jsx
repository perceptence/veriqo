import { useState, useEffect } from "react";
import { C, DISP, MONO, NUM } from "../styles/tokens.js";
import { SHARE_HISTORY } from "../data/credentials.js";
import { Ic } from "../components/Icon.jsx";
import { BitAvatar } from "../components/BitAvatar.jsx";
import { Header, Back, Btn, Group, Row, Toggle, Notice } from "../components/primitives.jsx";
import { QR } from "../components/cards.jsx";

export function Share({ c, back, claim, defaults = {}, docOverride, onSaveOverride, profile }) {
  const [mode, setMode] = useState("qr");
  const [choosing, setChoosing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [attrs, setAttrs] = useState(() => docOverride || defaults);
  const isCustom = docOverride != null;
  const updateAttr = (k) => {
    setAttrs((prev) => { const next = { ...prev, [k]: !prev[k] }; onSaveOverride?.(c.key, next); return next; });
  };
  const resetToDefaults = () => { setAttrs(defaults); onSaveOverride?.(c.key, null); };
  const genPin = () => { const r = () => Math.floor(100 + Math.random() * 900); return r() + "·" + r(); };
  const [tok, setTok] = useState(30);
  const [pin, setPin] = useState(genPin);
  useEffect(() => {
    if (mode !== "code" || choosing || previewing) return;
    setTok(30); setPin(genPin());
    const iv = setInterval(() => setTok((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [mode, choosing, previewing]);
  const regen = () => { setPin(genPin()); setTok(30); };
  const modes = [{ k: "qr", l: "QR / Tap" }, { k: "code", l: "One-time PIN" }];
  const sel = Object.values(attrs).filter(Boolean).length;
  const total = Object.keys(attrs).length;
  const icForAttr = (k) => k === "Age over 21" ? "wine" : k === "Photo" ? "camera" : k === "Date of birth" ? "calendar" : k === "Document number" ? "hash" : k === "Address" ? "mappin" : "user";
  const valForAttr = (k) => {
    if (k === "Photo") return null;
    if (k === "Age over 21" || k === "Age over 18") return "Confirmed";
    const f = c.fields?.find(([n]) => {
      const l = n.toLowerCase();
      if (k === "Name") return l === "name";
      if (k === "Date of birth") return l === "dob" || l.includes("birth");
      if (k === "Document number") return l.includes("no.") || l.includes("id no");
      if (k === "Address") return l === "address" || l.includes("addr");
      return false;
    });
    if (f?.[1]) return f[1];
    if (k === "Name") return profile?.name || "—";
    if (k === "Date of birth") return profile?.dob || "—";
    return "—";
  };

  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        {choosing ? (
          <Header back={() => setChoosing(false)} eyebrow="SELECTIVE DISCLOSURE" title="Choose what to share" />
        ) : previewing ? (
          <Header back={() => setPreviewing(false)} eyebrow="VERIFIER'S VIEW" title="What they'll see" />
        ) : (
          <>
            <div className="fu" style={{ marginBottom: 14 }}><Back onClick={back} /></div>
            <div className="fu1">
              <div style={{ fontFamily: MONO, fontSize: 11, color: C.acc, fontWeight: 700, letterSpacing: ".12em", marginBottom: claim ? 2 : 4 }}>{claim ? "PROVING" : "PRESENT PROOF"}</div>
              <h1 style={{ fontFamily: DISP, fontSize: 29, fontWeight: 900, color: C.ink, letterSpacing: "-.025em", lineHeight: 0.98 }}>{claim || c.type}</h1>
              {claim && <div style={{ fontFamily: DISP, fontSize: 12, fontWeight: 600, color: C.sub, marginTop: 4 }}>via {c.type}</div>}
            </div>
            <div style={{ display: "flex", gap: 5, background: "rgba(20,18,16,.05)", borderRadius: 13, padding: 4, marginTop: 14 }}>
              {modes.map((m) => (
                <button key={m.k} onClick={() => setMode(m.k)} style={{ flex: 1, padding: "10px 4px", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: DISP, fontSize: 13, fontWeight: 700, letterSpacing: "-.01em", transition: "all .2s", background: mode === m.k ? C.ink : "transparent", color: mode === m.k ? "#fff" : C.sub }}>{m.l}</button>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 16, display: "flex", flexDirection: "column" }}>
        {choosing && (
          <div key="choose" style={{ animation: "sheetUp .35s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, lineHeight: 1.5, flex: 1 }}>Reveal exactly what's needed. Everything else stays private.</p>
              {isCustom && <button onClick={resetToDefaults} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 0 12px", fontFamily: DISP, fontSize: 12, fontWeight: 700, color: C.acc, flexShrink: 0 }}>Reset</button>}
            </div>
            {isCustom && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, padding: "5px 10px", background: C.bone, borderRadius: 20, alignSelf: "flex-start", width: "fit-content" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.acc }} />
              <span style={{ fontFamily: MONO, fontSize: 9.5, color: C.sub, fontWeight: 700, letterSpacing: ".06em" }}>CUSTOM FOR THIS ID</span>
            </div>}
            <Group>
              {Object.keys(attrs).map((k) => (
                <Row key={k} ic={icForAttr(k)} title={k}
                  sub={k === "Age over 21" ? "Shares yes/no — not your birth date" : undefined}
                  right={<Toggle on={attrs[k]} onClick={() => updateAttr(k)} />} />
              ))}
            </Group>
            <Notice type="success" icon="lock" title={`${sel} of ${total} attributes selected to share`} style={{ marginTop: 14 }} />
          </div>
        )}

        {previewing && !choosing && (
          <div key="preview" style={{ animation: "sheetUp .35s ease both" }}>
            <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, marginBottom: 14, lineHeight: 1.5 }}>This is exactly what the verifier receives — nothing more.</p>
            <div style={{ background: C.paper, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}`, marginBottom: 14 }}>
              <div style={{ background: c.accent, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Ic n={c.ic} s={18} c="#fff" />
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,.65)", letterSpacing: ".1em" }}>VERIQO VERIFIED</div>
                  <div style={{ fontFamily: DISP, fontSize: 14, fontWeight: 700, color: "#fff" }}>{c.type}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.2)", borderRadius: 20, padding: "4px 10px" }}>
                  <Ic n="shield" s={12} c="#fff" />
                  <span style={{ fontFamily: MONO, fontSize: 9, color: "#fff", letterSpacing: ".06em" }}>VALID</span>
                </div>
              </div>
              {Object.keys(attrs).map((k, i) => {
                const shared = attrs[k];
                const val = valForAttr(k);
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderTop: i > 0 ? `1px solid ${C.line}` : undefined, background: shared ? C.paper : C.bone }}>
                    <Ic n={icForAttr(k)} s={15} c={shared ? C.ink : C.faint} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: C.faint, fontWeight: 700, letterSpacing: ".08em" }}>{k.toUpperCase()}</div>
                      {shared ? (
                        k === "Photo"
                          ? <div style={{ marginTop: 4 }}><BitAvatar size={28} /></div>
                          : <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 600, color: C.ink, marginTop: 2 }}>{val}</div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <Ic n="lock" s={11} c={C.faint} />
                          <span style={{ fontFamily: DISP, fontSize: 12, color: C.faint, fontWeight: 500 }}>Private</span>
                        </div>
                      )}
                    </div>
                    {shared && <Ic n="check" s={14} c={C.acc} sw={2.5} />}
                  </div>
                );
              })}
            </div>
            <Notice type="info" icon="eye" title={'Adjust under "Choose what to share"'} />
          </div>
        )}

        {!choosing && !previewing && (
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6px 0" }}>
              {mode === "qr" && (
                <div key="qr" style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "sheetUp .35s ease both" }}>
                  <div style={{ position: "relative" }}>
                    <QR seed={c.key + "-proof"} size={150} />
                    <div style={{ position: "absolute", left: 14, right: 14, height: 2, background: `linear-gradient(90deg,transparent,${C.acc},transparent)`, animation: "scanQR 2.2s ease-in-out infinite" }} />
                  </div>
                  <p style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: C.ink, marginTop: 14 }}>Hold near the reader</p>
                </div>
              )}
              {mode === "code" && (
                <div key="code" style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "sheetUp .35s ease both" }}>
                  <div style={{ position: "relative", width: 120, height: 120, marginBottom: 14 }}>
                    <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(20,18,16,.08)" strokeWidth="5" />
                      <circle cx="60" cy="60" r="52" fill="none" stroke={tok > 0 ? C.acc : "rgba(20,18,16,.16)"} strokeWidth="5" strokeLinecap="round" strokeDasharray={52 * 2 * Math.PI} strokeDashoffset={52 * 2 * Math.PI * (1 - tok / 30)} style={{ transition: "stroke-dashoffset 1s linear" }} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      {tok > 0 ? (<>
                        <div style={{ fontFamily: NUM, fontSize: 33, color: C.ink, lineHeight: 1 }}>0:{String(tok).padStart(2, "0")}</div>
                        <div style={{ fontFamily: MONO, fontSize: 9, color: C.faint, letterSpacing: ".1em", marginTop: 3 }}>EXPIRES</div>
                      </>) : (<>
                        <Ic n="rotate" s={23} c={C.faint} sw={2} />
                        <div style={{ fontFamily: MONO, fontSize: 9, color: C.faint, letterSpacing: ".08em", marginTop: 5 }}>EXPIRED</div>
                      </>)}
                    </div>
                  </div>
                  <div style={{ background: tok > 0 ? C.ink : "rgba(20,18,16,.06)", borderRadius: 13, padding: "11px 24px", textAlign: "center", transition: "background .3s" }}>
                    <div style={{ fontFamily: MONO, fontSize: 8.5, color: tok > 0 ? "rgba(255,255,255,.5)" : C.faint, letterSpacing: ".1em", marginBottom: 5 }}>ONE-TIME PIN</div>
                    <div style={{ fontFamily: NUM, fontSize: 29, letterSpacing: ".18em", color: tok > 0 ? "#fff" : C.faint }}>{pin}</div>
                  </div>
                  {tok > 0 ? (
                    <p style={{ fontFamily: DISP, fontSize: 11.5, fontWeight: 500, color: C.faint, marginTop: 9, textAlign: "center", whiteSpace: "nowrap" }}>Works once, then expires.</p>
                  ) : (
                    <button onClick={regen} style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9, background: "none", border: "none", cursor: "pointer", padding: "4px 6px" }}>
                      <Ic n="rotate" s={14} c={C.acc} sw={2.4} />
                      <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.acc }}>Generate new PIN</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {!choosing && !previewing && (SHARE_HISTORY[c.key] || []).length > 0 && (
          <div className="fu3" style={{ marginTop: 22 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", marginBottom: 10, paddingLeft: 2 }}>RECENT SHARES</p>
            <Group>
              {(SHARE_HISTORY[c.key] || []).map((h, i) => (
                <Row key={i} ic="shield" title={h.who} sub={h.what}
                  right={<span style={{ fontFamily: MONO, fontSize: 9, color: C.faint, letterSpacing: ".04em" }}>{h.time.toUpperCase()}</span>} />
              ))}
            </Group>
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, marginTop: 14 }}>
        {choosing || previewing ? (
          <Btn label="Done" onClick={() => { setChoosing(false); setPreviewing(false); }} />
        ) : (
          <>
            <button onClick={() => setPreviewing(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "4px 0 14px" }}>
              <Ic n="eye" s={14} c={C.acc} />
              <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.acc }}>Preview what they'll see</span>
            </button>
            <button onClick={() => setChoosing(true)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, cursor: "pointer", width: "100%", flexShrink: 0, boxShadow: "0 2px 8px rgba(20,18,16,.03)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: C.bone, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="sliders" s={17} c={C.ink} /></div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontFamily: DISP, fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: "-.01em" }}>Choose what to share</div>
                <div style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.faint, marginTop: 1 }}>{sel} of {total} details selected</div>
              </div>
              <Ic n="chev" s={16} c={C.faint} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
