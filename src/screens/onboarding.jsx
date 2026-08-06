import { useState, useEffect } from "react";
import { C, DISP, MONO, NUM, SPACE, sp, STATUS } from "../styles/tokens.js";
import { Grain, Ic } from "../components/Icon.jsx";
import { BitAvatar } from "../components/BitAvatar.jsx";
import { Wordmark, LogoMark, markSvg, LOGO } from "../components/Logo.jsx";
import { Header, ProgressDots, Btn, Notice, Group, Row } from "../components/primitives.jsx";

/* ---- ToS / Privacy ---- */
export function ToSScreen({ back, which = "tos" }) {
  const isPrivacy = which === "privacy";
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="LEGAL" title={isPrivacy ? "Privacy Policy" : "Terms of Service"} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        {[
          { h: "Overview", p: isPrivacy
            ? "Veriqo stores your identity credentials encrypted on your device only. We never transmit, sell, or access your data without your explicit action."
            : "By using Veriqo you agree to use the app only for lawful identity verification purposes. You retain ownership of all your credentials." },
          { h: isPrivacy ? "Data storage" : "Acceptable use", p: isPrivacy
            ? "All credential data is encrypted using AES-256 and stored in the device's secure enclave. No data is synced to Veriqo servers."
            : "You may not use Veriqo to present fraudulent credentials, impersonate another person, or circumvent third-party verification systems." },
          { h: isPrivacy ? "Sharing" : "Credential accuracy", p: isPrivacy
            ? "You control exactly what is shared and with whom. Veriqo never shares your data automatically. Every presentation requires Face ID confirmation."
            : "You are responsible for ensuring the credentials you add to Veriqo are valid and belong to you. Veriqo verifies document authenticity but cannot guarantee against sophisticated fraud." },
          { h: isPrivacy ? "Your rights" : "Limitation of liability", p: isPrivacy
            ? "You may export or delete all your data at any time from Account settings. Deletion is permanent and irreversible."
            : "Veriqo is not liable for any losses resulting from third-party acceptance or rejection of your verified credentials." },
        ].map(({ h, p }, i) => (
          <div key={i} className="fu1" style={{ marginBottom: SPACE[20] }}>
            <div style={{ fontFamily: DISP, fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: SPACE[6] }}>{h}</div>
            <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, lineHeight: 1.6 }}>{p}</p>
          </div>
        ))}
        <p style={{ fontFamily: MONO, fontSize: 9.5, color: C.faint, letterSpacing: ".04em", marginTop: SPACE[8] }}>LAST UPDATED JUNE 2026 · VERIQO INC.</p>
      </div>
    </div>
  );
}

/* ---- Welcome ---- */
export function Welcome({ go, onSignIn }) {
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "22%", left: "-15%", width: 230, height: 230, borderRadius: "50%", filter: "blur(56px)", opacity: 0.5, background: `radial-gradient(circle,${C.acc},transparent 66%)`, animation: "auroA 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "30%", right: "-18%", width: 210, height: 210, borderRadius: "50%", filter: "blur(60px)", opacity: 0.38, background: `radial-gradient(circle,#3FD9A0,transparent 66%)`, animation: "auroB 11s ease-in-out infinite" }} />
      <Grain o={0.05} />
      <div className="fu" style={{ display: "flex", alignItems: "center", position: "relative" }}>
        <Wordmark size={24} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: SPACE[6], padding: sp(4, 12), border: `1px solid ${C.line}`, borderRadius: 8, background: "rgba(255,255,255,.5)", backdropFilter: "blur(4px)" }}>
          <Ic n="lock" s={11} c={C.sub} />
          <span style={{ fontFamily: MONO, fontSize: 10, color: C.sub, fontWeight: 700, letterSpacing: ".08em" }}>SECURE</span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <div className="fu2" style={{ position: "relative", width: "100%", height: 188, borderRadius: 22, overflow: "hidden", marginBottom: SPACE[28], background: "linear-gradient(150deg,#322D24,#141210)", boxShadow: "0 28px 32px -28px rgba(20,18,16,.5), inset 0 1px 0 rgba(255,255,255,.06)" }}>
          <Grain o={0.12} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: C.acc }} />
          <div style={{ position: "absolute", top: -20, bottom: -20, left: 0, width: "45%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.16),transparent)", animation: "sheen 6s ease-in-out infinite" }} />
          <div style={{ position: "relative", padding: sp(20, 20), height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <LogoMark size={22} />
              <div style={{ display: "flex", alignItems: "center", gap: SPACE[6], padding: sp(4, 8), borderRadius: 20, background: C.acc + "26" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.glow, animation: "breathe 1.6s ease infinite" }} />
                <span style={{ fontFamily: MONO, fontSize: 9, color: C.glow, fontWeight: 700, letterSpacing: ".08em" }}>VERIFIED</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE[12] }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", overflow: "hidden", background: C.bone, flexShrink: 0 }}><BitAvatar size={50} /></div>
              <div>
                <div style={{ fontFamily: DISP, fontSize: 19, fontWeight: 800, color: "#fff", letterSpacing: "-.01em" }}>Alex Morgan</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,.5)", marginTop: SPACE[3], letterSpacing: ".08em" }}>VERIFIED · JUN 2026</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ padding: sp(4, 12), borderRadius: 9, border: "1px solid rgba(255,255,255,.14)" }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,.72)", letterSpacing: ".04em" }}>vid:0x7Q2K·9F1X</span>
              </div>
              <Ic n="shield" s={18} c="rgba(255,255,255,.4)" />
            </div>
          </div>
        </div>
        <div className="fu3" style={{ fontFamily: MONO, fontSize: 11, color: C.sub, fontWeight: 700, letterSpacing: ".16em", marginBottom: SPACE[12] }}>DIGITAL IDENTITY WALLET</div>
        <h1 className="fu4" style={{ fontFamily: DISP, fontSize: 38, fontWeight: 900, color: C.ink, lineHeight: 0.92, letterSpacing: "-.035em", marginBottom: SPACE[12] }}>
          Every ID.<br />One <span style={{ color: C.accDeep }}>wallet.</span>
        </h1>
        <p className="fu4" style={{ fontFamily: DISP, fontSize: 14.5, fontWeight: 500, color: C.sub, lineHeight: 1.5, maxWidth: "88%" }}>
          Verify once. Prove anything. Reveal only what's needed.
        </p>
      </div>
      <div className="fu5" style={{ position: "relative" }}>
        <Btn label="Get started" onClick={() => go()} />
        <button onClick={onSignIn} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: sp(12, 0, 0), fontFamily: DISP, fontSize: 13, fontWeight: 600, color: C.sub }}>Already have an account? <span style={{ color: C.accDeep }}>Sign in</span></button>
        <p style={{ textAlign: "center", fontFamily: MONO, fontSize: 10, color: C.faint, marginTop: SPACE[12], letterSpacing: ".04em" }}>ENCRYPTED ON-DEVICE · YOU CONTROL EVERY SHARE</p>
      </div>
    </div>
  );
}

/* ---- Onboarding: details ---- */
export function OnbDetails({ back, onDone }) {
  const [email, setEmail] = useState("alex.morgan@email.com");
  const [phone, setPhone] = useState("(917) 555-0142");
  const [agreed, setAgreed] = useState(false);
  const [tosView, setTosView] = useState(null);
  if (tosView) return <ToSScreen back={() => setTosView(null)} which={tosView} />;
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <ProgressDots current={1} total={3} />
        <Header back={back} eyebrow="STEP 1 · YOUR DETAILS" title="How do we reach you?" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: SPACE[16], lineHeight: 1.5 }}>
          We'll use these to confirm it's really you and send important account notifications. Your name and date of birth get confirmed straight from your ID in the next step — no need to type them.
        </p>
        <div className="fu2" style={{ marginBottom: SPACE[12] }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".1em", marginBottom: SPACE[6], paddingLeft: SPACE[2] }}>EMAIL</div>
          <input value={email} placeholder="you@email.com" onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: sp(12, 16), background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: 13, fontFamily: DISP, fontSize: 15, fontWeight: 600, color: C.ink, outline: "none" }} />
        </div>
        <div className="fu3" style={{ marginBottom: SPACE[16] }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".1em", marginBottom: SPACE[6], paddingLeft: SPACE[2] }}>PHONE NUMBER</div>
          <input value={phone} placeholder="(555) 000-0000" onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: sp(12, 16), background: C.paper, border: `1.5px solid ${C.line}`, borderRadius: 13, fontFamily: DISP, fontSize: 15, fontWeight: 600, color: C.ink, outline: "none" }} />
        </div>
        <Notice className="fu3" type="success" icon="shield" title="Encrypted on your device" sub="Never sold or transmitted to anyone." style={{ marginBottom: SPACE[16] }} />
        <button onClick={() => setAgreed((a) => !a)} className="fu3" style={{ display: "flex", alignItems: "flex-start", gap: SPACE[8], width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: SPACE[1], border: `2px solid ${agreed ? C.acc : C.line}`, background: agreed ? C.acc : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
            {agreed && <Ic n="check" s={12} c="#fff" />}
          </div>
          <p style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 500, color: C.sub, lineHeight: 1.5 }}>
            I agree to Veriqo's{" "}
            <span onClick={(e) => { e.stopPropagation(); setTosView("tos"); }} style={{ color: C.accDeep, fontWeight: 700, cursor: "pointer" }}>Terms of Service</span>
            {" "}and{" "}
            <span onClick={(e) => { e.stopPropagation(); setTosView("privacy"); }} style={{ color: C.accDeep, fontWeight: 700, cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </button>
      </div>
      <div style={{ flexShrink: 0, marginTop: SPACE[12] }}>
        <Btn label="Continue" disabled={!email || !phone || !agreed} onClick={() => onDone({ email, phone })} />
      </div>
    </div>
  );
}

/* ---- Onboarding: verify email + phone ---- */
export function OnbVerify({ email, phone, back, onDone }) {
  const [eVerified, setEVerified] = useState(false);
  const [eSimulating, setESimulating] = useState(false);
  const [pCode, setPCode] = useState("");
  const [pSecs, setPSecs] = useState(24);
  const [eSecs, setESecs] = useState(30);
  useEffect(() => { const id = eSecs > 0 && setTimeout(() => setESecs((s) => s - 1), 1000); return () => clearTimeout(id); }, [eSecs]);
  useEffect(() => { const id = pSecs > 0 && setTimeout(() => setPSecs((s) => s - 1), 1000); return () => clearTimeout(id); }, [pSecs]);
  const simulateClick = () => { setESimulating(true); setTimeout(() => { setESimulating(false); setEVerified(true); }, 900); };
  const pDone = pCode.length === 6;
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <ProgressDots current={2} total={3} />
        <Header back={back} eyebrow="STEP 2 · VERIFY" title="Confirm your details." />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <div className="fu1" style={{ background: C.paper, border: `1.5px solid ${eVerified ? C.acc : C.line}`, borderRadius: 16, padding: SPACE[16], marginBottom: SPACE[12], transition: "border-color .4s" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SPACE[8] }}>
            <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: ".1em" }}>EMAIL</span>
            {eVerified
              ? <div style={{ display: "flex", alignItems: "center", gap: SPACE[4] }}>
                  <Ic n="checkcirc" s={15} c={C.acc} />
                  <span style={{ fontFamily: MONO, fontSize: 9.5, color: C.accDeep, fontWeight: 700, letterSpacing: ".06em" }}>VERIFIED</span>
                </div>
              : <Ic n="mail" s={16} c={eSimulating ? C.acc : C.faint} />}
          </div>
          {eVerified ? (
            <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 600, color: C.sub }}>
              <span style={{ color: C.ink }}>{email}</span> confirmed.</p>
          ) : (
            <>
              <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginBottom: SPACE[12] }}>
                We sent a verification link to <span style={{ color: C.ink, fontWeight: 700 }}>{email}</span>. Open it to continue — then come back here.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SPACE[12] }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE[6] }}>
                  <Ic n="clock" s={13} c={C.faint} />
                  {eSecs > 0
                    ? <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint, letterSpacing: ".04em" }}>RESEND IN 0:{String(eSecs).padStart(2, "0")}</span>
                    : <button onClick={() => setESecs(30)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: MONO, fontSize: 10.5, color: C.accDeep, fontWeight: 700, letterSpacing: ".04em" }}>RESEND LINK</button>}
                </div>
              </div>
              <button onClick={simulateClick} disabled={eSimulating} style={{ width: "100%", padding: SPACE[12], background: C.bone, border: `1px dashed ${C.line}`, borderRadius: 11, cursor: eSimulating ? "default" : "pointer", fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: ".06em", opacity: eSimulating ? 0.6 : 1, transition: "opacity .2s" }}>
                {eSimulating ? "VERIFYING…" : "DEMO — SIMULATE LINK CLICK"}
              </button>
            </>
          )}
        </div>
        {eVerified && (
          <div className="fu2" style={{ background: C.paper, border: `1.5px solid ${pDone ? C.acc : C.line}`, borderRadius: 16, padding: SPACE[16], marginBottom: SPACE[12], animation: "chipIn .35s cubic-bezier(.16,1,.3,1) both", transition: "border-color .3s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SPACE[6] }}>
              <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: C.faint, letterSpacing: ".1em" }}>PHONE NUMBER</span>
              {pDone && <div style={{ display: "flex", alignItems: "center", gap: SPACE[4] }}>
                <Ic n="checkcirc" s={15} c={C.acc} />
                <span style={{ fontFamily: MONO, fontSize: 9.5, color: C.accDeep, fontWeight: 700, letterSpacing: ".06em" }}>VERIFIED</span>
              </div>}
            </div>
            <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: SPACE[12] }}>
              Code sent to <span style={{ color: C.ink }}>{phone}</span></p>
            <div style={{ position: "relative", marginBottom: SPACE[8] }}>
              {!pDone && <input value={pCode} inputMode="numeric" autoFocus onChange={(e) => setPCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "text", width: "100%", height: "100%" }} />}
              <div style={{ display: "flex", gap: SPACE[8] }}>
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const on = !pDone && i === pCode.length;
                  return (
                    <div key={i} style={{ flex: 1, height: 52, borderRadius: 12, background: pDone ? C.accSoft : C.paper, border: `1.5px solid ${pDone ? C.acc : on ? C.ink : C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: NUM, fontSize: 24, color: pDone ? C.acc : C.ink, boxShadow: on ? "0 0 0 3px rgba(20,18,16,.06)" : "none", transition: "all .15s" }}>
                      {pCode[i] || (on && <div style={{ width: 2, height: 22, background: C.ink, animation: "breathe 1s ease infinite" }} />)}
                    </div>
                  );
                })}
              </div>
            </div>
            {!pDone && <div style={{ display: "flex", alignItems: "center", gap: SPACE[6] }}>
              <Ic n="clock" s={13} c={C.faint} />
              {pSecs > 0
                ? <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.faint, letterSpacing: ".04em" }}>RESEND IN 0:{String(pSecs).padStart(2, "0")}</span>
                : <button onClick={() => setPSecs(24)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: MONO, fontSize: 10.5, color: C.accDeep, fontWeight: 700, letterSpacing: ".04em" }}>RESEND CODE</button>}
            </div>}
            {!pDone && <p style={{ textAlign: "center", fontFamily: MONO, fontSize: 9.5, color: C.faint, marginTop: SPACE[8], letterSpacing: ".03em" }}>DEMO · TYPE ANY 6 DIGITS TO CONTINUE</p>}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0, marginTop: SPACE[12] }}>
        <Btn label={!eVerified ? "Waiting for email…" : !pDone ? "Enter the SMS code" : "Continue"} disabled={!eVerified || !pDone} onClick={onDone} />
      </div>
    </div>
  );
}

/* ---- Sign in (restore) ---- */
export function OnbSignIn({ back, onDone }) {
  const [raw, setRaw] = useState("");
  const fmt = (r) => {
    const cc = r.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
    return cc.match(/.{1,4}/g)?.join(" · ") || "";
  };
  const full = raw.replace(/[^A-Z0-9]/g, "").length >= 16;
  const onInput = (e) => { setRaw(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16)); };
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="RESTORE" title="Enter your recovery key" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: SPACE[24], lineHeight: 1.5 }}>
          Your recovery key was shown when you set up Veriqo. Enter it below to restore your wallet on this device.
        </p>
        <div className="fu2" style={{ marginBottom: SPACE[8] }}>
          <input value={fmt(raw)} onChange={onInput} style={{ width: "100%", padding: sp(12, 12), boxSizing: "border-box", background: C.paper, border: `1.5px solid ${full ? C.acc : C.line}`, borderRadius: 14, fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: C.ink, outline: "none", letterSpacing: ".03em", transition: "border-color .2s", textAlign: "center" }} placeholder="XXXX · XXXX · XXXX · XXXX" />
        </div>
        <Notice className="fu3" type="info" icon="key" title="16 characters total" sub="Look for it somewhere safe — it was shown once when you set up Veriqo." />
      </div>
      <div style={{ flexShrink: 0, marginTop: SPACE[12] }}>
        <Btn label={full ? "Restore wallet" : "Enter your key"} disabled={!full} onClick={onDone} />
        <p style={{ textAlign: "center", fontFamily: MONO, fontSize: 9.5, color: C.faint, marginTop: SPACE[12], letterSpacing: ".03em" }}>DEMO · TYPE ANY 16 CHARACTERS</p>
      </div>
    </div>
  );
}

/* ---- Auth (Face ID) ---- */
export function Auth({ back, onDone, email, phone }) {
  const [faceIdState, setFaceIdState] = useState("idle");
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const otpDone = otpCode.length === 6;
  const tryFaceId = () => { setFaceIdState("trying"); setTimeout(() => setFaceIdState("failed"), 800); };
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <ProgressDots current={3} total={3} />
        <Header back={back} eyebrow="ACCESS" title="Lock it with Face ID." />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", marginTop: SPACE[16] }}>
        <div className="fu2" style={{ display: "flex", justifyContent: "center", marginBottom: SPACE[16] }}>
          <div style={{ width: 90, height: 90, borderRadius: 24, background: C.ink, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(20,18,16,.25)" }}>
            <Grain o={0.07} />
            <Ic n="faceid" s={40} c={faceIdState === "failed" ? STATUS.error.color : faceIdState === "trying" ? C.acc : C.glow} />
          </div>
        </div>
        {faceIdState === "failed" && !showOTP && (
          <Notice className="fu2" type="error" icon="alert" title="Face ID not recognised" sub="Try again or use phone verification below." style={{ marginBottom: SPACE[12], animation: "chipIn .3s ease both" }} />
        )}
        <p className="fu2" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: SPACE[16], lineHeight: 1.5 }}>
          A passkey on this device secures your wallet — no password to remember, nothing for us to leak.
        </p>
        <div className="fu3" style={{ marginBottom: SPACE[12] }}>
          <Group>
            <Row ic="faceid" title="Face ID passkey" sub="Protects every credential" right={<div style={{ fontFamily: MONO, fontSize: 10, color: C.accDeep, fontWeight: 700 }}>READY</div>} />
            <Row ic="globe" title={email} sub="Recovery address" />
          </Group>
        </div>
        {showOTP && (
          <div className="fu3" style={{ marginBottom: SPACE[12], background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, padding: sp(12, 16), animation: "chipIn .25s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[6] }}>
              <Ic n="phone" s={15} c={C.ink} />
              <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink }}>Phone verification</span>
            </div>
            <p style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginBottom: SPACE[12] }}>
              We sent a 6-digit code to {phone || "your phone"}. Enter it to continue.
            </p>
            <div style={{ position: "relative", marginBottom: SPACE[8] }}>
              <input value={otpCode} inputMode="numeric" autoFocus onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} style={{ width: "100%", padding: sp(12, 16), background: C.bone, border: `1.5px solid ${otpDone ? C.acc : C.line}`, borderRadius: 12, fontFamily: "monospace", fontSize: 22, fontWeight: 700, letterSpacing: ".3em", color: C.ink, outline: "none", textAlign: "center", transition: "border-color .2s" }} placeholder="——————" />
            </div>
            <p style={{ fontFamily: MONO, fontSize: 9.5, color: C.faint, letterSpacing: ".04em", textAlign: "center" }}>DEMO · ANY 6 DIGITS</p>
          </div>
        )}
        <Notice className="fu3" type="success" icon="lock" title="Credentials are encrypted on-device" sub="Veriqo never sees your documents." />
      </div>
      <div style={{ flexShrink: 0, marginTop: SPACE[12] }}>
        {showOTP ? (
          <Btn label={otpDone ? "Continue" : "Enter the 6-digit code"} disabled={!otpDone} onClick={onDone} />
        ) : faceIdState === "failed" ? (
          <>
            <Btn label="Try Face ID again" onClick={onDone} />
            <button onClick={() => setShowOTP(true)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: sp(8, 0, 0), fontFamily: DISP, fontSize: 12.5, fontWeight: 600, color: C.sub }}>
              Still not working?{" "}<span style={{ color: C.accDeep }}>Verify with phone instead</span>
            </button>
          </>
        ) : faceIdState === "trying" ? (
          <Btn label="Recognizing…" disabled />
        ) : (
          <Btn label="Secure with Face ID" onClick={tryFaceId} />
        )}
      </div>
    </div>
  );
}

/* ---- Splash ---- */
export function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return (
    <div onClick={onDone} style={{ height: "100%", position: "relative", overflow: "hidden", cursor: "pointer", background: "radial-gradient(120% 90% at 50% 38%,#26221A,#0C0B07)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Grain o={0.14} />
      <div style={{ position: "absolute", top: "36%", left: "50%", transform: "translate(-50%,-50%)" }}>
        <div style={{ width: 300, height: 300, borderRadius: "50%", filter: "blur(60px)", background: `radial-gradient(circle,${C.acc}55,transparent 64%)`, animation: "bloom 3s ease-in-out infinite" }} />
      </div>
      <div style={{ position: "relative", width: 172, height: 172, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: SPACE[32] }}>
        <svg width="170" height="170" viewBox="0 0 170 170" style={{ position: "absolute", animation: "spinArc 22s linear infinite" }}>
          <circle cx="85" cy="85" r="83" fill="none" stroke={C.acc} strokeWidth="1.5" strokeDasharray="2 13" opacity=".5" />
        </svg>
        <div style={{ animation: "popIn .9s cubic-bezier(.16,1,.3,1) both", filter: `drop-shadow(0 0 20px ${C.acc}88)` }}>
          <svg width="98" height="98" viewBox="0 0 32 32" fill="none">{markSvg(LOGO)}</svg>
        </div>
      </div>
      <div style={{ fontFamily: DISP, fontSize: 34, fontWeight: 900, color: "#fff", letterSpacing: "-.03em", animation: "fu .8s ease both", animationDelay: ".2s" }}>VERIQO</div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,.45)", letterSpacing: ".22em", marginTop: SPACE[8], animation: "fu .8s ease both", animationDelay: ".38s" }}>DIGITAL IDENTITY WALLET</div>
      <div style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", width: 120, height: 3, borderRadius: 3, background: "rgba(255,255,255,.12)", overflow: "hidden" }}>
        <div style={{ height: "100%", background: C.glow, borderRadius: 3, animation: "barFill 2.2s ease both" }} />
      </div>
      <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,.35)", letterSpacing: ".18em" }}>UNLOCKING YOUR WALLET</div>
    </div>
  );
}
