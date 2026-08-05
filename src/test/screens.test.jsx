import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Wallet, Detail } from "../screens/wallet.jsx";
import { Share } from "../screens/share.jsx";
import { Pulse } from "../screens/pulse.jsx";
import { Welcome, Splash } from "../screens/onboarding.jsx";
import { Permission } from "../screens/verify.jsx";
import { credBy, CREDS, PROOFS, expiryOf } from "../data/credentials.js";

/* Smoke coverage: every major surface mounts with realistic props and shows
   the content a user would look for. These catch the class of break where a
   screen throws on render — the failure a screenshot review never catches. */

const noop = () => {};
const walletProps = {
  name: "Alex Morgan", openDetail: noop, addNew: noop, onProof: noop,
  ownedDocs: ["dl", "passport", "ead"], setOwnedDocs: noop,
  onAccount: noop, onOpenPulse: noop, onPullStart: noop,
};

describe("Wallet", () => {
  it("greets the holder by first name", () => {
    render(<Wallet {...walletProps} />);
    expect(screen.getByText(/Alex's Wallet/)).toBeInTheDocument();
  });

  it("lists the documents the user owns", () => {
    render(<Wallet {...walletProps} />);
    expect(screen.getByText("Driver's License")).toBeInTheDocument();
    expect(screen.getByText("Passport")).toBeInTheDocument();
  });

  it("offers the add-a-document affordance", () => {
    render(<Wallet {...walletProps} />);
    expect(screen.getByText("Add a document")).toBeInTheDocument();
  });

  it("opens a credential when its row is tapped", () => {
    const openDetail = vi.fn();
    render(<Wallet {...walletProps} openDetail={openDetail} />);
    fireEvent.click(screen.getByText("Driver's License"));
    expect(openDetail).toHaveBeenCalled();
  });

  it("surfaces quick proofs for instant sharing", () => {
    render(<Wallet {...walletProps} />);
    expect(screen.getByText(/QUICK PROOFS/)).toBeInTheDocument();
  });
});

describe("Detail", () => {
  it("renders the credential's type and issuer", () => {
    render(<Detail c={credBy("dl")} back={noop} onShare={noop} />);
    expect(screen.getAllByText(/Driver's License/).length).toBeGreaterThan(0);
  });

  it("offers Present proof", () => {
    render(<Detail c={credBy("dl")} back={noop} onShare={noop} />);
    expect(screen.getByText("Present proof")).toBeInTheDocument();
  });

  it("calls back when the back control is used", () => {
    const back = vi.fn();
    const { container } = render(<Detail c={credBy("dl")} back={back} onShare={noop} />);
    fireEvent.click(container.querySelector("button"));
    expect(back).toHaveBeenCalled();
  });

  it("warns when a credential is expiring or expired", () => {
    render(<Detail c={credBy("passport")} back={noop} onShare={noop} />);
    expect(screen.getByText(/Expired|Expires/)).toBeInTheDocument();
  });
});

describe("Share", () => {
  const shareProps = {
    c: credBy("dl"), back: noop,
    defaults: { Name: true, Photo: true, "Age over 21": true, "Date of birth": false },
    profile: { name: "Alex Morgan", dob: "1994-08-14" },
  };

  it("defaults to the QR / Tap method", () => {
    render(<Share {...shareProps} />);
    expect(screen.getByText("Hold near the reader")).toBeInTheDocument();
  });

  it("switches to a time-boxed one-time PIN", () => {
    render(<Share {...shareProps} />);
    fireEvent.click(screen.getByText("One-time PIN"));
    expect(screen.getByText("ONE-TIME PIN")).toBeInTheDocument();
    expect(screen.getByText(/Works once, then expires/)).toBeInTheDocument();
  });

  it("opens selective disclosure and reports how many attributes are shared", () => {
    render(<Share {...shareProps} />);
    fireEvent.click(screen.getByText("Choose what to share"));
    expect(screen.getByText("Choose what to share")).toBeInTheDocument();
    expect(screen.getByText(/attributes selected to share/)).toBeInTheDocument();
  });

  it("explains that an age proof does not reveal the birth date", () => {
    render(<Share {...shareProps} />);
    fireEvent.click(screen.getByText("Choose what to share"));
    expect(screen.getByText(/Shares yes\/no/)).toBeInTheDocument();
  });
});

describe("Pulse", () => {
  it("renders the intelligence feed with its sections", () => {
    render(<Pulse onViewCred={noop} onClose={noop} />);
    expect(screen.getByText("Pulse")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Attention")).toBeInTheDocument();
  });

  it("switches to the timeline of past shares", () => {
    render(<Pulse onViewCred={noop} onClose={noop} />);
    fireEvent.click(screen.getByText("Timeline"));
    expect(screen.getByText("The Crown Pub")).toBeInTheDocument();
  });

  it("expands a card into its detail tray", () => {
    render(<Pulse onViewCred={noop} onClose={noop} />);
    fireEvent.click(screen.getByText("Unusual activity flagged"));
    expect(screen.getByText(/between 3:10/)).toBeInTheDocument();
  });

  it("offers a data-minimising choice on the Coinbase consent request", () => {
    render(<Pulse onViewCred={noop} onClose={noop} />);
    fireEvent.click(screen.getByText("Coinbase wants more of your data"));
    expect(screen.getByText("City only")).toBeInTheDocument();
    expect(screen.getByText("Recommended")).toBeInTheDocument();
  });
});

describe("onboarding + verify", () => {
  it("Welcome states the product promise", () => {
    render(<Welcome go={noop} onSignIn={noop} />);
    expect(screen.getByText(/One/)).toBeInTheDocument();
    expect(screen.getByText("Get started")).toBeInTheDocument();
  });

  it("Splash renders the wordmark", () => {
    render(<Splash onDone={noop} />);
    expect(screen.getByText("VERIQO")).toBeInTheDocument();
  });

  it("Permission explains why the camera is needed and that nothing is stored", () => {
    render(<Permission go={noop} back={noop} />);
    expect(screen.getByText(/We'll need your camera/)).toBeInTheDocument();
    expect(screen.getByText(/Nothing is recorded/)).toBeInTheDocument();
  });
});

describe("credential data model", () => {
  it("gives every credential a key, type, issuer and icon", () => {
    for (const c of CREDS) {
      expect(c.key).toBeTruthy();
      expect(c.type).toBeTruthy();
      expect(c.issuer).toBeTruthy();
      expect(c.ic).toBeTruthy();
    }
  });

  it("credBy falls back to a real credential for an unknown key", () => {
    expect(credBy("nope")).toBe(CREDS[0]);
  });

  it("classifies the seeded passport as expired and the licence as expiring", () => {
    expect(expiryOf(credBy("passport"))?.status).toBe("expired");
    expect(expiryOf(credBy("dl"))?.status).toBe("expiring");
  });

  it("ties every quick proof back to a real credential", () => {
    for (const p of PROOFS) {
      expect(CREDS.some((c) => c.key === p.credKey), `proof ${p.k}`).toBe(true);
    }
  });
});
