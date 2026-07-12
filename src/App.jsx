import { useState, useEffect, useRef } from "react";
import { C, DISP } from "./styles/tokens.js";
import { S, PROOFS, DIRECTORY, credBy } from "./data/credentials.js";
import { DynamicIsland } from "./components/DynamicIsland.jsx";
import { Splash, Welcome, OnbSignIn, OnbDetails, OnbVerify, Auth, ToSScreen } from "./screens/onboarding.jsx";
import { Permission, IDSelect, IDCapture, IDReview, SelfieIntro, SelfieCapture, Processing, SuccessScreen } from "./screens/verify.jsx";
import { Wallet, Detail } from "./screens/wallet.jsx";
import { Share } from "./screens/share.jsx";
import { Pulse } from "./screens/pulse.jsx";
import { IslandShowcase, LogoStudio } from "./screens/showcase.jsx";
import { Account, AcctEditProfile } from "./screens/account/account-main.jsx";
import { AcctRecoveryKey, AcctAutoLock, AcctDevices, AcctTrustedContacts } from "./screens/account/account-security.jsx";
import { AcctSharingDefaults, AcctConnectedServices, AcctServicesConsent, AcctServicesManage, AcctDataExport } from "./screens/account/account-privacy.jsx";
import { AcctNotifications, AcctHelp, AcctDeleteAccount } from "./screens/account/account-misc.jsx";
import { EmergencyID } from "./screens/account/emergency.jsx";

const VENUES = [
  { id: "tsa", name: "TSA PreCheck", sub: "Gate B12 · DEN", ic: "scan", credKey: "dl", credLabel: "Driver License", color: "#1A4FBF" },
  { id: "wine", name: "Total Wine & More", sub: "Cherry Creek · Denver", ic: "wine", credKey: "dl", credLabel: "Age Verification", color: "#8B1A14" },
  { id: "hotel", name: "Marriott Bonvoy", sub: "Check-in · Room 412", ic: "building", credKey: "passport", credLabel: "Passport", color: "#1A2E5A" },
  { id: "disp", name: "Green Cross Rx", sub: "Medical & Recreational", ic: "badge", credKey: "ead", credLabel: "EAD Card", color: "#1A5C2E" },
];

export default function App() {
  const [view, setView] = useState("splash");
  const [vstep, setVstep] = useState(S.P);
  const [vsel, setVsel] = useState(null);
  const [cred, setCred] = useState("dl");
  const [pulseOpen, setPulseOpen] = useState(false);
  const [venueIdx, setVenueIdx] = useState(0);
  const dragRef = useRef({ active: false, startY: 0, startOpen: false });
  const startPull = (clientY, isOpen) => { dragRef.current = { active: true, startY: clientY, startOpen: isOpen }; };
  const onPullMove = (e) => {
    if (!dragRef.current.active) return;
    const dy = e.clientY - dragRef.current.startY;
    if (!dragRef.current.startOpen && dy > 55) { setPulseOpen(true); dragRef.current.active = false; }
    else if (dragRef.current.startOpen && dy < -55) { setPulseOpen(false); dragRef.current.active = false; }
  };
  const onPullEnd = () => { dragRef.current.active = false; };
  const [island, setIsland] = useState({ mode: "idle" });
  const [profile, setProfile] = useState({ name: "Alex Morgan", email: "alex.morgan@email.com", phone: "(917) 555-0142", dob: "1994-08-14" });
  const [claim, setClaim] = useState(null);
  const [services, setServices] = useState([
    { key: "coinbase", name: "Coinbase", ic: "chart", status: "active", since: "Mar 2026", last: "Today", scope: { Name: true, Photo: false, "Age over 21": true, "Date of birth": false, "Document number": false, Address: false } },
    { key: "tsa", name: "TSA PreCheck", ic: "face", status: "active", since: "Jan 2026", last: "3 days ago", scope: { Name: true, Photo: true, "Age over 21": false, "Date of birth": true, "Document number": true, Address: false } },
    { key: "globalentry", name: "Global Entry · SFO", ic: "book", status: "active", since: "Feb 2026", last: "Yesterday", scope: { Name: true, Photo: true, "Age over 21": false, "Date of birth": true, "Document number": true, Address: false } },
    { key: "totalwine", name: "Total Wine", ic: "wine", status: "active", since: "May 2026", last: "Last week", scope: { Name: false, Photo: false, "Age over 21": true, "Date of birth": false, "Document number": false, Address: false } },
    { key: "crownpub", name: "The Crown Pub", ic: "wine", status: "active", since: "Jun 2026", last: "Today", scope: { Name: false, Photo: false, "Age over 21": true, "Date of birth": false, "Document number": false, Address: false } },
  ]);
  const [connecting, setConnecting] = useState(null);
  const [consentBack, setConsentBack] = useState("acctServices");
  const [manageKey, setManageKey] = useState(null);
  const [incomingReq, setIncomingReq] = useState(null);
  const [pending, setPending] = useState(() => [{ ...DIRECTORY.find((d) => d.key === "equinox"), expiresAt: Date.now() + 60000 }]);
  const [emergencyData, setEmergencyData] = useState(null);
  const [verifyIntent, setVerifyIntent] = useState("add");
  const [cameraGranted, setCameraGranted] = useState(true);
  const [ownedDocs, setOwnedDocs] = useState(["dl", "passport", "ead"]);
  const [walletAdded, setWalletAdded] = useState(new Set());
  const [sharingDefaults, setSharingDefaults] = useState({ Name: true, Photo: true, "Age over 21": true, "Date of birth": false, "Document number": false, Address: false });
  const [docScopeOverrides, setDocScopeOverrides] = useState({});
  const C0 = credBy(cred);

  useEffect(() => {
    if (island.mode === "added") { const t = setTimeout(() => setIsland({ mode: "idle" }), 2600); return () => clearTimeout(t); }
    if (island.mode === "verify") { const t = setTimeout(() => setIsland({ mode: "idle" }), 4200); return () => clearTimeout(t); }
    if (island.mode === "request") {
      const t = setTimeout(() => {
        setIsland({ mode: "idle" });
        if (incomingReq) addPending(incomingReq);
        setIncomingReq(null);
      }, 8000);
      return () => clearTimeout(t);
    }
  }, [island.mode]);
  useEffect(() => {
    if (island.mode !== "share") return;
    if (island.t <= 0) { const t = setTimeout(() => setIsland({ mode: "idle" }), 400); return () => clearTimeout(t); }
    const id = setTimeout(() => setIsland((s) => ({ ...s, t: s.t - 1 })), 1000);
    return () => clearTimeout(id);
  }, [island.mode, island.t]);

  const camDark = view === "verify" && (vstep === S.IC || vstep === S.SC);
  const full = camDark || view === "splash";
  const goWallet = () => setView("wallet");
  const openDetail = (k) => { setCred(k); setView("detail"); };

  const startReconnect = (s) => {
    setConnecting({ key: s.key, name: s.name, ic: s.ic, scope: s.scope });
    setConsentBack("acctServices");
    setView("acctServicesConsent");
  };
  const fireIncomingRequest = () => {
    const avail = DIRECTORY.filter((d) => !pending.some((p) => p.key === d.key));
    if (!avail.length) return;
    const svc = avail[Math.floor(Math.random() * avail.length)];
    setIncomingReq(svc);
    setIsland({ mode: "request", name: svc.name, ic: svc.ic });
  };
  const openIncomingRequest = () => {
    if (island.credKey && !incomingReq) { setCred(island.credKey); setView("detail"); setIsland({ mode: "idle" }); return; }
    if (!incomingReq) return;
    const reqExpiry = Date.now() + 60000;
    setConnecting({ key: incomingReq.key, name: incomingReq.name, ic: incomingReq.ic, scope: incomingReq.defaultScope, incoming: true, expiresAt: reqExpiry });
    setConsentBack("acctServices");
    setIncomingReq(null);
    setIsland({ mode: "idle" });
    setView("acctServicesConsent");
  };
  const openPendingRequest = (p) => {
    setConnecting({ key: p.key, name: p.name, ic: p.ic, scope: p.defaultScope, incoming: true, expiresAt: p.expiresAt });
    setConsentBack("acctServices");
    setView("acctServicesConsent");
  };
  const addPending = (p) => {
    const expiresAt = p.expiresAt || Date.now() + 60000;
    const remaining = Math.max(0, expiresAt - Date.now());
    if (remaining <= 0) return;
    setPending((list) => (list.some((x) => x.key === p.key) ? list : [...list, { ...p, expiresAt }]));
  };
  const dismissPending = (key) => setPending((list) => list.filter((p) => p.key !== key));
  const approveConnect = (scope) => {
    setServices((list) => {
      const exists = list.some((s) => s.key === connecting.key);
      return exists
        ? list.map((s) => (s.key === connecting.key ? { ...s, status: "active", scope, last: "Just now" } : s))
        : [...list, { key: connecting.key, name: connecting.name, ic: connecting.ic, status: "active", since: "Jun 2026", last: "Just now", scope }];
    });
    setPending((list) => list.filter((p) => p.key !== connecting.key));
    setConnecting(null);
    setView("acctServices");
  };
  const denyConnect = () => {
    setPending((list) => list.filter((p) => p.key !== connecting.key));
    setConnecting(null);
    setView(consentBack);
  };
  const openManage = (k) => { setManageKey(k); setView("acctServicesManage"); };
  const saveScope = (scope) => {
    setServices((list) => list.map((s) => (s.key === manageKey ? { ...s, scope } : s)));
    setManageKey(null);
    setView("acctServices");
  };
  const revokeService = () => {
    setServices((list) => list.map((s) => (s.key === manageKey ? { ...s, status: "revoked" } : s)));
    setManageKey(null);
    setView("acctServices");
  };

  const SURF = [
    ["splash", "Splash"], ["welcome", "Onboard"], ["verify", "Verify"], ["wallet", "Wallet"],
    ["detail", "Detail"], ["share", "Share"], ["account", "Account"], ["island", "Island"], ["logo", "Logo"],
  ];
  const jump = (k) => {
    if (k === "verify") { setView("verify"); setVstep(S.P); setVsel(null); }
    else if (k === "wallet") { goWallet(); }
    else if (k === "venue") {
      const idx = venueIdx % VENUES.length;
      setVenueIdx(idx + 1);
      const vd = [{ name: "TSA PreCheck", ic: "scan", ck: "dl" }, { name: "Total Wine & More", ic: "wine", ck: "dl" }, { name: "Marriott Bonvoy", ic: "building", ck: "passport" }, { name: "Green Cross Rx", ic: "badge", ck: "ead" }];
      const v2 = vd[venueIdx % 4];
      setIsland({ mode: "request", name: v2.name, ic: v2.ic, credKey: v2.ck });
    }
    else setView(k);
  };

  return (
    <div className="vq-stage" style={{ minHeight: "100vh", background: C.bone, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", fontFamily: DISP }}>
      <div className="vq-chrome" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.acc }} />
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: ".18em" }}>VERIQO · IDENTITY WALLET</span>
      </div>

      <div className="vq-frame" style={{ width: 360, height: 722, background: C.bone, borderRadius: 52, overflow: "hidden", position: "relative", flexShrink: 0, border: "11px solid #141210", boxShadow: "0 50px 110px rgba(20,18,16,.32), 0 0 0 1px rgba(20,18,16,.12)" }}>

        <DynamicIsland island={island}
          onDismiss={() => {
            setIsland({ mode: "idle" });
            if (island.mode === "request" && incomingReq) { addPending(incomingReq); setIncomingReq(null); }
          }}
          onOpenRequest={openIncomingRequest} />

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 200, padding: "11px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", pointerEvents: "none" }}>
          <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: full ? "rgba(255,255,255,.92)" : C.ink }}>9:41</span>
          <span style={{ width: 40 }} />
          <svg width="17" height="12" viewBox="0 0 17 12" fill={full ? "rgba(255,255,255,.92)" : C.ink}>
            <rect x=".5" y=".5" width="13" height="11" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none" />
            <rect x="2" y="2" width="9" height="8" rx="1.5" fill="currentColor" />
            <path d="M15 4v4a2 2 0 000-4z" fill="currentColor" />
          </svg>
        </div>

        <div style={{ position: "absolute", top: full ? 0 : 42, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 20, transform: pulseOpen ? "translateY(0)" : "translateY(-100%)", transition: "transform .45s cubic-bezier(.32,0,.15,1)", background: C.bone, display: "flex", flexDirection: "column", pointerEvents: pulseOpen ? "auto" : "none" }}>
            <Pulse onViewCred={(k) => { setCred(k); setPulseOpen(false); setView("detail"); }} onClose={() => setPulseOpen(false)} />
          </div>

          <div style={{ position: "absolute", inset: 0, overflow: "hidden", transform: pulseOpen ? "scale(0.93) translateY(5%)" : "scale(1) translateY(0)", transformOrigin: "center top", borderRadius: pulseOpen ? 20 : 0, transition: "transform .45s cubic-bezier(.32,0,.15,1)" }}
            onPointerMove={onPullMove} onPointerUp={onPullEnd} onPointerLeave={onPullEnd}>
            {view === "splash" && <Splash onDone={() => { setView("wallet"); }} />}
            {view === "signin" && <OnbSignIn back={() => setView("welcome")} onDone={() => { setView("wallet"); }} />}
            {view === "tos" && <ToSScreen back={() => setView("welcome")} which="tos" />}
            {view === "privacy" && <ToSScreen back={() => setView("welcome")} which="privacy" />}
            {view === "logo" && <LogoStudio />}
            {view === "welcome" && <Welcome go={() => setView("details")} onSignIn={() => setView("signin")} />}
            {view === "details" && <OnbDetails back={() => setView("welcome")} onDone={(p) => { setProfile((pr) => ({ ...pr, ...p })); setView("codes"); }} />}
            {view === "codes" && <OnbVerify email={profile.email} phone={profile.phone} back={() => setView("details")} onDone={() => setView("auth")} />}
            {view === "auth" && <Auth email={profile.email} phone={profile.phone} back={() => setView("codes")} onDone={() => { setVerifyIntent("onboard"); setView("verify"); setVstep(S.P); setVsel(null); }} />}

            {view === "verify" && <>
              {vstep === S.P && <Permission go={(s) => { setCameraGranted(true); setVstep(vsel && s === S.IS ? S.IC : s); }} back={() => setView("auth")} />}
              {vstep === S.IS && <IDSelect go={setVstep} back={() => setVstep(S.P)} sel={vsel} setSel={setVsel}
                owned={verifyIntent === "add" ? ownedDocs : []}
                onViewExisting={(k) => { setCred(k); setView("detail"); }} />}
              {vstep === S.IC && <IDCapture go={setVstep} />}
              {vstep === S.IR && <IDReview go={setVstep} retake={() => setVstep(S.IC)} vsel={vsel} />}
              {vstep === S.SI && <SelfieIntro go={setVstep} back={() => setVstep(S.IR)} />}
              {vstep === S.SC && <SelfieCapture go={setVstep} />}
              {vstep === S.PR && <Processing go={setVstep} />}
              {vstep === S.SU && <SuccessScreen unlocked={verifyIntent !== "reverify" && vsel ? ((p) => (p.some((x) => x.k === "age21") ? p.filter((x) => x.k !== "age18") : p))(PROOFS.filter((p) => p.credKey === vsel)) : []} restart={() => {
                setIsland({ mode: "idle" });
                setProfile((pr) => ({ ...pr, name: "Alex Morgan", dob: "1994-08-14" }));
                if (verifyIntent === "reverify") { setVerifyIntent("add"); setView("acctProfile"); }
                else {
                  const k = vsel || "vera";
                  setOwnedDocs((od) => (od.includes(k) ? od : [...od, k]));
                  setCred(k); setView("detail");
                }
              }} />}
            </>}

            {view === "wallet" && <Wallet name={profile.name} openDetail={openDetail} ownedDocs={ownedDocs} setOwnedDocs={setOwnedDocs} onAccount={() => setView("account")} onOpenPulse={() => setPulseOpen(true)} onPullStart={startPull} onProof={(p) => { setClaim(p.full); setCred("vera"); setView("share"); }} addNew={() => { setVerifyIntent("add"); setView("verify"); setVstep(cameraGranted ? S.IS : S.P); setVsel(null); }} />}
            {view === "account" && <Account profile={profile} services={services} pending={pending} emergencyData={emergencyData} onSignOut={() => setView("welcome")} go={setView} back={() => goWallet()} />}
            {view === "acctProfile" && <AcctEditProfile back={() => setView("account")} profile={profile}
              onSave={(p) => { setProfile(p); setView("account"); }}
              onReverify={() => { setVerifyIntent("reverify"); setView("verify"); setVstep(cameraGranted ? S.IS : S.P); setVsel(null); }} />}
            {view === "acctRecovery" && <AcctRecoveryKey back={() => setView("account")} />}
            {view === "acctAutolock" && <AcctAutoLock back={() => setView("account")} />}
            {view === "acctSharing" && <AcctSharingDefaults back={() => setView("account")} defaults={sharingDefaults} onSave={setSharingDefaults} />}
            {view === "acctServices" && <AcctConnectedServices back={() => setView("account")}
              services={services} pending={pending}
              onManage={openManage} onReconnect={startReconnect}
              onReviewPending={openPendingRequest} onDismissPending={dismissPending} />}
            {view === "acctServicesConsent" && connecting && <AcctServicesConsent
              back={() => {
                if (connecting.incoming && connecting.expiresAt > Date.now()) {
                  addPending({ key: connecting.key, name: connecting.name, ic: connecting.ic, defaultScope: connecting.scope, expiresAt: connecting.expiresAt });
                }
                setConnecting(null); setView(consentBack);
              }} connecting={connecting}
              eyebrow={connecting.incoming ? "INCOMING REQUEST" : "CONNECTION REQUEST"}
              onApprove={approveConnect} onDeny={denyConnect} />}
            {view === "acctServicesManage" && manageKey && <AcctServicesManage
              back={() => { setManageKey(null); setView("acctServices"); }}
              service={services.find((s) => s.key === manageKey)}
              onSave={saveScope} onRevoke={revokeService} />}
            {view === "acctNotif" && <AcctNotifications back={() => setView("account")} />}
            {view === "acctHelp" && <AcctHelp back={() => setView("account")} />}
            {view === "acctExport" && <AcctDataExport back={() => setView("account")} />}
            {view === "emergencyId" && <EmergencyID back={() => setView("account")} data={emergencyData} onSave={(d) => { setEmergencyData(d); }} />}
            {view === "acctDevices" && <AcctDevices back={() => setView("account")} />}
            {view === "acctTrusted" && <AcctTrustedContacts back={() => setView("account")} />}
            {view === "acctDelete" && <AcctDeleteAccount back={() => setView("account")} onDelete={() => setView("welcome")} />}
            {view === "detail" && <Detail c={C0} back={() => goWallet()}
              walletAdded={walletAdded.has(C0?.key)}
              onWalletAdd={() => setWalletAdded((s) => new Set([...s, C0?.key]))}
              onShare={() => { setClaim(null); setView("share"); }}
              onUpdate={(credKey) => { setVerifyIntent("add"); setVsel(credKey); setView("verify"); setVstep(cameraGranted ? S.IC : S.P); }} />}
            {view === "share" && <Share c={C0} claim={claim} back={() => { setClaim(null); setView(claim ? "wallet" : "detail"); }} defaults={sharingDefaults} docOverride={docScopeOverrides[C0?.key]} onSaveOverride={(key, a) => setDocScopeOverrides((s) => ({ ...s, [key]: a }))} profile={profile} />}
            {view === "island" && <IslandShowcase fire={(k) => {
              if (k === "share") setIsland({ mode: "share", t: 30, sub: "TSA PreCheck" });
              else if (k === "added") setIsland({ mode: "added" });
              else if (k === "request") fireIncomingRequest();
              else if (k === "venue") { const vd = [{ name: "TSA PreCheck", ic: "scan", ck: "dl" }, { name: "Total Wine & More", ic: "wine", ck: "dl" }, { name: "Marriott Bonvoy", ic: "building", ck: "passport" }, { name: "Green Cross Rx", ic: "badge", ck: "ead" }]; const v = vd[venueIdx % 4]; setVenueIdx(venueIdx + 1); setIsland({ mode: "request", name: v.name, ic: v.ic, credKey: v.ck }); }
            }} />}
          </div>
        </div>
      </div>

      <div className="vq-chrome" style={{ marginTop: 20, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: 420 }}>
        {SURF.map(([k, l]) => {
          const on = view === k;
          const isVenue = k === "venue";
          return (
            <button key={k} onClick={() => {
              if (isVenue) {
                const idx = venueIdx % VENUES.length;
                const v = VENUES[idx];
                setVenueIdx(idx + 1);
                setIsland({ mode: "venue", name: v.name, sub: v.sub, ic: v.ic, credKey: v.credKey, credLabel: v.credLabel, color: v.color });
              } else { jump(k); }
            }} style={{ padding: "6px 12px", background: isVenue ? "#1A4FBF" : on ? C.ink : C.paper, border: `1px solid ${isVenue ? "#1A4FBF" : on ? C.ink : C.line}`, borderRadius: 9, cursor: "pointer", fontFamily: DISP, fontSize: 11, fontWeight: 600, color: isVenue || on ? "#fff" : C.sub, transition: "all .15s" }}>{l}</button>
          );
        })}
      </div>
      <p className="vq-chrome" style={{ marginTop: 6, fontFamily: "'Space Mono',monospace", fontSize: 9, color: "#1A4FBF", textAlign: "center" }}>island.mode = {island.mode}</p>
      <p className="vq-chrome" style={{ marginTop: 4, fontFamily: "'Space Mono',monospace", fontSize: 10, color: C.faint, textAlign: "center", letterSpacing: ".04em" }}>ONBOARD → VERIFY → WALLET · OR JUMP TO ANY SURFACE</p>
    </div>
  );
}
