import { useState } from "react";
import { C, DISP, MONO } from "../../styles/tokens.js";
import { Ic } from "../../components/Icon.jsx";
import { Header, Back, Btn, Group, ProgressDots } from "../../components/primitives.jsx";

function EIDFieldGroup({ children }) {
  return (
    <div style={{ background: C.paper, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}`, marginBottom: 14 }}>{children}</div>
  );
}
function EIDField({ label, value, onChange, placeholder, type = "text", border = true }) {
  return (
    <div style={{ padding: "10px 16px", borderTop: border ? `1px solid ${C.line}` : "none" }}>
      <div style={{ fontFamily: MONO, fontSize: 9.5, color: C.faint, fontWeight: 700, letterSpacing: ".07em", marginBottom: 3 }}>{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || ""} style={{ width: "100%", fontFamily: DISP, fontSize: 15, fontWeight: 500, color: C.ink, border: "none", background: "transparent", outline: "none", padding: "2px 0" }} />
    </div>
  );
}

export function EmergencyID({ back, data, onSave }) {
  const BLOOD_TYPES = ["O+", "O−", "A+", "A−", "B+", "B−", "AB+", "AB−", "Unknown"];
  const [step, setStep] = useState(data ? "view" : "intro");
  const [form, setForm] = useState({
    bloodType: data?.bloodType || "", organDonor: data?.organDonor ?? null,
    allergies: data?.allergies || "", conditions: data?.conditions || "", medications: data?.medications || "",
    contactName: data?.contact?.name || "", contactRelation: data?.contact?.relation || "", contactPhone: data?.contact?.phone || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const ActiveCard = ({ d }) => (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", background: C.bone }}>
      <div style={{ background: "#D93025", padding: "20px 20px 24px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <Back onClick={back} light />
          <button onClick={() => setStep("medical")} style={{ background: "rgba(255,255,255,.15)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", flexShrink: 0, fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: "#fff", letterSpacing: ".05em" }}>EDIT</button>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: ".12em", color: "rgba(255,255,255,.7)", marginBottom: 4, marginTop: 20 }}>EMERGENCY ID</div>
        <div style={{ fontFamily: DISP, fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-.02em", marginBottom: 10 }}>Alex Morgan</div>
        <p style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,.75)", lineHeight: 1.5 }}>
          Surfaces when Emergency SOS is triggered on your phone — no passcode needed. Also available as a lock screen widget in iOS Settings.
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 40px" }}>
        <p style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", marginBottom: 10 }}>MEDICAL INFO</p>
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(20,18,16,.06)", marginBottom: 20 }}>
          {[["Blood type", d.bloodType || "—"], ["Organ donor", d.organDonor === null ? "Unknown" : d.organDonor ? "Yes" : "No"],
            ["Allergies", d.allergies || "None"], ["Conditions", d.conditions || "None"], ["Medications", d.medications || "None"]].map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderTop: i ? `1px solid ${C.line}` : "none" }}>
              <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub }}>{k}</span>
              <span style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: C.ink, maxWidth: "55%", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: MONO, fontSize: 10, color: C.faint, fontWeight: 700, letterSpacing: ".12em", marginBottom: 10 }}>EMERGENCY CONTACT</p>
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 12px rgba(20,18,16,.06)" }}>
          <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{d.contact.name}</div>
          <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 500, color: C.sub, marginBottom: 10 }}>{d.contact.relation}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.accSoft, borderRadius: 10, padding: "10px 14px" }}>
            <Ic n="phone" s={15} c={C.acc} />
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.accDeep, letterSpacing: ".04em" }}>{d.contact.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (step === "view" && data) return <ActiveCard d={data} />;

  if (step === "intro") return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <Header back={back} eyebrow="EMERGENCY" title="Emergency ID" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18 }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginBottom: 24 }}>
          First responders can see your medical info and reach your emergency contact directly from your lock screen — no passcode needed.
        </p>
        <Group>
          {[["lock", "Visible without unlocking", "Always available in an emergency"],
            ["shield", "Zero-knowledge", "Veriqo never shares this data with third parties"],
            ["user", "Your control", "You decide exactly what to show"]].map(([ic, t, d], i) => (
            <div key={t} style={{ display: "flex", gap: 13, padding: "13px 16px", alignItems: "center", borderTop: i ? `1px solid ${C.line}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.bone, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n={ic} s={17} c={C.ink} />
              </div>
              <div>
                <div style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 700, color: C.ink }}>{t}</div>
                <div style={{ fontFamily: DISP, fontSize: 12, fontWeight: 500, color: C.faint, marginTop: 1 }}>{d}</div>
              </div>
            </div>
          ))}
        </Group>
      </div>
      <Btn label="Get started" onClick={() => setStep("medical")} />
    </div>
  );

  if (step === "medical") return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <ProgressDots total={3} current={1} />
        <Header back={() => setStep(data ? "view" : "intro")} eyebrow="STEP 1 · MEDICAL" title="Medical information" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18 }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginBottom: 20 }}>
          Shown to first responders. Leave blank anything you don't want to share.
        </p>
        <p style={{ fontFamily: MONO, fontSize: 9.5, color: C.faint, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>BLOOD TYPE</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
          {BLOOD_TYPES.map((t) => (
            <button key={t} onClick={() => set("bloodType", t)} style={{ padding: "10px 0", borderRadius: 10, border: `1.5px solid ${form.bloodType === t ? C.ink : C.line}`, cursor: "pointer", fontFamily: DISP, fontSize: 13.5, fontWeight: 700, background: form.bloodType === t ? C.ink : "transparent", color: form.bloodType === t ? "#fff" : C.sub, transition: "all .15s" }}>{t}</button>
          ))}
        </div>
        <p style={{ fontFamily: MONO, fontSize: 9.5, color: C.faint, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>ORGAN DONOR</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["Yes", true], ["No", false], ["Unknown", null]].map(([l, v]) => (
            <button key={l} onClick={() => set("organDonor", v)} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: `1.5px solid ${form.organDonor === v ? C.ink : C.line}`, cursor: "pointer", fontFamily: DISP, fontSize: 13.5, fontWeight: 700, background: form.organDonor === v ? C.ink : "transparent", color: form.organDonor === v ? "#fff" : C.sub, transition: "all .15s" }}>{l}</button>
          ))}
        </div>
        <EIDFieldGroup>
          <EIDField label="ALLERGIES" value={form.allergies} border={false} onChange={(v) => set("allergies", v)} placeholder="e.g. Penicillin, shellfish" />
          <EIDField label="MEDICAL CONDITIONS" value={form.conditions} onChange={(v) => set("conditions", v)} placeholder="e.g. Type 1 diabetes" />
          <EIDField label="MEDICATIONS" value={form.medications} onChange={(v) => set("medications", v)} placeholder="e.g. Insulin 10u daily" />
        </EIDFieldGroup>
      </div>
      <Btn label="Continue" onClick={() => setStep("contact")} />
    </div>
  );

  if (step === "contact") return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <ProgressDots total={3} current={2} />
        <Header back={() => setStep("medical")} eyebrow="STEP 2 · CONTACT" title="Emergency contact" />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 18 }}>
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginBottom: 20 }}>
          Who should responders call if you can't speak for yourself?
        </p>
        <EIDFieldGroup>
          <EIDField label="FULL NAME" value={form.contactName} border={false} onChange={(v) => set("contactName", v)} placeholder="e.g. Jordan Morgan" />
          <EIDField label="RELATIONSHIP" value={form.contactRelation} onChange={(v) => set("contactRelation", v)} placeholder="e.g. Spouse" />
          <EIDField label="PHONE NUMBER" value={form.contactPhone} type="tel" onChange={(v) => set("contactPhone", v)} placeholder="(917) 555-0100" />
        </EIDFieldGroup>
      </div>
      <Btn label="Preview on lock screen" onClick={() => setStep("preview")} disabled={!form.contactName || !form.contactPhone} />
    </div>
  );

  if (step === "preview") return (
    <div className="si" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 20px 26px" }}>
      <div style={{ flexShrink: 0 }}>
        <ProgressDots total={3} current={3} />
        <Header back={() => setStep("contact")} eyebrow="STEP 3 · PREVIEW" title="What responders see" />
        <p className="fu1" style={{ fontFamily: DISP, fontSize: 13.5, fontWeight: 500, color: C.sub, lineHeight: 1.5, marginTop: 16, marginBottom: 0 }}>
          This card surfaces when a responder triggers Emergency SOS on your phone — no passcode needed. You can also add it as a lock screen widget in iOS Settings.
        </p>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginTop: 20 }}>
        <div style={{ background: "#1A1A1F", borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 32px rgba(20,18,16,.2)" }}>
          <div style={{ background: "#D93025", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Ic n="alert" s={14} c="#fff" sw={2} />
            <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: ".06em" }}>EMERGENCY MEDICAL ID</span>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontFamily: DISP, fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Alex Morgan</div>
            {[
              ["Blood type", form.bloodType || "—"],
              ["Organ donor", form.organDonor === null ? "Unknown" : form.organDonor ? "Yes" : "No"],
              form.allergies && ["Allergies", form.allergies],
            ].filter(Boolean).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontFamily: DISP, fontSize: 12, color: "rgba(255,255,255,.55)" }}>{k}</span>
                <span style={{ fontFamily: DISP, fontSize: 12, fontWeight: 600, color: "#fff", maxWidth: "55%", textAlign: "right" }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "rgba(255,255,255,.12)", margin: "12px 0" }} />
            <div style={{ fontFamily: MONO, fontSize: 8.5, fontWeight: 700, color: "rgba(255,255,255,.4)", letterSpacing: ".07em", marginBottom: 8 }}>EMERGENCY CONTACT</div>
            <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
              {form.contactName || "—"}{form.contactRelation ? ` · ${form.contactRelation}` : ""}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,.6)" }}>{form.contactPhone || "—"}</div>
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, marginTop: 20 }}>
        <Btn label="Activate Emergency ID" onClick={() => {
          onSave({
            bloodType: form.bloodType, organDonor: form.organDonor,
            allergies: form.allergies, conditions: form.conditions, medications: form.medications,
            contact: { name: form.contactName, relation: form.contactRelation, phone: form.contactPhone },
          });
          setStep("view");
        }} />
      </div>
    </div>
  );

  return null;
}
