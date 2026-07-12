import { useState, useEffect, useRef } from "react";
import { C, DISP, MONO } from "../styles/tokens.js";
import { CREDS, PROOFS, expiryOf, EXP } from "../data/credentials.js";
import { Grain, Ic } from "../components/Icon.jsx";
import { BitAvatar } from "../components/BitAvatar.jsx";
import { Header, Btn, Row, Group, Notice, DataRows } from "../components/primitives.jsx";
import { CredCard } from "../components/cards.jsx";

export function Wallet({ openDetail, addNew, onProof, name, ownedDocs, setOwnedDocs, onAccount, onOpenPulse, onPullStart }) {
  const first = (name || "Alex").split(" ")[0];
  const idc = CREDS.find((c) => c.key === "vera");
  const docs = CREDS.filter((c) => !c.token && ownedDocs.includes(c.key)).sort((a, b) => ownedDocs.indexOf(a.key) - ownedDocs.indexOf(b.key));
  const [drag, setDrag] = useState(null);
  const lpRef = useRef(null);
  const startYRef = useRef(0);
  const fromIdxRef = useRef(0);
  const rowHRef = useRef(64);
  const docsListRef = useRef(null);
  const docsTopRef = useRef(0);
  const noClickRef = useRef(false);

  const onDocPointerDown = (e, idx) => {
    if (docs.length < 2) return;
    e.stopPropagation();
    noClickRef.current = false;
    startYRef.current = e.clientY;
    fromIdxRef.current = idx;
    if (lpRef.current) clearTimeout(lpRef.current);
    lpRef.current = setTimeout(() => {
      if (docsListRef.current?.children[idx]) {
        rowHRef.current = docsListRef.current.children[idx].offsetHeight + 1;
        docsTopRef.current = docsListRef.current.offsetTop;
      }
      noClickRef.current = true;
      setDrag({ fromIdx: idx, toIdx: idx, dy: 0 });
    }, 600);
  };
  const cancelLP = () => { if (lpRef.current) clearTimeout(lpRef.current); };

  useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const dy = e.clientY - startYRef.current;
      const offset = Math.round(dy / rowHRef.current);
      const toIdx = Math.max(0, Math.min(docs.length - 1, fromIdxRef.current + offset));
      setDrag((d) => (d ? { ...d, dy, toIdx } : null));
      if (e.cancelable) e.preventDefault();
    };
    const onUp = () => {
      setDrag((prev) => {
        if (!prev) return null;
        if (prev.fromIdx !== prev.toIdx) {
          setOwnedDocs((od) => {
            const docKeys = CREDS.filter((c) => !c.token && od.includes(c.key)).sort((a, b) => od.indexOf(a.key) - od.indexOf(b.key)).map((c) => c.key);
            const arr = [...docKeys];
            const [m] = arr.splice(prev.fromIdx, 1);
            arr.splice(prev.toIdx, 0, m);
            return [...arr, ...od.filter((k) => !docKeys.includes(k))];
          });
        }
        return null;
      });
    };
    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };
  }, [!!drag]);

  const rawProofs = PROOFS.filter((p) => ownedDocs.includes(p.credKey));
  const proofs = rawProofs.some((p) => p.k === "age21") ? rawProofs.filter((p) => p.k !== "age18") : rawProofs;
  const urgentCreds = ownedDocs.map((k) => { const cr = CREDS.find((x) => x.key === k); return { cr, exp: expiryOf(cr) }; })
    .filter((x) => x.exp && x.exp.status !== "valid")
    .sort((a, b) => (a.exp && a.exp.status === "expired" ? 0 : 1) - (b.exp && b.exp.status === "expired" ? 0 : 1));
  const topAlert = urgentCreds[0];

  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", background: C.bone }}>
      <div onPointerDown={(e) => { onPullStart && onPullStart(e.clientY, false); }} onClick={onOpenPulse}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "8px 0 6px", cursor: "pointer", flexShrink: 0, touchAction: "none" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(20,18,16,.2)" }} />
        <span style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 600, letterSpacing: ".07em", color: "rgba(20,18,16,.3)" }}>
          {topAlert ? "PULL FOR UPDATES" : "PULL FOR PULSE"}
        </span>
      </div>
      <div style={{ padding: "0 20px", flexShrink: 0 }}>
        <div className="fu" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.sub, fontWeight: 700, letterSpacing: ".1em" }}>GOOD MORNING</div>
            <div style={{ fontFamily: DISP, fontSize: 26, fontWeight: 900, color: C.ink, letterSpacing: "-.02em", marginTop: 2 }}>{first}'s Wallet</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={onAccount} style={{ width: 46, height: 46, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.acc}`, padding: 2, cursor: "pointer", background: "none" }}>
              <div style={{ borderRadius: "50%", overflow: "hidden", width: "100%", height: "100%" }}>
                <BitAvatar size={38} />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingBottom: 94, paddingLeft: 20, paddingRight: 20, position: "relative" }}>
        <div className="fu1" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9, paddingLeft: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint, fontWeight: 700, letterSpacing: ".12em" }}>YOUR IDENTITY</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.acc, animation: "breathe 1.8s ease infinite" }} />
            <span style={{ fontFamily: MONO, fontSize: 10, color: C.accDeep, fontWeight: 700, letterSpacing: ".06em" }}>ACTIVE</span>
          </div>
        </div>
        <div className="fu1" style={{ marginBottom: 22 }}>
          <CredCard c={idc} h={150} onClick={() => openDetail("vera")} />
        </div>

        <div className="fu2" style={{ marginBottom: 9, paddingLeft: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint, fontWeight: 700, letterSpacing: ".12em" }}>QUICK PROOFS</span>
          <span style={{ fontFamily: DISP, fontSize: 11.5, fontWeight: 500, color: C.faint, marginLeft: 8 }}>tap to share instantly</span>
        </div>
        <div className="fu2" style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 6, marginBottom: 22, scrollbarWidth: "none" }}>
          {proofs.map((p) => (
            <button key={p.k} onClick={() => onProof(p)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "11px 15px", background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: 14, cursor: "pointer", boxShadow: "0 2px 8px rgba(20,18,16,.03)" }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: C.accSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n={p.ic} s={14} c={C.acc} sw={2.4} />
              </div>
              <span style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: C.ink, whiteSpace: "nowrap", letterSpacing: "-.01em" }}>{p.full}</span>
            </button>
          ))}
        </div>

        <div className="fu3" style={{ marginBottom: 9, paddingLeft: 2, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint, fontWeight: 700, letterSpacing: ".12em" }}>DOCUMENTS</span>
        </div>
        <div className="fu3" ref={docsListRef} style={{ background: C.paper, borderRadius: 16, border: `1px solid ${C.line}`, overflow: "hidden", position: "relative", userSelect: "none" }}>
          {docs.map((c, i) => {
            const isDragging = drag && i === drag.fromIdx;
            const from = drag?.fromIdx ?? 0;
            const to = drag?.toIdx ?? 0;
            let shift = 0;
            if (drag && !isDragging) {
              if (to > from && i > from && i <= to) shift = -rowHRef.current;
              if (to < from && i >= to && i < from) shift = rowHRef.current;
            }
            return (
              <div key={c.key}
                onPointerDown={(e) => onDocPointerDown(e, i)}
                onPointerUp={cancelLP} onPointerLeave={cancelLP} onPointerCancel={cancelLP}
                style={{ position: "relative", zIndex: 1,
                  transform: shift && !isDragging ? `translateY(${shift}px)` : "none",
                  transition: "transform 200ms ease", borderTop: i && !isDragging ? `1px solid ${C.line}` : "none",
                  background: C.paper, opacity: isDragging ? 0 : drag ? 0.7 : 1,
                  pointerEvents: isDragging ? "none" : "auto", touchAction: "none" }}>
                <Row ic={c.ic} title={c.type} sub={c.issuer}
                  onClick={() => { if (drag || noClickRef.current) { noClickRef.current = false; return; } openDetail(c.key); }}
                  right={(() => {
                    const exp = expiryOf(c);
                    const expired = exp?.status === "expired";
                    const expiring = exp?.status === "expiring";
                    if (expired || expiring) return (
                      <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: ".05em", whiteSpace: "nowrap",
                        color: expired ? "#D93025" : "#C07B00", background: expired ? "#FEE8E6" : "#FEF4E6", padding: "3px 7px", borderRadius: 6 }}>
                        {expired ? "EXPIRED" : "EXP SOON"}
                      </span>
                    );
                    return <></>;
                  })()}
                />
              </div>
            );
          })}
          {!drag && <div style={{ borderTop: docs.length ? `1px solid ${C.line}` : "none" }}>
            <Row ic="plus" title="Add a document" sub="License, passport, ID card" onClick={addNew} right={<></>} />
          </div>}
        </div>
        {drag && (() => {
          const dc = docs[drag.fromIdx];
          const floatTop = docsTopRef.current + drag.fromIdx * rowHRef.current + drag.dy;
          return (
            <div style={{ position: "absolute", top: floatTop, left: 0, right: 0, zIndex: 100, background: C.paper, borderRadius: 14,
              boxShadow: "0 8px 24px rgba(20,18,16,.18)", transform: "scale(1.03)", transformOrigin: "center center", pointerEvents: "none", overflow: "hidden" }}>
              <Row ic={dc.ic} title={dc.type} sub={dc.issuer} />
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export function Detail({ c, back, onShare, walletAdded = false, onWalletAdd, onUpdate }) {
  const [inWallet, setInWallet] = useState(walletAdded);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUpdateInfo, setShowUpdateInfo] = useState(false);
  const [copyAllDone, setCopyAllDone] = useState(false);
  const [renewExpanded, setRenewExpanded] = useState(false);
  const exp = expiryOf(c);
  const isExpired = exp?.status === "expired";
  useEffect(() => { setInWallet(walletAdded); }, [walletAdded]);
  useEffect(() => {
    if (!showConfirm) return;
    const t = setTimeout(() => setShowConfirm(false), 8000);
    return () => clearTimeout(t);
  }, [showConfirm]);
  const handleWallet = () => {
    if (inWallet) return;
    setInWallet(true);
    setShowConfirm(true);
    onWalletAdd?.();
  };
  if (showUpdateInfo) return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={() => setShowUpdateInfo(false)} eyebrow="UPDATE CREDENTIAL" title={`Scan & confirm your ${c.type}.`} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", marginTop: 18 }}>
        <div className="fu2" style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
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
        <p className="fu2" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: 16, lineHeight: 1.5 }}>
          We'll scan the new {c.type} and match your face to confirm it's you. Nothing is recorded or saved.
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
        <Btn label="Start update" onClick={() => onUpdate(c.key)} />
      </div>
    </div>
  );
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow={c.issuer.toUpperCase()} title={c.type}
          action={<button onClick={handleWallet} style={{ background: C.paper, border: `1px solid ${C.line}`, cursor: inWallet ? "default" : "pointer", height: 42, borderRadius: 13, padding: "0 12px", display: "flex", alignItems: "center", gap: 6, color: inWallet ? C.sub : C.ink, transition: "color .2s" }}>
            <Ic n={inWallet ? "checkcirc" : "applewallet"} s={16} c={inWallet ? C.faint : C.ink} />
            <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700 }}>{inWallet ? "Added to Apple Wallet" : "Add to Apple Wallet"}</span>
          </button>} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18 }}>
        <div className="fu1" style={{ marginBottom: 16 }}>
          <CredCard c={c} h={168} />
        </div>
        {(() => {
          const e = expiryOf(c);
          if (!e || e.status === "valid") return null;
          const expired = e.status === "expired";
          const col = EXP[e.status].color;
          const bg = EXP[e.status].bg;
          return (
            <div style={{ animation: "chipIn .4s cubic-bezier(.16,1,.3,1) both", background: bg, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Ic n="alert" s={15} c={col} />
                <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: col }}>
                  {expired ? `Expired ${Math.abs(e.days)} days ago` : `Expires in ${e.days} day${e.days === 1 ? "" : "s"}`}
                </span>
              </div>
              <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: col, lineHeight: 1.5, margin: "6px 0 8px 0", opacity: 0.9 }}>
                {expired ? `This ${c.type} can no longer be used to verify your identity.` : `This ${c.type} will stop being accepted for verification soon.`}
              </p>
              {(() => {
                const instr = c.key === "dl" || c.key === "stateid"
                  ? { text: "Visit your local DMV in person or renew online with your current ID and proof of residence.", url: "https://dmv.ny.gov", label: "Renew at dmv.ny.gov" }
                  : c.key === "passport" || c.key === "passportcard"
                  ? { text: "Apply at a U.S. passport acceptance facility or renew by mail. Allow 6–8 weeks processing time.", url: "https://travel.state.gov", label: "Renew at travel.state.gov" }
                  : c.key === "militaryid"
                  ? { text: "Visit your nearest RAPIDS site or ID card office on base with your CAC and supporting documents.", url: "https://www.dmdc.osd.mil/milconnect", label: "Renew at RAPIDS" }
                  : { text: "Contact the issuing authority for this document to begin the renewal process.", url: null, label: null };
                return (
                  <div style={{ borderTop: `1px solid ${col}26`, paddingTop: 8 }}>
                    <button onClick={() => setRenewExpanded((r) => !r)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <span style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: col, lineHeight: 1.5 }}>How to renew</span>
                      <div style={{ transform: renewExpanded ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform .2s", display: "flex" }}>
                        <Ic n="chev" s={13} c={col} />
                      </div>
                    </button>
                    {renewExpanded && (
                      <div style={{ marginTop: 6 }}>
                        <p style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: col, lineHeight: 1.5, margin: "4px 0 6px 0" }}>{instr.text}</p>
                        {instr.url && (
                          <a href={instr.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: col, lineHeight: 1.5, textDecoration: "underline", textUnderlineOffset: "2px" }}>{instr.label}</a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })()}
        {showConfirm && <Notice className="fu1" type="success" icon="applewallet" title="Added to Apple Wallet" sub="Available on lock screen" style={{ animation: "chipIn .4s cubic-bezier(.16,1,.3,1) both", marginBottom: 14 }} />}
        <div className="fu2" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", background: C.accSoft, borderRadius: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.acc }} />
            <span style={{ fontFamily: MONO, fontSize: 10, color: C.accDeep, fontWeight: 700, letterSpacing: ".06em" }}>VERIFIED</span>
          </div>
          <span style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.faint }}>Last presented 2 days ago</span>
        </div>
        <div className="fu2" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingLeft: 2 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em" }}>CREDENTIALS</span>
            <button onClick={() => {
                const text = c.fields.map(([k, v]) => `${k}: ${v}`).join("\n");
                try { navigator.clipboard?.writeText(text); } catch (e) { /* noop */ }
                setCopyAllDone(true); setTimeout(() => setCopyAllDone(false), 2000);
              }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "2px 0" }}>
              {copyAllDone
                ? <span style={{ fontFamily: MONO, fontSize: 9, color: C.acc, fontWeight: 700, letterSpacing: ".06em" }}>COPIED</span>
                : <><Ic n="copy" s={11} c={C.faint} sw={2} /><span style={{ fontFamily: MONO, fontSize: 9, color: C.faint, fontWeight: 700, letterSpacing: ".06em" }}>Copy details</span></>}
            </button>
          </div>
          <DataRows rows={c.fields} />
        </div>
      </div>
      <div style={{ flexShrink: 0, marginTop: 14 }}>
        {isExpired
          ? <button onClick={() => setShowUpdateInfo(true)} style={{ width: "100%", padding: "16px", background: "#D93025", border: "none", borderRadius: 16, fontFamily: DISP, fontSize: 16, fontWeight: 800, color: "#fff", cursor: "pointer", letterSpacing: "-.01em" }}>Update credential</button>
          : <Btn label="Present proof" onClick={onShare} />}
      </div>
    </div>
  );
}
