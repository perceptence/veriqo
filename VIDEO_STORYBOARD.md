# VERIQO — "Proof." Launch Film Storyboard

32.5-second cinematic product showcase for Behance/Dribbble. The creative
thesis: identity is dark, bureaucratic, anxious — Veriqo makes it calm, green,
and instant. The film moves from a black void into warm bone light, and every
cut lands on the product's emerald accent. No hands, no screen-recording
energy — the UI performs.

## Global production spec

| | |
|---|---|
| Runtime | 32.5s master · 16:9 3840×2160 · 60fps (crops: 4:5, 9:16) |
| Device | iPhone 17 Pro 3D model, near-black titanium; screens are REAL app captures at 402×874 logical res, 60fps, composited onto the glass |
| Palette | Bone `#ECE7DE` · Ink `#141210` · Emerald `#15A06A` · Glow `#22E08C` |
| Type (overlays) | Space Mono, 0.18em tracking, all-caps, tiny (matches app eyebrows). Title lockup in Archivo Black |
| Easing | `veriqo-out` cubic-bezier(.16,1,.3,1) entrances · `island-spring` cubic-bezier(.6,0,.2,1.2) morphs/overshoot · `sheet` cubic-bezier(.32,0,.15,1) layer slides · camera: exponential ease-out, never linear |
| Grade | Soft film LUT, 8% 35mm grain (echoes the app's own Grain texture), halation only on emerald highlights, gentle vignette |
| Cut grid | 90 BPM — every cut on a beat or 8th |

## Scene 1 — Hook: "The Island Breathes" — 0:00–0:03

- **Camera:** Extreme macro (device at 2.6× frame height), locked-off, ~4% push-in.
- **Screen:** Black; only the Dynamic Island pill visible — reads as hardware.
- **UI animation:** At 0:00.6 the pill springs open (`island-spring`) into the live card: spinning arc, "Verifying identity / VERIQO NETWORK · LIVE," breathing green dot.
- **Motion:** The morph is the hook — hardware coming alive. Arc spins at the app's real 0.9s loop.
- **Light/shadow:** Void black; the expanded card is the only light source — emerald spill on glass edge and bezel.
- **Background:** True black, 4% grain, faint dust motes crossing the glow.
- **Transition:** Green check pops (`popIn`) → hard cut on beat.
- **Overlay:** None.
- **Sound:** Low sub drone · soft mechanical tick on expansion · faint servo whir under the spinner.

## Scene 2 — Hero Reveal — 0:03–0:07

- **Camera:** Explosive pull-back (exponential ease-out) from island to full device floating at 3/4 angle; device slow-rotates to face camera, settles with 2° overshoot.
- **Screen:** Splash — faceted emerald hexagon, dotted orbit ring, "VERIQO / DIGITAL IDENTITY WALLET," progress bar filling.
- **UI animation:** Real splash sequence; dotted ring rotates continuously.
- **Motion:** Parallax on three layers (device / glow / dust) at 100/60/30%.
- **Light/shadow:** Dual rim light — emerald left, warm bone right — glass reflections sweep as it rotates; soft contact shadow far below.
- **Background:** Void lifts to charcoal with faint emerald radial behind device.
- **Transition:** Hexagon logo scales up past camera, facets wiping frame — seamless morph into Scene 3.
- **Overlay:** None.
- **Sound:** Beat drops at full reveal — minimal analog synth, 90 BPM, side-chained.

## Scene 3 — Wallet Fly-Through — 0:07–0:12

- **Camera:** Lateral drift L→R with 6° orbit; one 0.8s macro insert.
- **Screen:** Wallet home: "GOOD MORNING / Alex's Wallet," Verified Identity card, Quick Proofs pills, Documents list.
- **UI animation:** Real staggered entrance — cards fade-up in 70ms cascade (`veriqo-out`).
- **Motion:** World inverts dark→light: background floods to bone, soft long shadow lands. Macro insert: light sweep raking the identity card's grain texture and green strip.
- **Light/shadow:** Daylight studio; large softbox reflection sliding on glass.
- **Background:** Bone `#ECE7DE` seamless, subtle paper grain.
- **Transition:** Match-dissolve on the green "ACTIVE" dot → next scene's pill.
- **Overlay (0:09):** `ONE WALLET. EVERY PROOF.` — Space Mono, ink, lower third, types on, dissolves.
- **Sound:** Music opens (hats enter); soft paper foley on cascade.

## Scene 4 — The Money Shot: Proof → Countdown — 0:12–0:17

- **Camera:** Top-down macro on "Over 21" pill; tap → whip-morph to face-on; slow push with 1.5° dutch during countdown.
- **Screen:** Quick Proof tap → island expands: "Sharing with TSA PreCheck / PROOF EXPIRES IN 0:30 → 0:29 → 0:28" (Anton numerals).
- **UI animation:** Pill compresses (scale .96) with a green pointer-glow ripple (no hand); island morphs via `island-spring`; countdown ticks live; glow dot breathes.
- **Motion:** Each tick lands on an 8th-note; numerals get 2px motion blur on change.
- **Light/shadow:** Bone world; island card throws soft green underglow onto content below.
- **Background:** Bone, defocused.
- **Transition:** Beat-cut on a tick.
- **Overlay (0:15):** `SHARE THE PROOF, NOT THE DATA.` — word-by-word, mono, fades.
- **Sound:** Muted thock on tap · clock-tick foley synced to numerals · bass pulse breathing with the glow.

## Scene 5 — Pulse: Layered Depth — 0:17–0:22

- **Camera:** 3/4 side view orbiting 10°, exposing real Z-depth between UI layers.
- **Screen:** Drag handle pulls; wallet recedes; Pulse slides over — "IDENTITY INTELLIGENCE," security/attention cards.
- **UI animation:** Wallet scales to 0.93, corners round, slides 5% (`sheet`); Pulse sheet enters from top; cards cascade.
- **Motion:** Cheat the layering into literal 3D — separate the two UI planes ~40pt in Z so Pulse casts a real soft shadow on the receding wallet. Parallax sells the architecture: intelligence sits above your wallet.
- **Light/shadow:** Sheet edge catches a specular line; inter-plane shadow 12% opacity, large blur.
- **Background:** Bone, darkening 10% at edges.
- **Transition:** Push into a Pulse security card until its red icon fills frame → match-cut.
- **Overlay:** None — the depth is the statement.
- **Sound:** Long airy whoosh + paper slide; music half-time for two bars.

## Scene 6 — Verify Montage — 0:22–0:27

Three cuts, ~1.6s each, matched on the green accent position. Macro, shallow
DOF, 3% handheld float. Dark verify world returns (ink background, screen as
key light) — bookending the film's dark→light→dark arc.

- **(a) ID scan:** corner brackets lock, `scanSweep` line passes the license, data rows type on in mono. Tick-beep.
- **(b) Liveness:** selfie oval pulses (`ovalActive` rings) → snaps green (`ovalDone`). Soft chime.
- **(c) Success:** processing arc resolves; "unlocked" proof chips popIn one-two-three. Triple tick; riser building.
- **Transition:** Final chip pop → hard cut to black, one full beat of silence.

## Scene 7 — Hero Shot + Title — 0:27–0:32.5

- **Camera:** Device rises from frame bottom (heavy `veriqo-out`), face-on, settles centered.
- **Screen:** Wallet home, idle; island's green dot breathes once.
- **Motion:** Glossy floor reflection; dust motes; grain to 12%. Title lockup: faceted hexagon mark scales in with `island-spring`; VERIQO in Archivo Black tracks inward from wide spacing; below in mono: `DIGITAL IDENTITY WALLET`.
- **Light/shadow:** Deep ink world, faint emerald radial halo, halation on the glow.
- **Background:** Ink `#141210`, vignetted.
- **Transition:** Everything fades except the green dot — lingers 12 frames, then out.
- **Sound:** Music resolves to one warm chord + soft two-note mnemonic (shink-chime) on the lockup. Room tone, silence with the dot.

## Build notes

- **Capture:** Run the app locally, record each flow at 60fps from the browser at device resolution; screen-replace onto a 3D device in AE, or composite flat parallax layers in Jitter (cheaper, reads premium at feed sizes).
- **AE:** Reuse the three product cubic-beziers so film motion and product motion are indistinguishable.
- **Rive/Jitter:** Scenes 1, 4, 7 rebuild cleanly as vector; Scene 5 is a simple two-plane Z rig.
- **Veo/Runway/Kling:** Generate only environments (void, dust, light sweeps, floor reflection) and composite real UI on top — never let AI generate the screens themselves.
