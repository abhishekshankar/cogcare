# Cognition Network — Design direction (Phase 1)

**Status:** Active  
**Date:** 2026-07-31  
**Parent:** [ADR: Cognition Network Phase 1](./2026-07-31-cognition-network-phase-1.md)  
**Primitives:** `src/components/network/networkUi.js`  
**System reference:** `docs/cogcare-design-system/README.md`

## North star

**Core promise:** A trusted circle advancing better cognitive care.

**Restrained institutional confidence** — selective, intellectually serious, invitation-only. Feels like a curated professional directory and private cohort, not a social network, startup landing page, or gamified onboarding flow.

## Token mapping (existing Cogcare only)

No new palette. Map the brief onto shipped tokens:

| Intent | Cogcare token | Usage |
|--------|---------------|--------|
| Deep navy / ink | `text-ink` (`#1A1A1A`) | Headlines, primary text, selected venture chips |
| Institutional teal | `forest-deep` (`#1A3C34`) | Primary CTAs, success accent border, icon emphasis |
| Warm neutral surfaces | `bg-page`, `bg-surface`, `bg-white` | Page, panels, cards — cream on cream, never cold gray |
| Controlled gold accent | `text-clay` (`#A67B5B`) | Eyebrows and micro-labels only — never large fills |
| Muted body | `text-ink-muted`, `text-ink-faint` | Descriptions, hints, footer |
| Borders | `border-border` | Structure without shadow reliance |

**Teal vs gold:** Gold (clay) labels *what section you're in*; teal (forest-deep) marks *what you can do*. Never both at full saturation on the same element.

## Typography (editorial hierarchy)

1. **Eyebrow** — `networkEyebrow`: 10px ALL CAPS, clay, wide tracking  
2. **Display** — `networkDisplayLg/Md/Sm`: Playfair italic, ink, generous line-height  
3. **Section** — `networkSectionTitle`: serif, ink, restrained size  
4. **Body** — `networkBody` / `networkBodySm`: DM Sans, ink-muted, relaxed leading  
5. **Caption** — disclaimers, hints, footnotes — ink-faint

Avoid stacking more than three levels in one viewport. Whitespace carries hierarchy as much as size.

## Layout & motion

- **Whitespace:** Section padding `py-20`–`py-28`; card padding `p-6 sm:p-8`; form stacks `space-y-8`
- **Width:** Founding `max-w-5xl`; invite journey `max-w-2xl` — narrow, editorial column
- **Shadows:** Prefer border-only cards; no `shadow-brand-sm` on network surfaces unless elevation is essential
- **Motion:** `transition-colors` on buttons only; `motion-safe:animate-spin` for loaders; no gradients, parallax, counters, or progress gamification
- **Reduced motion:** Global `prefers-reduced-motion` rules in `src/index.css` apply

## Component patterns

| Pattern | Class / module |
|---------|----------------|
| Page shell | `networkPage` |
| Card | `networkCard` + `networkCardPad` |
| Muted panel | `networkPanel` |
| Success / signed-in | `networkSuccessPanel` (teal left rule, surface fill — not bright green) |
| Primary CTA | `networkPrimaryBtn` (`bg-forest-deep`) |
| Secondary CTA | `networkSecondaryBtn` (border, white) |
| Consent block | `networkConsentBox` |
| Form field | `networkLabel` + `networkInput` |

## Voice (unchanged)

Directory information only. No manufactured urgency — ethical scarcity only (paced welcomes, never countdowns or arbitrary deadlines). No “join the community,” no implied endorsement. Passive participation is valid.

## Anti-patterns

- Bright sage `#B8D9C1` success floods, hero gradients, drop shadows on every card  
- `bg-forest` mid-green as default CTA (use `forest-deep` for institutional weight)  
- Social patterns: avatars-first, follower counts, activity feeds, streaks, badges  
- Gamified onboarding: steppers, % complete, confetti, “level up”  
- Flashy illustration, emoji, or stock “diverse team high-five” imagery  

## Phase 2 extensions

Same primitives — member directory as bordered cards + clay eyebrows; Brevo invite email in Playfair + ink header band; no new accent colors.

## File map

- **Primitives:** `src/components/network/networkUi.js`
- **Pages:** `src/pages/NetworkFoundingPage.jsx`, `NetworkInvitePage.jsx`
- **Components:** `src/components/network/*`
- **Copy:** `lib/networkIntro.js`, `src/lib/consultantVisibility.js`
