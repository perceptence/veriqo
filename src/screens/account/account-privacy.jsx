import { useState, useEffect } from "react";
import { C, DISP, MONO, SPACE, sp, STATUS } from "../../styles/tokens.js";
import { Ic } from "../../components/Icon.jsx";
import { Header, Btn, Row, Group, Toggle, Notice } from "../../components/primitives.jsx";

/* Icon lookup shared across privacy screens */
const attrIcon = (k) =>
  k === "Age over 18" ? "cake" : k === "Age over 21" ? "wine" : k === "Photo" ? "camera"
  : k === "Date of birth" ? "calendar" : k === "Document number" ? "hash" : k === "Address" ? "mappin" : "user";

export function AcctSharingDefaults({ back, defaults = {}, onSave }) {
  const [attrs, setAttrs] = useState(defaults);
  /* NOTE: `updateAttr` was referenced but never defined in the original source — added here. */
  const updateAttr = (k) => setAttrs((a) => ({ ...a, [k]: !a[k] }));
  const dirty = JSON.stringify(attrs) !== JSON.stringify(defaults);
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="PRIVACY" title="Sharing defaults" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: SPACE[16], lineHeight: 1.5 }}>
          These attributes are pre-selected whenever you present a proof. You can still adjust them for any individual share.
        </p>
        <div className="fu2"><Group>
          {Object.keys(attrs).map((k) => (
            <Row key={k} ic={attrIcon(k)} title={k} right={<Toggle on={attrs[k]} onClick={() => updateAttr(k)} />} />
          ))}
        </Group></div>
        <Notice className="fu3" type="success" icon="lock" title="Defaults only" sub="Every share still asks you to confirm before anything is sent." style={{ marginTop: SPACE[12] }} />
      </div>
      {dirty && <div style={{ flexShrink: 0, marginTop: SPACE[12] }}>
        <Btn label="Save defaults" onClick={() => { onSave?.(attrs); back(); }} />
      </div>}
    </div>
  );
}

export function PendingRow({ p, onReview, onDismiss }) {
  const [secs, setSecs] = useState(() => Math.max(0, Math.round((p.expiresAt - Date.now()) / 1000)));
  useEffect(() => {
    if (secs <= 0) return;
    const id = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secs]);
  const expired = secs === 0;
  const urgent = !expired && secs < 30;
  const col = expired ? STATUS.error.text : urgent ? STATUS.warning.text : C.accDeep;
  return (
    <Row ic={p.ic} title={p.name}
      sub={<span style={{ color: col, fontWeight: 600 }}>{expired ? "Request expired" : `Expires in ${secs}s`}</span>}
      onClick={onReview}
      right={<button onClick={(e) => { e.stopPropagation(); onDismiss(); }} style={{ background: "none", border: "none", cursor: "pointer", padding: sp(4, 2), fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: C.faint }}>Dismiss</button>} />
  );
}

export function AcctConnectedServices({ back, services, pending, onManage, onReconnect, onReviewPending, onDismissPending }) {
  const active = services.filter((s) => s.status === "active");
  const revoked = services.filter((s) => s.status === "revoked");
  const scopeCount = (s) => Object.values(s.scope).filter(Boolean).length;
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="PRIVACY" title="Connected services" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: SPACE[16], lineHeight: 1.5 }}>
          Apps and places that have asked to verify you. New connections show up here when they reach out — manage what each can see, or revoke access anytime.
        </p>
        {pending && pending.length > 0 && (<>
          <p className="fu1" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(0, 0, 8, 2) }}>PENDING · {pending.length}</p>
          <div className="fu1" style={{ marginBottom: SPACE[16], background: C.paper, borderRadius: 16, border: `1px solid ${C.line}`, overflow: "hidden" }}>
            {pending.map((p, i) => (
              <div key={p.key} style={{ borderTop: i ? `1px solid ${C.line}` : "none" }}>
                <PendingRow p={p} onReview={() => onReviewPending(p)} onDismiss={() => onDismissPending(p.key)} />
              </div>
            ))}
          </div>
        </>)}
        <p className="fu2" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(0, 0, 8, 2) }}>ACTIVE · {active.length}</p>
        {active.length ? (
          <div className="fu2"><Group>
            {active.map((s) => (
              <Row key={s.key} ic={s.ic} title={s.name} sub={`Sharing ${scopeCount(s)} details · Last used ${s.last}`} onClick={() => onManage(s.key)} />
            ))}
          </Group></div>
        ) : (
          <div className="fu2" style={{ textAlign: "center", padding: sp(20, 0) }}>
            <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 600, color: C.faint }}>No active connections</p>
          </div>
        )}
        {revoked.length > 0 && (<>
          <p className="fu3" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(16, 0, 8, 2) }}>PREVIOUSLY CONNECTED</p>
          <div className="fu3"><Group>
            {revoked.map((s) => (
              <Row key={s.key} ic={s.ic} title={s.name} sub="Access revoked"
                right={<button onClick={() => onReconnect(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: sp(4, 2), fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: C.accDeep }}>Reconnect</button>} />
            ))}
          </Group></div>
        </>)}
      </div>
    </div>
  );
}

export function AcctServicesConsent({ back, connecting, onApprove, onDeny, eyebrow = "CONNECTION REQUEST" }) {
  const [scope, setScope] = useState(connecting.scope);
  const [secs, setSecs] = useState(() => (connecting.expiresAt ? Math.max(0, Math.round((connecting.expiresAt - Date.now()) / 1000)) : null));
  useEffect(() => {
    if (secs === null) return;
    if (secs <= 0) return;
    const id = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secs]);
  const count = Object.values(scope).filter(Boolean).length;
  const urgent = secs !== null && secs > 0 && secs < 30;
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow={eyebrow} title={connecting.name} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        {secs !== null && (
          secs === 0 ? (
            <Notice className="fu1" type="error" icon="alert" title="Request expired" sub={`This request is no longer valid. Ask ${connecting.name} to send a new verification request.`} style={{ marginBottom: SPACE[12] }} />
          ) : (
            <Notice className="fu1" type={urgent ? "warning" : "success"} icon="clock" title={`Expires in ${secs}s`} style={{ marginBottom: SPACE[12], transition: "background .4s,border-color .4s" }} />
          )
        )}
        <div className="fu1" style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: SPACE[16] }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.bone, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n={connecting.ic} s={17} c={C.ink} />
          </div>
          <p style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingLeft: SPACE[12] }}>
            <span style={{ color: C.ink, fontWeight: 700 }}>{connecting.name}</span> wants to verify your identity.</p>
        </div>
        <p className="fu2" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(0, 0, 8, 2) }}>REQUESTING ACCESS TO</p>
        <div className="fu2"><Group>
          {Object.keys(scope).map((k) => (
            <Row key={k} ic={attrIcon(k)} title={k} right={<Toggle on={scope[k]} onClick={() => setScope((a) => ({ ...a, [k]: !a[k] }))} />} />
          ))}
        </Group></div>
        <Notice className="fu3" type="success" icon="lock" title="You're in control" sub="Change what's shared or revoke access anytime from Connected services." style={{ marginTop: SPACE[12] }} />
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: SPACE[8], marginTop: SPACE[12] }}>
        {secs === 0 ? (
          <Btn label="Dismiss" onClick={onDeny} />
        ) : (<>
          <Btn label="Deny" ghost onClick={onDeny} />
          <Btn label={count ? "Approve" : "Select at least one detail"} disabled={!count || secs === 0} onClick={() => onApprove(scope)} />
        </>)}
      </div>
    </div>
  );
}

export function AcctServicesManage({ back, service, onSave, onRevoke }) {
  const [scope, setScope] = useState(service.scope);
  const count = Object.values(scope).filter(Boolean).length;
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="CONNECTED SERVICE" title={service.name} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <div className="fu1" style={{ display: "flex", gap: SPACE[8], marginBottom: SPACE[16] }}>
          <div style={{ flex: 1, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 13, padding: sp(12, 12) }}>
            <div style={{ fontFamily: MONO, fontSize: 8.5, color: C.faint, fontWeight: 700, letterSpacing: ".08em" }}>CONNECTED SINCE</div>
            <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink, marginTop: SPACE[3] }}>{service.since}</div>
          </div>
          <div style={{ flex: 1, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 13, padding: sp(12, 12) }}>
            <div style={{ fontFamily: MONO, fontSize: 8.5, color: C.faint, fontWeight: 700, letterSpacing: ".08em" }}>LAST USED</div>
            <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink, marginTop: SPACE[3] }}>{service.last}</div>
          </div>
        </div>
        <p className="fu2" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(0, 0, 8, 2) }}>SHARING</p>
        <div className="fu2"><Group>
          {Object.keys(scope).map((k) => (
            <Row key={k} ic={attrIcon(k)} title={k} right={<Toggle on={scope[k]} onClick={() => setScope((a) => ({ ...a, [k]: !a[k] }))} />} />
          ))}
        </Group></div>
        <div className="fu3" style={{ marginTop: SPACE[16] }}><Group>
          <Row ic="x" title="Revoke access" danger onClick={onRevoke} />
        </Group></div>
      </div>
      <div style={{ flexShrink: 0, marginTop: SPACE[12] }}>
        <Btn label="Save changes" disabled={!count} onClick={() => onSave(scope)} />
      </div>
    </div>
  );
}

export function AcctDataExport({ back }) {
  const [done, setDone] = useState(false);
  const items = [
    { ic: "card", label: "Credentials", detail: "All stored IDs and their metadata" },
    { ic: "share", label: "Activity log", detail: "Full history of shares and verifications" },
    { ic: "sliders", label: "Sharing defaults", detail: "Your default attribute preferences" },
    { ic: "plug", label: "Connected services", detail: "Apps you have granted access to" },
    { ic: "key", label: "Account settings", detail: "Profile, security, and notification prefs" },
  ];
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="PRIVACY" title="Download my data" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        {done ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: SPACE[32], gap: SPACE[12] }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.accSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n="checkcirc" s={32} c={C.acc} />
            </div>
            <div style={{ fontFamily: DISP, fontSize: 16, fontWeight: 700, color: C.ink }}>Export ready</div>
            <p style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, textAlign: "center", lineHeight: 1.5, maxWidth: "80%" }}>
              Your data has been packaged as <span style={{ fontFamily: "monospace", color: C.ink }}>veriqo-export.json</span> and sent to your recovery email address.
            </p>
            <div style={{ padding: sp(8, 12), background: C.bone, borderRadius: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.faint, letterSpacing: ".06em" }}>DEMO · NO FILE ACTUALLY SENT</span>
            </div>
          </div>
        ) : (
          <>
            <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: SPACE[16], lineHeight: 1.5 }}>
              Your export will include everything stored on this device. It will be sent encrypted to your recovery email.
            </p>
            <p className="fu2" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(0, 0, 8, 2) }}>INCLUDED IN EXPORT</p>
            <div className="fu2" style={{ marginBottom: SPACE[16] }}><Group>
              {items.map((it) => (<Row key={it.ic} ic={it.ic} title={it.label} sub={it.detail} />))}
            </Group></div>
            <Notice type="info" icon="lock" title="Encrypted with your recovery key" sub="You will need it to read the contents." />
          </>
        )}
      </div>
      {!done && <div style={{ flexShrink: 0, marginTop: SPACE[12] }}>
        <Btn label="Export my data" onClick={() => setDone(true)} />
      </div>}
    </div>
  );
}
