import { useState } from "react";
import { C, DISP, MONO, SPACE, sp } from "../../styles/tokens.js";
import { Grain, Ic } from "../../components/Icon.jsx";
import { Header, Btn, Row, Group, Toggle } from "../../components/primitives.jsx";

export function AcctNotifications({ back }) {
  const [n, setN] = useState({ "Share confirmations": true, "Security alerts": true, "New device sign-in": true, "Product updates": false });
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="PREFERENCES" title="Notifications" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <div className="fu1"><Group>
          {Object.keys(n).map((k) => {
            const locked = k === "Security alerts";
            return (
              <Row key={k} ic={locked ? "shield" : "bell"} title={k} sub={locked ? "Always on for your safety" : undefined}
                right={locked
                  ? <span style={{ fontFamily: MONO, fontSize: 9, color: C.accDeep, fontWeight: 700, letterSpacing: ".05em", background: C.accSoft, padding: sp(4, 8), borderRadius: 8 }}>ALWAYS ON</span>
                  : <Toggle on={n[k]} onClick={() => setN((s) => ({ ...s, [k]: !s[k] }))} />} />
            );
          })}
        </Group></div>
      </div>
    </div>
  );
}

export function AcctHelp({ back }) {
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="SUPPORT" title="Help & support" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <div className="fu1"><Group>
          <Row ic="file" title="Help Center" sub="Guides and common questions" onClick={() => {}} />
          <Row ic="mail" title="Contact support" sub="Usually replies within a day" onClick={() => {}} />
          <Row ic="flag" title="Report a problem" onClick={() => {}} />
        </Group></div>
        <p className="fu2" style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", margin: sp(16, 0, 8, 2) }}>LEGAL</p>
        <div className="fu2"><Group>
          <Row ic="file" title="Terms of Service" onClick={() => {}} />
          <Row ic="file" title="Privacy Policy" onClick={() => {}} />
        </Group></div>
      </div>
    </div>
  );
}

export function AcctDeleteAccount({ back, onDelete }) {
  const [ok, setOk] = useState(false);
  const items = [
    "Your Verified Identity and every credential",
    "All proof and sharing history",
    "Connected services and sync settings",
  ];
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: sp(20, 20, 24) }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="DANGER ZONE" title="Delete account" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: SPACE[16] }}>
        <div className="fu1" style={{ display: "flex", justifyContent: "center", marginBottom: SPACE[16] }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <Grain o={0.07} />
            <Ic n="alert" s={32} c="#E08469" />
          </div>
        </div>
        <p className="fu2" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: SPACE[16], lineHeight: 1.5, textAlign: "center" }}>
          This permanently deletes your Veriqo wallet. It cannot be undone.
        </p>
        <div className="fu2"><Group>
          {items.map((t) => (<Row key={t} ic="x" title={t} danger />))}
        </Group></div>
        <button onClick={() => setOk((o) => !o)} className="fu3" style={{ display: "flex", alignItems: "center", gap: SPACE[12], marginTop: SPACE[16], background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%", textAlign: "left" }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: `1.5px solid ${ok ? "#D9583F" : C.line}`, background: ok ? "#D9583F" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {ok && <Ic n="check" s={13} c="#fff" />}
          </div>
          <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 600, color: C.ink }}>I understand this action is permanent</span>
        </button>
      </div>
      <div style={{ flexShrink: 0, marginTop: SPACE[12] }}>
        <Btn label="Delete my account" variant="danger" disabled={!ok} onClick={onDelete} />
      </div>
    </div>
  );
}
