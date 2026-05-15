# DESIGN.md — Acephalt Diligence Workspace

> Design direction for `demos/acephalt`. Credibility first, polish second.
> Last revised: 2026-05-15

---

## Register

This is a **product-register interface**, not a marketing page. The viewer is a finance operator with a strong bullshit detector. Every design decision should be defensible as a tool choice, not a taste choice. Avoid anything that reads as "I made this to show I can design." It should read as "this person understood the workflow well enough to build it."

The correct mental model: an internal prototype that has been cleaned up once but not over-polished.

---

## Users

**Primary.** Nicolas Frendo (or equivalent Acephalt decision-maker). Finance and product instincts. Evaluating whether the builder understood a real diligence trust-boundary problem. Will scan the interface for about 90 seconds before forming a judgment. The trigger for a second look is one concrete moment of "this person thought about enforcement, not just UI."

**Secondary.** Riipen admin, startup operator, or engineer. Evaluating whether the work is unusually thoughtful relative to the cohort. Less finance context; more attuned to whether the product framing is specific or generic.

Neither user is a casual consumer. Neither wants to be delighted. Both want to be convinced.

---

## Scene

The demo has two screens:

1. **Data room index.** Deal header, role posture bar, top access hotspots, document table.
2. **Document detail.** Document header, cross-role comparison strip, compliance banner (conditional), field grid.

The persistent chrome is: sticky TopBar → AuditRibbon → page content → Footer.

The scene is a **reviewer opening a diligence room for the first time.** They set their role, see what they can access, and drill into one document to see the field-level policy in action. The product thesis becomes legible in that sequence. No other scene is needed.

---

## Theme Decision

**Dark, cool-leaning neutral.** Background is `#060912` (near-black navy, not pure black). The slight blue bias keeps it from reading as generic developer dark mode. It reads as deliberate.

The background grid (`rgba(148,163,184,0.06)` lines at 56px) is the right call: it adds visual texture without weight, and it signals "tool" rather than "website." Keep it.

The radial gradient at the top (`rgba(30,58,138,0.18)`) is a soft depth cue. It works. Keep it.

Do not add any other ambient light, glow, or background decoration.

---

## Color Strategy

Color in this interface has **one job**: signal trust posture by role. Use it only for that.

### Role accent palette

| Role | Token | Hex | Meaning |
|-|-|-|-|
| Investor Analyst | `--role-investor` | `#60a5fa` | Active, high-access, lender-side |
| Compliance Reviewer | `--role-compliance` | `#f59e0b` | Full access, audit cost |
| External Counterparty | `--role-counterparty` | `#94a3b8` | Narrow access, bilateral only |

The investor-blue / compliance-amber / counterparty-slate system is semantically correct. Blue = operational decision-maker. Amber = risk and oversight. Slate = limited, external. Do not change these.

### Surface palette (slate scale)

All surfaces stay within the slate scale. The nesting depth maps to:

| Layer | Color | Notes |
|-|-|-|
| Page background | `#060912` | Defined in `:root` |
| Primary card | `slate-900/40` | Slightly lifted from page |
| Secondary card | `slate-950/35` | Recessed, secondary content |
| Borders | `slate-800` | Single line, no glow |
| Header cell / chrome | `slate-950/70` | Persistent UI elements |

Never use opacity-heavy white or arbitrary dark values outside this scale. Consistency in surface nesting is what makes the interface feel system-built rather than hand-styled.

### Redaction color

- **Visible badge**: no color. Text `slate-500` "Visible" label is correct.
- **Redacted badge**: amber treatment (`amber-950/40` bg, `amber-300` text) is correct — it reads as "cost" not "error."
- **Fully redacted document icon**: `Lock` icon in `slate-400` is correct. Do not add a color accent here.
- **Redaction reason text**: currently styled as italic `slate-400`. This is wrong (see What to Change Next).

### Compliance amber is semantic, not decorative

The amber tone on the compliance role must read as "this is a different operating mode" — elevated obligation, not just a different tab. The compliance watermark and session banner both lean on amber. That is correct and must be maintained or strengthened.

---

## Typography

### Stack

Geist Sans (display and body) + Geist Mono (data, IDs, counters). This is the right choice. Geist Sans reads professional without being corporate. Geist Mono grounds numeric values in data reality. Do not switch or supplement.

### Scale in use

| Context | Size | Weight | Tracking |
|-|-|-|-|
| Page title (deal codename) | `text-[28px]` | `semibold` | `tracking-tight` |
| Section heading | `text-sm` | `semibold` | default |
| Field label | `text-xs` | `semibold` | `tracking-wider` `uppercase` |
| Body / description | `text-sm` | regular | default |
| Micro-label (metadata key) | `text-[10px]`–`text-[11px]` | regular | `tracking-[0.16em]`–`tracking-[0.18em]` |
| Data value | `text-sm` | regular | `font-mono tabular-nums` |
| Ribbon / audit chrome | `text-xs` | regular | `tracking-wider uppercase` |

Inline `tracking-[0.18em]` values are used throughout for micro-labels. These are correct in concept but fragile in execution. Consolidate them to three values: `tracking-wider` (default utility), `tracking-[0.16em]` (field key), `tracking-[0.18em]` (nav-chrome). Never go wider than `[0.18em]`.

### Typographic rules

- Uppercase + wide tracking is reserved for metadata keys, ribbon labels, and navigation chrome. Not for body copy.
- `font-mono tabular-nums` on any numeric that changes by role or state. This prevents layout shift during role switch.
- Section headings should be `text-sm font-semibold`, not `text-base`. This is a dense tool, not a consumer app.
- Never bold a whole paragraph.

---

## Layout Rules

### Max-width

- Data room index: `max-w-[1400px]`
- Document detail: `max-w-[1100px]`
- Ribbon and TopBar: `max-w-[1400px]`

This asymmetry is intentional. Document detail is narrower because it is a reading surface. Keep it.

### Padding

Horizontal: `px-4 sm:px-6 lg:px-8`. Apply consistently. Do not vary within a section.

### Vertical rhythm

Sections are separated by `mt-4` (tight relationship) or `mt-6` (new topic). Cards use `py-4` / `py-3` interior spacing.

Use `mt-4` between related sections (deal header → posture bar → hotspots). Use `mt-6` when introducing the document table or a distinct new content area.

### Card anatomy

Every card follows: `rounded-lg border border-slate-800 bg-slate-950/[x]`.

Sub-sections within a card are separated by `border-b border-slate-800`, never by margin alone. This signals that content is structured, not arbitrary.

Header rows (section title + right-aligned metadata) use `flex items-center justify-between`. Never center-align section headers.

### Grid

The document table uses a 12-column grid with `sm:grid-cols-12`. The `5 / 2 / 2 / 2 / 1` column split (document / type / date / sensitivity / access) is good. The rightmost access column is undersized and the `-N` amber count is easy to miss. See What to Change Next.

---

## Information Hierarchy

### Page-level priority order (data room index)

1. **Deal identity** — codename, borrower, facility, size. The viewer needs to orient immediately.
2. **Active role posture** — what this reviewer can and cannot see. The left accent stripe makes this scannable.
3. **Top access hotspots** — where the trust model is most restrictive for this role. This is the primary thesis surface. It must never feel like a sidebar.
4. **Document table** — the operational list. A reviewer would work through this after understanding the posture.

This order is correct. Do not reorder or collapse sections.

### Page-level priority order (document detail)

1. **Document identity and access summary** — what doc, sensitivity, how many fields are visible for this role.
2. **Cross-role comparison strip** — the three-role breakdown. This is the most intellectually important surface on the page.
3. **Compliance session banner** (conditional, compliance reviewer only) — full-width, high-contrast.
4. **Field grid** — the actual content. Redacted and visible fields interleaved.
5. **Audit posture block** — context and explanation. Secondary. Not the thesis.

### Within a field card

Visible field priority: label → value → (watermark stamp if compliance).
Redacted field priority: **label → redaction reason → hatch placeholder.**

The redaction reason is currently treated as a footnote. It is not. The reason IS the policy. It should read as primary content, not italicized subtext.

---

## Motion Rules

### Permitted

- `field-fade` (`fade-in` 220ms ease-out) on role switch. This communicates state change without distraction. Keep it.
- `transition-colors` on interactive elements (document rows, field card borders). 150ms default.
- Radix Dialog open/close: `fade-in` + `zoom-in-95` at 200ms. Appropriate.

### Banned

- No translate-Y animations on page load content.
- No shimmer, skeleton, or pulse animations (there is no loading state worth simulating).
- No entrance animations on cards that are always present.
- No parallax or scroll-driven effects.
- No spring-physics or overshot easing.

Motion must be functional: it signals "something changed" or "something opened." If it does neither, it does not belong.

---

## Anti-Pattern Bans

These patterns are explicitly prohibited. If any of these appear in a PR, reject on sight.

| Pattern | Why |
|-|-|
| Generic fintech-dark gradient (blue-to-purple radial blobs) | Reads as AI assistant or crypto UI |
| KPI cards with large centered numbers | Wrong register — this is a tool, not a dashboard |
| Vague "AI-powered" or "intelligent" copy | Not the thesis |
| Animated skeleton loaders | No async data, no loading states |
| Full-width color banners on every page | Only the compliance session banner earns that treatment |
| Nested cards more than 2 levels deep | Signals over-engineering |
| Icon + label duplication (icon that is already labeled) | Use one or the other |
| Tooltip-only information | Any policy-relevant information must be visible without hover |
| Fake timestamps with rounded times (e.g. "09:00:00") | Session-stamped times must reflect actual render time |
| Emoji in any UI copy | Wrong register entirely |
| "Powered by" branding for any third-party service | Not the story |

---

## Component and Surface Rules

### TopBar

The three-dot logo (grid of role-colored circles) is the right metaphor: three roles, three trust zones. Keep it.

The subtitle "Project Cedar / role-aware access mock" is good — it is honest framing without being self-deprecating.

`RoleSwitcher` using `role="radiogroup"` and `←→` keyboard navigation is correct. The keyboard affordance hint in the top bar is subtle enough to not be distracting while rewarding curious users.

Do not add navigation links, search, or notification bells to the TopBar. It should remain: logo / subtitle + role switcher.

### AuditRibbon

Current state: renders active role, redaction count, last viewed doc, session open time, policy version, session ID.

This is the right set of signals but they are all treated with equal visual weight. Priority should be:

1. **Role + dot** — leftmost, always. The dot is the primary visual anchor.
2. **Redaction count** — immediately after. The fraction `N/M` should read as a status gauge.
3. **Session / policy** — secondary. Smaller or dimmer than the above.
4. **Last viewed doc** — context, not primary. Truncate aggressively.

The ribbon should never feel like a status bar that you ignore. It is the visible artifact of a real audit log. When a document is opened, the "last doc" field should update. That update is meaningful — it is a simulated access stamp. Consider adding a brief color flash (`opacity` transition) on the "Last doc" segment on each update.

The `openedAt` timestamp is rendered once on mount. This is intentional and correct — it represents "session opened." It should be labeled "Session opened" not "Opened" to avoid confusion with per-document access time.

### Posture Bar (active role section on index)

The left-edge colored accent stripe on the posture bar is the right way to key a section to a role. This pattern could be used more consistently.

The `{redacted}/{totalFields} fields redacted` display is good. Consider making it tabular so the fraction width is stable across roles.

### Access Hotspots

The header has both "Where this role hits trust boundaries" (h2) and "Top access hotspots" (trailing label). These are redundant. Use only the h2 — it is more specific and more interesting.

Each hotspot card shows: document title, `visible/total`, badge with hidden count, and first redaction reason. This is the correct information but the reason text is too small and too muted. It is the interesting part. Treat it as body text, not a caption.

### DocumentRow

The `{visible}/{total}` fraction in the rightmost column with `-N` amber count is the access fingerprint per row. This is a good pattern but visually fragile. The amber `-N` can read as a formatting artifact. Consider rendering it as a proper badge or as the leading element.

The three-line document cell (title / source party / first redaction reason) is good. The "Fully visible for this role." green text for unrestricted documents is a useful positive signal — do not remove it.

### RedactedField

**The single most important thing to fix in the whole interface.**

Currently: redaction reason is `text-xs italic text-slate-400`. This reads as a tooltip, not a policy statement.

The reason IS the access policy. It answers: "why is this field not visible to this role?" That answer should be the most prominent thing in the redacted card body. Treat it as `text-sm text-slate-200` with no italic. The hatch placeholder is purely visual — it communicates "content exists but is hidden." The reason communicates "why." Elevate the reason.

Visible fields in compliance-reviewer mode carry the watermark SVG overlay. This is the right concept. The opacity values (`0.14`–`0.22`) are currently too low to read clearly. The watermark should be visually present — not loud, but intentional.

The field label in the card header uses `text-xs font-semibold uppercase tracking-wider`. This is correct. Do not change it.

### Cross-Role Comparison Strip (document detail)

This is the best single surface in the demo. It shows all three roles' access fractions for the active document on a single pass. This makes the thesis legible without role-switching.

Currently, all three cards look nearly identical except the active card has `border-slate-600` vs `border-slate-800`. This difference is too subtle.

The active card should carry the role accent color as its left accent stripe (matching the posture bar pattern). The other cards should be visibly more recessed. The contrast between active and inactive makes clear that the viewer IS one role and can SEE the others.

### Audit Posture Block (bottom of document detail)

Currently a plain text box. It reads as an explanation, not an artifact. That is the wrong register. It should feel like a system note — a structured log entry, not prose.

Consider: monospace font, label-value pairs, a subtle border-left accent. Something that reads as "the system generated this," not "the designer wrote this."

---

## What to Change Next

Priority order. Each item is a discrete, contained change — not a feature addition.

### 1. Elevate redaction reason text in `RedactedField`

**File:** `src/components/RedactedField.tsx`

The `reason` text in `RedactedBody` is currently `text-xs italic text-slate-400`. Change to `text-sm text-slate-200 not-italic leading-relaxed`. Optionally prefix with a small lock icon to signal "policy gate." The hatch placeholder stays below the reason. This single change makes the field-level policy argument legible.

### 2. Add role-accent left stripe to the active card in the cross-role comparison strip

**File:** `src/app/document/[id]/page.tsx` (the `ROLES.map` section)

For the active card, add `relative overflow-hidden` and the same `absolute inset-y-0 left-0 w-0.5` accent bar used in the posture bar, colored with `ROLE_ACCENT[role]`. This makes the current role visually anchored in the comparison context rather than distinguished only by border shade.

### 3. Strengthen the compliance watermark opacity

**File:** `src/app/globals.css`, `.compliance-watermark` SVG data URL

Increase fill opacity on "COMPLIANCE REVIEW" text from `0.18` to `0.28`. Increase stroke opacity from `0.22` to `0.32`. The watermark should be clearly present to anyone reading the field content — it is the price of full access and must read as deliberate.

### 4. Clarify AuditRibbon label hierarchy

**File:** `src/components/AuditRibbon.tsx`

- Rename "Opened" label to "Session opened" to clarify it is session-scoped, not per-document.
- Dim the "Session" and "Policy" items relative to "Active role" and "Redactions." The role and redaction count are state-bearing; the session ID and policy version are context.
- Apply `text-slate-300` to role label and redaction count; `text-slate-400` to policy and session.

### 5. Fix the access column in the document table

**File:** `src/components/DocumentRow.tsx`

The rightmost column `{visible}/{total}` + amber `-{redacted}` is hard to parse. Replace with two tokens: a `{visible}/{total}` fraction in `slate-400` and, if `redacted > 0`, a small Badge with tone `"warning"` showing `{redacted} hidden`. This matches the language already used in the hotspots section and makes the access state immediately legible.

### 6. Consolidate the hotspot section header

**File:** `src/app/page.tsx` (the hotspots section)

Remove the trailing `<span>Top access hotspots</span>` label. It duplicates the `h2`. The h2 "Where this role hits trust boundaries" is more specific and more interesting. Keep only that.

### 7. Rewrite the audit posture block as a structured artifact

**File:** `src/app/document/[id]/page.tsx` (the audit posture `div` at bottom)

Change from prose paragraph to a label-value list in `font-mono text-xs`. Include: field count, policy version (imported from ribbon or mockData), the redaction engine function name as the policy source reference, a note about production enforcement surface. Render it inside a container with `border-l-2 border-slate-700 pl-4`. This makes it read as a system-generated log entry rather than a designer footnote.

---

## What Not to Change

- The three-role model and their color assignments
- The redaction-hatch diagonal pattern for redacted placeholders
- The compliance watermark concept (just strengthen it)
- The `evaluateField()` single-source-of-truth architecture
- The cross-role comparison strip (just strengthen active state)
- The access hotspots section (just clean up the redundant label)
- The Geist stack
- The background grid and radial gradient
- The `field-fade` animation on role switch
- The mock data — it is specific and credible; do not simplify it
- The honest concept disclaimer in TopBar subtitle and BRIEF.md

---

*This document is a working design directive. It describes the current state and the next pass. It is not a rebrand.*
