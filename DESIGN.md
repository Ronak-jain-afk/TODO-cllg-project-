---
name: FlowForge
description: A personal productivity cockpit — warm, focused, human.
colors:
  accent: "oklch(52% 0.14 38)"
  accent-hover: "oklch(48% 0.16 38)"
  bg-primary: "oklch(97% 0.004 80)"
  bg-surface: "oklch(93% 0.008 80)"
  text-primary: "oklch(15% 0.02 70)"
  text-secondary: "oklch(42% 0.03 70)"
  border: "oklch(88% 0.008 80)"
  danger: "oklch(50% 0.18 30)"
  success: "oklch(55% 0.14 145)"
  priority-critical: "oklch(48% 0.2 28)"
  priority-high: "oklch(55% 0.16 55)"
  priority-medium: "oklch(65% 0.12 85)"
  priority-low: "oklch(58% 0.12 145)"
  bg-dark: "oklch(15% 0.01 70)"
  surface-dark: "oklch(20% 0.012 70)"
  text-primary-dark: "oklch(92% 0.008 70)"
  text-secondary-dark: "oklch(62% 0.02 70)"
  border-dark: "oklch(28% 0.012 70)"
  accent-dark: "oklch(60% 0.14 38)"
  accent-hover-dark: "oklch(64% 0.14 38)"
typography:
  display:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  chip-active:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
  chip-default:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.lg}"
---

# Design System: FlowForge

## 1. Overview

**Creative North Star: "The Workshop"**

FlowForge is a personal workshop, not a dashboard. It's the bench where you lay out your tasks, decide what matters, and get to work. The interface is warm but not cozy, structured but not rigid — like a well-organized workbench where every tool has its place and nothing is in the way.

This system explicitly rejects the SaaS-generic aesthetic: no glassmorphism, no gradient text, no pastel accent colors, no side-stripe borders. Depth comes from tonal layering (surface sits on background at a perceptible lightness step), never from shadows or blur. The warmth is in the material — the terracotta accent, the off-white surface with a whisper of hue, the generous spacing — not in decorative effects.

### Key Characteristics

- Warm without being soft. The terracotta accent carries the brand; nothing is playful or gamified.
- Surfaces are solid, not translucent. One layer of depth (background → surface), no nesting.
- Typography does the heavy lifting for hierarchy. Color supports, not leads.
- Every interaction has a purpose. No animation for its own sake.
- Intimate scale: one person, one tool, one screen at a time.

## 2. Colors

The palette is built around a warm terracotta accent on a true off-white background. The warm hue is concentrated in the accent; the neutrals carry only a whisper of the same direction (chroma 0.004–0.02 toward 80°), enough to feel coherent without reading as "beige."

### Primary

- **Terracotta** (`oklch(52% 0.14 38)` / `oklch(60% 0.14 38)` dark): Primary buttons, active filter chips, focus indicators, progress fills, countdown numbers. The accent is used on ≤10% of any given screen. Its rarity is the point.

### Neutral

- **Workshop Paper** (`oklch(97% 0.004 80)` / `oklch(15% 0.01 70)` dark): The body background. A true off-white with a minuscule warmth — not cream, not gray.
- **Workshop Surface** (`oklch(93% 0.008 80)` / `oklch(20% 0.012 70)` dark): Cards, inputs, chips — all interactive surfaces sit at this step. There is no lower surface; nesting is prohibited.
- **Warm Ink** (`oklch(15% 0.02 70)` / `oklch(92% 0.008 70)` dark): Primary body text. High contrast, warm-leaning near-black.
- **Tool Steel** (`oklch(42% 0.03 70)` / `oklch(62% 0.02 70)` dark): Secondary text, placeholders, metadata labels. Still warm, still readable at 4.5:1 against the background.
- **Workbench Edge** (`oklch(88% 0.008 80)` / `oklch(28% 0.012 70)` dark): Borders, dividers, subtle structural lines.

### Semantic

- **Deep Red** (`oklch(50% 0.18 30)`): Delete actions, overdue alerts, destructive states.
- **Woodland Green** (`oklch(55% 0.14 145)`): Completion indicators, success feedback.
- **Priority — Critical** (`oklch(48% 0.2 28)`): Deep crimson-red for urgent.
- **Priority — High** (`oklch(55% 0.16 55)`): Warm orange-amber.
- **Priority — Medium** (`oklch(65% 0.12 85)`): Ochre gold.
- **Priority — Low** (`oklch(58% 0.12 145)`): Muted green.

### Named Rules

**The One-Step Rule.** There is exactly one surface level above the page background. Cards and inputs share this level. No nested cards, no lifted modals, no "surface-on-surface" depth. The workshop is flat; focus comes from typography and spacing, not stacking.

## 3. Typography

**Display / Body / Label Font:** Inter (with system-ui fallback throughout)

Inter is a warm humanist sans-serif designed for screens. Its open apertures and generous x-height make it readable at small sizes, while its moderate weight contrast gives hierarchy without needing multiple families. One family, three weights, infinite range.

**Character:** Warm, clear, quietly confident. Inter at body size (0.9375rem) reads like a well-set book; at display size (1.5rem) it pins the header without shouting. No compression, no exotic widths, no uppercase body copy.

### Hierarchy

- **Display** (600, 1.5rem, 1.3): The app title "FlowForge". Single color — no gradients, no clipping. Solid terracotta on the warm background.
- **Headline** (600, 1.1rem, 1.4): Section headings in the analytics dashboard. Clear, compact, pinned to its section.
- **Title** (500, 0.95rem, 1.5): Todo item titles. The most important text on the screen; weight distinguishes it from surrounding metadata.
- **Body** (400, 0.9375rem, 1.6): All reading text — descriptions, filter labels, snackbar messages. Max line length 65ch.
- **Label** (500, 0.8125rem, 1.4, letter-spacing 0.01em): Badges, priority tags, timestamps, category pills. Small but not tiny (minimum 13px at 1x scale for readability).

### Named Rules

**The One-Family Rule.** No second typeface enters the system. Weight contrast (400 / 500 / 600) replaces what another family would do. If something needs emphasis, reach for weight or spacing, not a different font.

## 4. Elevation

The system is flat by default. Depth is conveyed exclusively through **tonal layering**: the background at L=97% (light) / L=15% (dark), and surfaces at L=93% (light) / L=20% (dark). That 4–5 point lightness step is the only depth signal.

No drop shadows. No box shadows on cards, buttons, inputs, or modals. The snackbar and focus timer — which need to break out of the page flow — use a tight shadow (`0 2px 8px`, blur limited to 8px) to signal "I am not part of the surface stack," but this is the exception, not the rule.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. The tonal step between background and surface is the only depth signal. Shadows appear in exactly two places — the snackbar and the focus timer — to signal break-out-of-flow. Everywhere else, flat.

## 5. Components

### Buttons

- **Shape:** Medium curve (10px radius). Not pill, not sharp.
- **Primary:** Terracotta background, white text, 10px 20px padding. No border. Hover deepens to accent-hover. Disabled at 50% opacity, no hover change.
- **Ghost (icon buttons):** No background, no border. Text-secondary, hover shifts to accent (for action) or danger (for delete). Used for drag handle, focus, delete, clear search, timer close.

### Chips (Filter chips, priority badges, category badges)

- **Shape:** 12px radius — the largest radius in the system, reserved for small, numerous elements.
- **Default:** Workshop Surface background, Tool Steel text, subtle border at Workbench Edge.
- **Active:** Terracotta background, white text, no border.
- **Size:** Low padding (6–8px horizontal, 2–4px vertical), label font (13px), compact.

### Cards (Todo items, Analytics cards)

- **Shape:** 12px radius.
- **Background:** Workshop Surface. No border. No shadow.
- **Padding:** 16px internal (24px for the add-todo form).
- **Priority treatment:** A full background tint in the priority color at 10% opacity on the card surface — not a side-stripe border. The tint fills the card, subtle enough to read as atmosphere, not decoration.

### Inputs (Text fields, search, selects, date pickers)

- **Shape:** 10px radius.
- **Default:** White background (surface is too close to bg for editability) with a subtle Workbench Edge border. Text at Warm Ink.
- **Focus:** Border shifts to Terracotta. No glow, no ring.
- **Placeholder:** Tool Steel at full opacity (not reduced) to maintain 4.5:1 contrast.
- **Disabled:** 50% opacity, no border change.

### The Snackbar (Undo toast)

- **Shape:** 12px radius.
- **Background:** Dark (L=20%) surface in light mode, light (L=85%) surface in dark mode — the inverse of the page theme, so it reads as a separate layer.
- **Shadow:** The only shadow in the system: `0 2px 8px` at the page's ink color at 15% opacity.
- **Position:** Fixed, bottom 24px, centered. No animation other than a single entrance slide-up.

### The Focus Timer (Pomodoro)

- Same snackbar shadow rule applies (it breaks out of flow).
- Shape: 12px radius. Solid surface background (no glass).
- Timer display: 2.5rem, 700 weight, Terracotta color. Tabular-nums for stability during countdown.

### Navigation (Header)

- Simple horizontal row. App title (Display weight) on the left, actions (theme toggle, import/export) on the right.
- No background of its own — it sits directly on the page background.
- No sticky behavior — the user scrolls the page naturally.

## 6. Do's and Don'ts

### Do

- **Do** use the tonal step (background → surface at L=93%) as the only depth mechanism.
- **Do** use priority colors as full-card background tints at 10% opacity, not as side-stripe borders.
- **Do** keep the accent to ≤10% of any given screen. Terracotta is the brand voice; its rarity is the point.
- **Do** use Inter across the entire UI. One family, three weights (400/500/600), no exceptions.
- **Do** use text-wrap: balance on h1s for even line lengths.
- **Do** test every text color against its background for 4.5:1 contrast.

### Don't

- **Don't** use glassmorphism — no backdrop-filter blur, no semi-transparent backgrounds, no glass-border effects.
- **Don't** use gradient text (`background-clip: text` with a gradient). Single solid color only.
- **Don't** use side-stripe borders (border-left / border-right greater than 1px as a colored accent on cards, list items, or alerts). Use full background tints instead.
- **Don't** pair a 1px border with a box-shadow blur ≥ 16px on the same element. Pick one — and in this system, prefer neither.
- **Don't** exceed 12px border-radius on cards. 10px on inputs and buttons. 12px is the maximum radius outside of chips.
- **Don't** use uppercase for body text, headings, or sentences. Reserve uppercase for short labels (≤4 words) and badges.
- **Don't** use z-index values outside the semantic scale: dropdown (10), sticky header (20), modal backdrop (30), modal (40), snackbar/toast (50), tooltip (60).
- **Don't** animate layout properties (width, height, padding, margin, grid, flex). Use transform and opacity only.
- **Don't** use creating graphics as brand illustrations. Path-based SVG scenes, turbulance filters, and sketchy drawings are prohibited.
