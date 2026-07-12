import { useState } from "react";
import { C, DISP, MONO, NUM } from "../../styles/tokens.js";
import { Grain, Ic } from "../../components/Icon.jsx";
import { Header, Row, Group, Notice } from "../../components/primitives.jsx";

export function AcctRecoveryKey({ back }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [genConfirm, setGenConfirm] = useState(false);
  const key = "8F2K · 9XQ1 · 3RT7 · LP4N";
  const onCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="ACCESS" title="Recovery key" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18 }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: 16, lineHeight: 1.5 }}>
          This key restores your wallet on a new device if you ever lose access to Face ID. Keep it somewhere safe — Veriqo can't recover it for you.
        </p>
        <div className="fu1" style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", background: C.accSoft, borderRadius: 13, marginBottom: 16 }}>
          <Ic n="check" s={15} c={C.acc} sw={2.4} />
          <span style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 600, color: C.accDeep }}>Backed up to iCloud Keychain</span>
        </div>
        <div className="fu2" style={{ background: C.ink, borderRadius: 16, padding: "20px 18px", position: "relative", overflow: "hidden", marginBottom: 12 }}>
          <Grain o={0.07} />
          <div style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,.5)", letterSpacing: ".1em", marginBottom: 10 }}>YOUR RECOVERY KEY</div>
          <div style={{ fontFamily: NUM, fontSize: 19, color: "#fff", letterSpacing: ".05em", lineHeight: 1.5 }}>{revealed ? key : "•••• · •••• · •••• · ••••"}</div>
        </div>
        <div className="fu2" style={{ display: "flex", gap: 9 }}>
          <button onClick={() => setRevealed((r) => !r)} style={{ flex: 1, padding: "13px", background: C.paper, border: `1px solid ${C.line}`, borderRadius: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Ic n="eye" s={16} c={C.ink} />
            <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink }}>{revealed ? "Hide" : "Reveal"}</span>
          </button>
          <button onClick={onCopy} style={{ flex: 1, padding: "13px", background: C.paper, border: `1px solid ${C.line}`, borderRadius: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Ic n="copy" s={15} c={C.ink} />
            <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink }}>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <div className="fu3" style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.line}` }}>
          {!genConfirm
            ? <button onClick={() => setGenConfirm(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: DISP, fontSize: 13, fontWeight: 700, color: "#D9583F" }}>Generate new key</button>
            : <div style={{ animation: "chipIn .25s ease both" }}>
                <Notice type="error" icon="alert" title="Generating a new key retires this one" sub="Any backups of the old key will stop working immediately." style={{ marginBottom: 12 }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setGenConfirm(false)} style={{ flex: 1, padding: "11px", background: "transparent", border: `1.5px solid ${C.line}`, borderRadius: 11, cursor: "pointer", fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: C.ink }}>Cancel</button>
                  <button style={{ flex: 1, padding: "11px", background: "#D9583F", border: "none", borderRadius: 11, cursor: "pointer", fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: "#fff" }}>Generate new key</button>
                </div>
              </div>}
        </div>
      </div>
    </div>
  );
}

export function AcctAutoLock({ back }) {
  const [sel, setSel] = useState("Immediately");
  const opts = [
    { l: "Immediately", d: "Locks the moment you leave the app" },
    { l: "After 1 minute", d: "Good for quick re-checks" },
    { l: "After 5 minutes", d: "Balanced for frequent use" },
    { l: "After 1 hour", d: "Least secure — not recommended" },
  ];
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="ACCESS" title="Auto-lock" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18 }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: 16, lineHeight: 1.5 }}>
          Choose how quickly Veriqo locks itself and asks for Face ID again.
        </p>
        <div className="fu2"><Group>
          {opts.map((o) => (
            <Row key={o.l} ic="clock" title={o.l} sub={o.d} onClick={() => setSel(o.l)} right={sel === o.l ? <Ic n="check" s={17} c={C.acc} sw={2.8} /> : null} />
          ))}
        </Group></div>
      </div>
    </div>
  );
}

/* Device management — completed screen (was referenced but undefined in the source). */
export function AcctDevices({ back }) {
  const devices = [
    { ic: "phone", name: "iPhone 15 Pro", sub: "This device · New York", current: true },
    { ic: "devices", name: "iPad Air", sub: "Last active 2 days ago · New York", current: false },
  ];
  const [revoked, setRevoked] = useState([]);
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="ACCESS" title="Device management" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18 }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: 16, lineHeight: 1.5 }}>
          These devices have Veriqo installed and unlocked with your recovery key. Remove any you don't recognise.
        </p>
        <div className="fu2"><Group>
          {devices.map((d) => (
            <Row key={d.name} ic={d.ic} title={d.name} sub={d.sub}
              right={d.current
                ? <span style={{ fontFamily: MONO, fontSize: 9, color: C.accDeep, fontWeight: 700, letterSpacing: ".05em", background: C.accSoft, padding: "3px 8px", borderRadius: 6 }}>THIS DEVICE</span>
                : revoked.includes(d.name)
                  ? <span style={{ fontFamily: MONO, fontSize: 9, color: C.faint, fontWeight: 700, letterSpacing: ".05em" }}>REMOVED</span>
                  : <button onClick={() => setRevoked((r) => [...r, d.name])} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 2px", fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: "#D9583F" }}>Remove</button>} />
          ))}
        </Group></div>
        <Notice className="fu3" type="info" icon="lock" title="Removing a device revokes its access" sub="It will need your recovery key to reconnect." style={{ marginTop: 14 }} />
      </div>
    </div>
  );
}

/* Trusted contacts — completed screen (was referenced but undefined in the source). */
export function AcctTrustedContacts({ back }) {
  const [contacts, setContacts] = useState([
    { name: "Jordan Morgan", relation: "Spouse" },
    { name: "Sam Rivera", relation: "Sibling" },
  ]);
  return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="EMERGENCY" title="Trusted contacts" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18 }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, marginBottom: 16, lineHeight: 1.5 }}>
          If you ever lose access to your wallet, these people can vouch for your identity to help you recover it.
        </p>
        <div className="fu2"><Group>
          {contacts.map((c) => (
            <Row key={c.name} ic="contacts" title={c.name} sub={c.relation}
              right={<button onClick={() => setContacts((list) => list.filter((x) => x.name !== c.name))} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 2px", fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: C.faint }}>Remove</button>} />
          ))}
          <Row ic="plus" title="Add trusted contact" sub="From your contacts" onClick={() => {}} />
        </Group></div>
        <Notice className="fu3" type="success" icon="shield" title="Contacts never see your data" sub="They only confirm you're really you during recovery." style={{ marginTop: 14 }} />
      </div>
    </div>
  );
}
