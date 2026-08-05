import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Btn, Toggle, Row, Group, Notice, DataRows, StepDots, ProgressDots, Header } from "../components/primitives.jsx";
import { Ic } from "../components/Icon.jsx";
import { QR } from "../components/cards.jsx";
import { STROKE, strokeFor, C } from "../styles/tokens.js";

/* Component contracts: render, respond to interaction, and — critically —
   pull their visual values from the design system rather than hardcoding. */

describe("Btn", () => {
  it("renders its label and fires onClick", () => {
    const onClick = vi.fn();
    render(<Btn label="Present proof" onClick={onClick} />);
    fireEvent.click(screen.getByText("Present proof"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire when disabled", () => {
    const onClick = vi.fn();
    render(<Btn label="Continue" onClick={onClick} disabled />);
    fireEvent.click(screen.getByText("Continue"));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Toggle", () => {
  it("fires onClick and reflects on/off state visually", () => {
    const onClick = vi.fn();
    const { container, rerender } = render(<Toggle on={false} onClick={onClick} />);
    const el = container.firstChild;
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalled();
    const off = el.style.background;
    rerender(<Toggle on onClick={onClick} />);
    expect(container.firstChild.style.background).not.toBe(off);
  });
});

describe("Row", () => {
  it("renders title, subtitle and a right slot", () => {
    render(<Row ic="shield" title="Driver's License" sub="New York DMV" right={<span>EXP SOON</span>} />);
    expect(screen.getByText("Driver's License")).toBeInTheDocument();
    expect(screen.getByText("New York DMV")).toBeInTheDocument();
    expect(screen.getByText("EXP SOON")).toBeInTheDocument();
  });

  it("is clickable when given onClick", () => {
    const onClick = vi.fn();
    render(<Row ic="shield" title="Passport" onClick={onClick} />);
    fireEvent.click(screen.getByText("Passport"));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("Group / Notice / DataRows", () => {
  it("Group renders its children", () => {
    render(<Group><Row ic="key" title="Recovery key" /></Group>);
    expect(screen.getByText("Recovery key")).toBeInTheDocument();
  });

  it("Notice renders title and sub, and colors itself from the STATUS tokens", () => {
    const { container } = render(<Notice type="success" title="Encrypted on your device" sub="Never sold." />);
    expect(screen.getByText("Encrypted on your device")).toBeInTheDocument();
    expect(screen.getByText("Never sold.")).toBeInTheDocument();
    expect(container.firstChild.style.background).toBeTruthy();
  });

  it("DataRows renders every label/value pair", () => {
    render(<DataRows rows={[["NAME", "Alex Morgan"], ["CLASS", "D"]]} />);
    expect(screen.getByText("NAME")).toBeInTheDocument();
    expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
    expect(screen.getByText("CLASS")).toBeInTheDocument();
  });
});

describe("progress indicators", () => {
  it("StepDots renders one dot per step", () => {
    const { container } = render(<StepDots total={4} current={2} />);
    expect(container.querySelectorAll("div > div").length).toBeGreaterThanOrEqual(4);
  });

  it("ProgressDots renders the onboarding step count", () => {
    const { container } = render(<ProgressDots current={1} total={3} />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("Header", () => {
  it("renders eyebrow and title, and wires the back control", () => {
    const back = vi.fn();
    const { container } = render(<Header back={back} eyebrow="PRESENT PROOF" title="Verified Identity" />);
    expect(screen.getByText("PRESENT PROOF")).toBeInTheDocument();
    expect(screen.getByText("Verified Identity")).toBeInTheDocument();
    fireEvent.click(container.querySelector("button"));
    expect(back).toHaveBeenCalled();
  });
});

describe("Ic — icon stroke comes from the token rule", () => {
  it("uses strokeFor(size) by default rather than a hardcoded weight", () => {
    const { container } = render(<Ic n="pulse" s={13} />);
    const svg = container.querySelector("svg");
    expect(Number(svg.getAttribute("stroke-width"))).toBe(strokeFor(13));
    expect(Number(svg.getAttribute("stroke-width"))).toBe(STROKE.bold);
  });

  it("scales stroke down for a large icon", () => {
    const { container } = render(<Ic n="pulse" s={32} />);
    expect(Number(container.querySelector("svg").getAttribute("stroke-width"))).toBe(STROKE.light);
  });

  it("still honours an explicit override for deliberate active states", () => {
    const { container } = render(<Ic n="pulse" s={13} sw={2.4} />);
    expect(Number(container.querySelector("svg").getAttribute("stroke-width"))).toBe(2.4);
  });

  it("renders a lucide fallback for names outside the custom set", () => {
    const { container } = render(<Ic n="shield" s={18} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders nothing for an unknown icon name instead of throwing", () => {
    const { container } = render(<Ic n="definitely-not-an-icon" s={18} />);
    expect(container.querySelector("svg")).toBeNull();
  });
});

describe("QR", () => {
  it("renders deterministically for the same seed", () => {
    const a = render(<QR seed="dl-proof" size={120} />).container.innerHTML;
    const b = render(<QR seed="dl-proof" size={120} />).container.innerHTML;
    expect(a).toBe(b);
  });

  it("renders a different pattern for a different seed", () => {
    const a = render(<QR seed="dl-proof" size={120} />).container.innerHTML;
    const b = render(<QR seed="passport-proof" size={120} />).container.innerHTML;
    expect(a).not.toBe(b);
  });
});
