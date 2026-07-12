/* ============================================================
   VERIQO DATA LAYER
   Credential catalog, directory, share history, and helpers.
   ============================================================ */

export const USER = { name: "Alex Morgan", first: "Alex" };

export const CREDS = [
  { key: "vera", type: "Verified Identity", issuer: "Veriqo Network", ic: "shield", accent: "#15A06A", token: true,
    fields: [["HOLDER", "Alex Morgan"], ["VERIFIED", "Jun 2026"], ["NETWORK", "Veriqo Network"], ["TOKEN", "vid:0x7Q2K·9F1X"]] },

  { key: "dl", type: "Driver's License", issuer: "New York DMV", ic: "license", accent: "#E0A53B",
    tier: "common", d: "State or government issued", hint: "Front side, facing camera",
    fields: [["NAME", "Alex Morgan"], ["DATE OF BIRTH", "1994·08·14"], ["CLASS", "D"], ["EXPIRES", "2026·07·10"], ["LICENCE NO.", "847261953"]] },
  { key: "passport", type: "Passport", issuer: "U.S. Dept of State", ic: "passport", accent: "#5384CF",
    tier: "common", d: "International travel document", hint: "Open to the photo page",
    fields: [["NAME", "Alex Morgan"], ["NATIONALITY", "UNITED STATES"], ["DATE OF BIRTH", "1994·08·14"], ["PASSPORT NO.", "561203948"], ["EXPIRES", "2026·06·01"]] },
  { key: "stateid", type: "State ID", issuer: "New York DMV", ic: "stateid", accent: "#A45BC9",
    tier: "common", d: "State-issued identity card", hint: "Front side, facing camera",
    fields: [["NAME", "Alex Morgan"], ["DATE OF BIRTH", "1994·08·14"], ["ADDRESS", "Brooklyn · NY"], ["ID NO.", "NY8841220"], ["EXPIRES", "2030·05·19"]] },

  { key: "passportcard", type: "Passport Card", issuer: "U.S. Dept of State", ic: "passport", accent: "#4FA8A0",
    tier: "more", category: "Federal",
    fields: [["NAME", "Alex Morgan"], ["NATIONALITY", "UNITED STATES"], ["DATE OF BIRTH", "1994·08·14"], ["CARD NO.", "C12345678"], ["EXPIRES", "2031·03·02"]] },
  { key: "greencard", type: "Green Card", issuer: "U.S. Citizenship & Immigration Services", ic: "globe", accent: "#6FA85C",
    tier: "more", category: "Federal",
    fields: [["NAME", "Alex Morgan"], ["DATE OF BIRTH", "1994·08·14"], ["COUNTRY OF BIRTH", "CANADA"], ["CARD NO.", "GC8841220"], ["EXPIRES", "2034·11·02"]] },
  { key: "ead", type: "Employment Authorization", short: "EAD", issuer: "U.S. Citizenship & Immigration Services", ic: "badge", accent: "#C98A4B",
    tier: "more", category: "Federal",
    fields: [["NAME", "Alex Morgan"], ["DATE OF BIRTH", "1994·08·14"], ["CATEGORY", "C09"], ["CARD NO.", "EAD7734221"], ["EXPIRES", "2027·06·30"]] },
  { key: "naturalization", type: "Naturalization Certificate", short: "NATURALIZATION CERT.", issuer: "U.S. Citizenship & Immigration Services", ic: "flag", accent: "#B85C7A",
    tier: "more", category: "Federal",
    fields: [["NAME", "Alex Morgan"], ["DATE OF BIRTH", "1994·08·14"], ["FORMER NATIONALITY", "CANADA"], ["CERTIFICATE NO.", "N4471092"], ["NATURALIZED", "2018·09·12"]] },

  { key: "militaryid", type: "Military ID", issuer: "U.S. Dept of Defense", ic: "dogtags", accent: "#5C6E91",
    tier: "more", category: "Military & Veteran",
    fields: [["NAME", "Alex Morgan"], ["BRANCH", "U.S. ARMY"], ["RANK", "SGT"], ["DOD ID NO.", "1029384756"], ["EXPIRES", "2028·02·14"]] },
  { key: "veteranid", type: "Veteran ID", issuer: "U.S. Dept of Veterans Affairs", ic: "star", accent: "#8A8170",
    tier: "more", category: "Military & Veteran",
    fields: [["NAME", "Alex Morgan"], ["BRANCH", "U.S. ARMY"], ["SERVICE DATES", "2012–2018"], ["CARD NO.", "VIC502913"]] },

  { key: "tribalid", type: "Tribal ID", issuer: "Tribal Government", ic: "building", accent: "#A0784F",
    tier: "more", category: "Tribal",
    fields: [["NAME", "Alex Morgan"], ["DATE OF BIRTH", "1994·08·14"], ["TRIBE", "CHEROKEE NATION"], ["ENROLLMENT NO.", "CN449281"], ["EXPIRES", "2030·01·19"]] },
  { key: "enhancedtribal", type: "Enhanced Tribal ID", issuer: "Tribal Government", ic: "card", accent: "#7E9B7E",
    tier: "more", category: "Tribal",
    fields: [["NAME", "Alex Morgan"], ["DATE OF BIRTH", "1994·08·14"], ["TRIBE", "CHEROKEE NATION"], ["CARD NO.", "ETC119273"], ["EXPIRES", "2030·01·19"]] },

  { key: "twic", type: "TWIC", issuer: "Transportation Security Administration", ic: "anchor", accent: "#6B7A8F",
    tier: "more", category: "Occupational",
    fields: [["NAME", "Alex Morgan"], ["DATE OF BIRTH", "1994·08·14"], ["TWIC NO.", "TW3392910"], ["EXPIRES", "2029·09·05"]] },
];

export const TODAY_DATE = new Date("2026-06-22");

export const expiryOf = (c) => {
  const f = c.fields?.find(([k]) => k === "EXPIRES");
  if (!f) return null;
  const d = new Date(f[1].replace(/·/g, "-"));
  const days = Math.floor((d - TODAY_DATE) / 86400000);
  return {
    days,
    status: days < 0 ? "expired" : days <= 30 ? "expiring" : "valid",
    label: days < 0 ? `Expired ${Math.abs(days)}d ago` : days === 0 ? "Expires today" : `${days}d left`,
  };
};

export const EXP = {
  expired: { color: "#D93025", bg: "#FEE8E6", label: "EXPIRED" },
  expiring: { color: "#C07B00", bg: "#FEF4E6", label: "EXP SOON" },
  valid: { color: null, bg: null, label: null },
};

export const credBy = (k) => CREDS.find((c) => c.key === k) || CREDS[0];

export const SHARE_HISTORY = {
  dl: [
    { who: "The Crown Pub", what: "Age over 21", time: "Today 2:14 PM" },
    { who: "Total Wine", what: "Age over 21", time: "Monday" },
    { who: "Hertz", what: "Name · Driver license no.", time: "Oct 25" },
  ],
  passport: [
    { who: "Global Entry · SFO", what: "Full passport", time: "Yesterday" },
    { who: "Hertz", what: "Name · Date of birth", time: "Nov 8" },
  ],
  stateid: [{ who: "Total Wine", what: "State ID", time: "Monday" }],
  vera: [
    { who: "Coinbase", what: "Identity confirmed", time: "Today 11:02 AM" },
    { who: "TSA PreCheck", what: "Identity confirmed", time: "Sunday" },
    { who: "Robinhood", what: "Identity confirmed", time: "Oct 28" },
  ],
};

export const PROOFS = [
  { k: "age18", full: "Over 18", ic: "cake", from: "Driver's License", credKey: "dl" },
  { k: "age21", full: "Over 21", ic: "wine", from: "Driver's License", credKey: "dl" },
  { k: "resident", full: "NY resident", ic: "mappin", from: "State ID", credKey: "stateid" },
  { k: "drive", full: "Can drive", ic: "car", from: "Driver's License", credKey: "dl" },
  { k: "citizen", full: "U.S. citizen", ic: "passport", from: "Passport", credKey: "passport" },
];

export const DIRECTORY = [
  { key: "equinox", name: "Equinox", ic: "building", blurb: "Gym membership & age verification",
    defaultScope: { Name: true, Photo: false, "Age over 21": true, "Date of birth": false, "Document number": false, Address: false } },
  { key: "robinhood", name: "Robinhood", ic: "chart", blurb: "Identity verification for trading",
    defaultScope: { Name: true, Photo: false, "Age over 21": false, "Date of birth": true, "Document number": true, Address: false } },
  { key: "hertz", name: "Hertz", ic: "license", blurb: "Driver's license for rentals",
    defaultScope: { Name: true, Photo: true, "Age over 21": false, "Date of birth": false, "Document number": true, Address: false } },
  { key: "doordash", name: "DoorDash", ic: "card", blurb: "Age verification for alcohol orders",
    defaultScope: { Name: false, Photo: false, "Age over 21": true, "Date of birth": false, "Document number": false, Address: false } },
];

/* Screen-step enum for the verification flow */
export const S = { W: 0, P: 1, IS: 2, IC: 3, IR: 4, SI: 5, SC: 6, PR: 7, SU: 8 };
