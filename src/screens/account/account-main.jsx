import { useState } from "react";
import { C, DISP, MONO, SPACE, sp, LAYOUT } from "../../styles/tokens.js";
import { USER } from "../../data/credentials.js";
import { Ic } from "../../components/Icon.jsx";
import { BadgedAvatar } from "../../components/Avatar.jsx";
import { Header, Btn, Row, Group, Toggle, Notice } from "../../components/primitives.jsx";

export function Account({ onSignOut, profile, go, services, pending, back, emergencyData }) {
  const [faceId, setFaceId] = useState(true);
  const [confirmOff, setConfirmOff] = useState(false);
  const [walletSync, setWalletSync] = useState(true);
  const dim = { opacity: confirmOff ? 0.35 : 1, pointerEvents: confirmOff ? "none" : "auto", transition: "opacity .25s" };
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 0) }}>
      <div className="fu" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SPACE[4] }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.sub, fontWeight: 700, letterSpacing: ".1em" }}>ACCOUNT</div>
        {back && <button onClick={back} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: SPACE[4], padding: sp(4, 0) }}>
          <Ic n="x" s={18} c={C.faint} />
        </button>}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingBottom: LAYOUT.scrollGutter }}>
        <button onClick={() => go("acctProfile")} className="fu1" style={{ ...dim, display: "flex", alignItems: "center", gap: SPACE[12], marginBottom: SPACE[16], marginTop: SPACE[8], width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
          <div style={{ alignSelf: "flex-start", paddingTop: SPACE[4] }}>
            <BadgedAvatar size={54} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: DISP, fontSize: 20, fontWeight: 900, color: C.ink, letterSpacing: "-.02em" }}>{(profile && profile.name) || USER.name}</div>
            <div style={{ fontFamily: DISP, fontSize: 12, color: C.ink, fontWeight: 500, marginTop: SPACE[3] }}>Member since Jun 2026</div>
          </div>
          <Ic n="chev" s={16} c={C.faint} />
        </button>

        <p className="fu2" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(4, 0, 8, 2) }}>ACCESS</p>
        <div className="fu2"><Group>
          <div style={{ padding: sp(12, 16) }}>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE[12] }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: C.bone, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n="faceid" s={17} c={C.ink} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: DISP, fontSize: 14.5, fontWeight: 700, color: C.ink, letterSpacing: "-.01em" }}>Face ID & passkey</div>
                <div style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.faint, marginTop: SPACE[1] }}>{faceId ? "Locked" : "Off — passcode only"}</div>
              </div>
              <Toggle on={faceId} onClick={() => (faceId ? setConfirmOff(true) : setFaceId(true))} />
            </div>
            {confirmOff && (
              <div style={{ marginTop: SPACE[12], paddingTop: SPACE[12], borderTop: `1px solid ${C.line}`, animation: "chipIn .25s ease both" }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[6] }}>
                  <Ic n="alert" s={15} c="#D9583F" />
                  <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink }}>Turn off Face ID?</span>
                </div>
                <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginBottom: SPACE[12] }}>
                  Your wallet will only be protected by your device passcode. Anyone who can unlock your phone could open Veriqo and present your credentials.
                </p>
                <div style={{ display: "flex", gap: SPACE[8] }}>
                  <button onClick={() => setConfirmOff(false)} style={{ flex: 1, padding: SPACE[12], background: "transparent", border: `1.5px solid ${C.line}`, borderRadius: 11, cursor: "pointer", fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Keep Face ID</button>
                  <button onClick={() => { setFaceId(false); setConfirmOff(false); }} style={{ flex: 1, padding: SPACE[12], background: "#D9583F", border: "none", borderRadius: 11, cursor: "pointer", fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: "#fff" }}>Turn off</button>
                </div>
              </div>
            )}
          </div>
          <div style={dim}><Row ic="key" title="Recovery key" sub="Backed up to iCloud Keychain" onClick={() => go("acctRecovery")} /></div>
          <div style={dim}><Row ic="locktime" title="Auto-lock" sub="Immediately" onClick={() => go("acctAutolock")} /></div>
          <div style={dim}><Row ic="devices" title="Device management" sub="2 devices with Veriqo installed" onClick={() => go("acctDevices")} /></div>
        </Group></div>

        <div style={dim}>
          <p className="fu3" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(16, 0, 8, 2) }}>EMERGENCY</p>
          <div className="fu3"><Group>
            <Row ic="alert" title="Emergency ID" sub={emergencyData ? "Medical info · lock screen accessible" : "Not set up"}
              right={!emergencyData ? <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: "#C07B00", background: "#FEF4E6", padding: sp(3, 6), borderRadius: 6, letterSpacing: ".05em" }}>SET UP</span> : undefined}
              onClick={() => go("emergencyId")} />
            <Row ic="contacts" title="Trusted contacts" sub="People who can vouch for you" onClick={() => go("acctTrusted")} />
          </Group></div>

          <p className="fu3" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(16, 0, 8, 2) }}>PRIVACY</p>
          <div className="fu3"><Group>
            <Row ic="sliders" title="Sharing defaults" sub="3 of 6 details preselected" onClick={() => go("acctSharing")} />
            <Row ic="plug" title="Connected services"
              sub={(() => {
                const act = services.filter((s) => s.status === "active").length;
                if (!pending?.length) return `${act} active`;
                const minSecs = Math.min(...pending.map((p) => Math.round((p.expiresAt - Date.now()) / 1000)));
                const allExpired = minSecs <= 0;
                const urgent = !allExpired && minSecs < 30;
                const col = allExpired ? "#D93025" : urgent ? "#C07B00" : C.accDeep;
                return (
                  <span>{act} active{" · "}<span style={{ color: col, fontWeight: 600 }}>{pending.length} {allExpired ? "expired" : "pending"}</span></span>
                );
              })()}
              onClick={() => go("acctServices")} />
            <Row ic="file" title="Download my data" onClick={() => go("acctExport")} />
          </Group></div>

          <p className="fu4" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(16, 0, 8, 2) }}>PREFERENCES</p>
          <div className="fu4"><Group>
            <Row ic="bell" title="Notifications" onClick={() => go("acctNotif")} />
            <Row ic="applewallet" title="Apple Wallet sync" right={<Toggle on={walletSync} onClick={() => setWalletSync((w) => !w)} />} />
          </Group></div>

          <p className="fu4" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(16, 0, 8, 2) }}>SUPPORT</p>
          <div className="fu4" style={{ marginBottom: SPACE[16] }}><Group>
            <Row ic="bulb" title="Help & support" onClick={() => go("acctHelp")} />
          </Group></div>

          <div className="fu4"><Group>
            <Row ic="logout" title="Sign out" danger onClick={onSignOut} />
            <Row ic="trash" title="Delete account" danger onClick={() => go("acctDelete")} />
          </Group></div>

          <p className="fu4" style={{ textAlign: "center", fontFamily: MONO, fontSize: 9.5, color: C.faint, letterSpacing: ".06em", margin: sp(16, 0, 6) }}>VERIQO · VERSION 2.4.0</p>
        </div>
      </div>
    </div>
  );
}

export function AcctEditProfile({ back, profile, onSave, onReverify }) {
  const [email, setEmail] = useState(profile.email);
  const [emailLocked, setEmailLocked] = useState(true);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [phone, setPhone] = useState(profile.phone);
  const [phoneLocked, setPhoneLocked] = useState(true);
  const [confirmPhone, setConfirmPhone] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const useFaceIdEmail = () => { setVerifying(true); setTimeout(() => { setVerifying(false); setConfirmEmail(false); setEmailLocked(false); }, 700); };
  const useFaceIdPhone = () => { setVerifying(true); setTimeout(() => { setVerifying(false); setConfirmPhone(false); setPhoneLocked(false); }, 700); };
  const idFields = [
    { label: "FULL NAME", value: profile.name },
    { label: "DATE OF BIRTH", value: profile.dob },
  ];
  const anyConfirm = confirmEmail || confirmPhone;
  const dim = { opacity: anyConfirm ? 0.35 : 1, pointerEvents: anyConfirm ? "none" : "auto", transition: "opacity .25s" };
  const emailDim = { opacity: confirmPhone ? 0.35 : 1, pointerEvents: confirmPhone ? "none" : "auto", transition: "opacity .25s" };
  const phoneDim = { opacity: confirmEmail ? 0.35 : 1, pointerEvents: confirmEmail ? "none" : "auto", transition: "opacity .25s" };
  const ConfirmPanel = ({ onAuth, onCancel, description }) => (
    <div style={{ marginTop: SPACE[8], background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, padding: sp(12, 16), animation: "chipIn .25s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: SPACE[8], marginBottom: SPACE[6] }}>
        <Ic n="faceid" s={15} c={C.ink} />
        <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink }}>Verify it's you</span>
      </div>
      <p style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginBottom: SPACE[12] }}>{description}</p>
      <div style={{ display: "flex", gap: SPACE[8] }}>
        <button onClick={onCancel} style={{ flex: 1, padding: SPACE[12], background: "transparent", border: `1.5px solid ${C.line}`, borderRadius: 11, cursor: "pointer", fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Cancel</button>
        <button onClick={onAuth} disabled={verifying} style={{ flex: 1, padding: SPACE[12], background: C.ink, border: "none", borderRadius: 11, cursor: verifying ? "default" : "pointer", fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: "#fff", opacity: verifying ? 0.7 : 1 }}>{verifying ? "Verifying…" : "Use Face ID"}</button>
      </div>
    </div>
  );
  const LockedField = ({ value, locked, onChange, onChangeTap, showConfirm, label }) => (
    <div className="fu2" style={{ marginBottom: SPACE[12] }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SPACE[6], paddingLeft: SPACE[2], paddingRight: SPACE[2] }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".1em" }}>{label}</div>
        {locked && !showConfirm && (
          <button onClick={onChangeTap} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: DISP, fontSize: 11.5, fontWeight: 700, color: C.accDeep }}>Change</button>
        )}
      </div>
      <div style={{ position: "relative" }}>
        <input value={value} onChange={onChange} readOnly={locked} style={{ width: "100%", padding: sp(12, 16), background: locked ? C.bone : C.paper, border: `1.5px solid ${C.line}`, borderRadius: 13, fontFamily: DISP, fontSize: 15, fontWeight: 600, color: locked ? C.sub : C.ink, outline: "none", paddingRight: locked ? 40 : 16 }} />
        {locked && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}><Ic n="lock" s={15} c={C.faint} /></div>}
      </div>
    </div>
  );
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="YOUR PROFILE" title="Edit profile" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <div className="fu1" style={{ ...dim, display: "flex", justifyContent: "center", marginBottom: SPACE[24] }}>
          <BadgedAvatar size={76} />
        </div>
        <div style={dim}>
          {idFields.map((f) => (
            <div key={f.label} className="fu2" style={{ marginBottom: SPACE[12] }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".1em", marginBottom: SPACE[6], paddingLeft: SPACE[2] }}>{f.label}</div>
              <div style={{ position: "relative" }}>
                <input value={f.value} readOnly style={{ width: "100%", padding: sp(12, 16), background: C.bone, border: `1.5px solid ${C.line}`, borderRadius: 13, fontFamily: DISP, fontSize: 15, fontWeight: 600, color: C.sub, outline: "none", paddingRight: SPACE[40] }} />
                <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}><Ic n="lock" s={15} c={C.faint} /></div>
              </div>
            </div>
          ))}
          <Notice className="fu2" type="info" icon="shield" title="From your verified ID" sub="To update these details, re-verify with a current document." style={{ marginBottom: SPACE[8] }} />
          <button onClick={onReverify} className="fu2" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: SPACE[8], width: "100%", padding: SPACE[12], background: "transparent", border: `1.5px solid ${C.line}`, borderRadius: 13, cursor: "pointer", marginBottom: SPACE[12] }}>
            <Ic n="scan" s={15} c={C.ink} />
            <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink }}>Re-verify identity</span>
          </button>
        </div>
        <div style={emailDim}>
          <LockedField label="EMAIL" value={email} locked={emailLocked} onChange={(e) => setEmail(e.target.value)} onChangeTap={() => setConfirmEmail(true)} showConfirm={confirmEmail} />
          {confirmEmail && <ConfirmPanel onAuth={useFaceIdEmail} onCancel={() => setConfirmEmail(false)} description="Your email is used for sign-in and account recovery. Confirm with Face ID before changing it." />}
        </div>
        <div style={phoneDim}>
          <LockedField label="PHONE NUMBER" value={phone} locked={phoneLocked} onChange={(e) => setPhone(e.target.value)} onChangeTap={() => setConfirmPhone(true)} showConfirm={confirmPhone} />
          {confirmPhone && <ConfirmPanel onAuth={useFaceIdPhone} onCancel={() => setConfirmPhone(false)} description="Your phone number is used for verification and security alerts. Confirm with Face ID before changing it." />}
        </div>
        <div style={dim}>
          <div className="fu3" style={{ marginTop: SPACE[4] }}>
            <Group>
              <Row ic="shield" title="Verified Identity" sub="Confirmed Jun 2026" right={<Ic n="check" s={16} c={C.acc} />} />
            </Group>
          </div>
        </div>
      </div>
      <div style={{ ...dim, flexShrink: 0, marginTop: SPACE[12] }}>
        <Btn label="Save changes" onClick={() => onSave({ name: profile.name, email, phone, dob: profile.dob })} />
      </div>
    </div>
  );
}
