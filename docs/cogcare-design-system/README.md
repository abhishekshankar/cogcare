# CogCare Design System

## About the Company

**CogCare** (cogcare.org) is a nonprofit devoted to brain health and the prevention of degenerative brain diseases — primarily dementia and Alzheimer's. Their physicians were trained at UCLA, Mayo Clinic, Penn, Harvard, and other leading institutions. The core thesis: nearly 40% of dementia cases can be prevented or delayed through modifiable lifestyle factors.

**Mission:** Make high-end cognitive care a universal standard — across every community, income level, and background.

## Products

| Product | Description |
|---|---|
| **Marketing Website** | Public-facing site at cogcare.org — includes education, blog, donation, and the Brain Health Index (BHI) quiz flow |
| **Member Dashboard** | Authenticated member area — Brain Credit Score, test history, consultant booking, account settings |

**Source repo:** `abhishekshankar/cogcare` (Vite + React, Tailwind CSS v4, AWS Amplify Gen 2, Lucide React icons)

---

## Content Fundamentals

### Voice & Tone
- **Warm clinical authority** — sounds like a trusted doctor who also cares about you as a person
- **Hopeful, not alarming** — reframes dementia as *modifiable*, not inevitable
- **Inclusive & equitable** — explicitly addresses disparate impact on Black and Hispanic communities
- **Empowering** — "your brain is resilient," "it is never too late"

### Casing & Formatting
- **Navigation / labels:** ALL CAPS with wide letter-spacing (e.g. `BRAIN CREDIT`, `MY TESTS`, `BEGIN ASSESSMENT`)
- **Headings:** Sentence case, serif italic for emphasis (e.g. *"Dementia is Modifiable."*)
- **Body:** Sentence case, conversational, light weight
- **Numbers / stats:** Used sparingly and boldly (e.g. "40%", "300–850")

### Copywriting Style
- Short, declarative headlines — often a single sentence ending with a period
- Italicized key words within headings for emphasis (*Modifiable.*, *Differentiate.*)
- Captions use UPPERCASE SMALL TRACKING labels before the main content
- "Get Inside" instead of "Sign In" on hero nav — reveals brand personality
- Scientific credibility cues: institution names, percentages, "evidence-based"
- No emoji anywhere — brand is serious, not playful
- "I" is avoided in brand copy; second person "you/your" dominates

### Example Phrases
- *"Dementia is Modifiable."*
- *"Dementia Does Not Differentiate."*
- *"Evidence-Based Cognitive Wellness"*
- *"A modern boutique initiative for brain longevity."*
- *"Cognitive Care Alliance is a 501(c)(3) organization."*

---

## Visual Foundations

### Color Palette
See `colors_and_type.css` for full token definitions.

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FDFBF7` | Page background — warm off-white, like high-quality paper |
| `--color-surface` | `#F3EFE9` | Card surfaces, form backgrounds, hero badges |
| `--color-border` | `#E8DCC4` | All borders — warm tan, never cool gray |
| `--color-forest` | `#3D4B3E` | Primary brand color — deep forest green; buttons, headings, nav |
| `--color-forest-dark` | `#2D382D` | Hover state for forest elements |
| `--color-forest-deep` | `#1A3C34` | Darkest green — gradient anchors |
| `--color-forest-mid` | `#4A7C59` | Mid green — accent gradients |
| `--color-clay` | `#A67B5B` | Secondary accent — warm terracotta/clay; labels, icons, highlights |
| `--color-ink` | `#1A1A1A` | Primary text |
| `--color-ink-muted` | `rgba(61,75,62,0.7)` | Secondary text (forest-tinted muted) |
| `--color-white` | `#FFFFFF` | Card fills, overlays |

**Color vibe:** Earthy, grounded, warm. Never cool blues or purples. Palette evokes forest, soil, clay pots, aged paper. Imagery uses a subtle `#3D4B3E/5` multiply overlay to tint photos green.

### Typography
- **Display serif:** Playfair Display (substituting for the browser default serif used in code). Italic weight is used for brand emphasis.
- **Body / UI sans:** DM Sans — clean, modern, humanist. Not geometric or cold.
- **Monospace:** Not used in UI; only in code examples in docs
- **Scale:** Extremely large headings (up to `8xl` / 6rem+). Body is 16–20px. Labels are 9–11px ALL CAPS with wide tracking.

See `colors_and_type.css` for font imports and all CSS custom properties.

### Spacing & Layout
- Max content width: `max-w-7xl` (1280px) for marketing, `max-w-5xl` (1024px) for dashboard
- Generous vertical rhythm — section padding `py-16 sm:py-24 md:py-32`
- Horizontal padding: `px-4 sm:px-6`

### Backgrounds
- Background is **never pure white** — always the warm `#FDFBF7` cream
- Cards use `bg-white` (pure white) to float off the cream background
- Full-bleed photography with bottom-to-top gradient vignettes for text legibility
- No repeating patterns, no heavy gradients as page backgrounds
- Glass panels: `bg-white/40 backdrop-blur-md` — used for the BHI start card on hero

### Glassmorphism
Used deliberately in hero section and modals:
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.3);
```
Dark glass variant: `background: rgba(26, 60, 52, 0.8)` — forest green tinted

### Corner Radii
Very generous — a defining visual trait:
- `rounded-xl` (12px) — form inputs, small tags
- `rounded-2xl` (16px) — cards, panels
- `rounded-3xl` (24px) — dialogs, large cards
- `rounded-[2rem]–[4.5rem]` (32–72px) — hero image frame, feature cards, CTA panels
- `rounded-full` — all buttons, pills, badges, avatars

**Rule:** The larger the element, the larger the radius. Never sharp corners on interactive elements.

### Shadows
Custom shadow system (in `src/index.css`) named `shadow-elegant`:
- `sm`: subtle `rgba(26,60,52,0.05)` — cards at rest
- `lg`: `rgba(26,60,52,0.10)` — hover cards
- `xl/2xl`: `rgba(26,60,52,0.10–0.15)` — modals, floating elements
Shadow color is always the forest green tint, never neutral gray.

### Borders
- `1px solid #E8DCC4` — standard border; warm tan
- `1px solid rgba(255,255,255,0.3)` — glass borders
- `1px dashed #E8DCC4` — empty state borders
- No colored left-border accent cards

### Animations
- Modal panel: slides in from right (`translateX(100%) → 0`) over 700ms ease-out
- Modal backdrop: fade in over 700ms ease-out
- Hover cards: `transition-all duration-700` — slow, deliberate
- Image hover: `scale-110` over 1500ms — very slow zoom
- Float animation: 3s ease-in-out infinite (decorative elements)
- General UI transitions: `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (ease-smooth) or `0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)` (bounce)
- **No abrupt transitions** — everything transitions, nothing snaps

### Hover / Press States
- **Buttons:** `hover:bg-[#2D382D]` for primary; `hover:bg-[#F3EFE9]` for ghost/outlined
- **Links / nav:** `hover:opacity-60` — opacity fade, not color change
- **Cards:** border darkens + shadow elevates + slow image scale
- **Icon buttons:** background tint appears on hover
- **Press:** No shrink animation used; relying on browser default active state

### Imagery
- Photography used for hero portrait and feature cards
- **Color treatment:** slight desaturation `grayscale-[0.05]` + forest green multiply overlay
- Warm-toned photos preferred (skin tones, nature, community)
- Portrait orientation for hero photo (4:5 ratio)
- No illustrations, no hand-drawn assets in current codebase

---

## Iconography

**System:** [Lucide React](https://lucide.dev) — consistent stroke-weight icons (strokeWidth 1.5 for brand icons, default 2.0 for UI icons)

**Key icons used:**
| Icon | Usage |
|---|---|
| `Brain` | Brand logo mark — appears in header and dashboard nav |
| `ArrowRight` | CTAs, "next step" actions |
| `ArrowUpRight` | External links, "explore" on cards |
| `Sparkles` | "Evidence-based" badge on hero |
| `X` | Close buttons on modals |
| `LogOut` | Sign out in dashboard |
| `Settings2` | Settings tab |
| `ChevronRight` | List item disclosure |
| `Download` | Export actions |
| `Trash2` | Delete actions |

**Usage rules:**
- Brain icon is always `text-[#A67B5B]` (clay/terracotta) with `strokeWidth={1.5}`
- Navigation icons are inline with text, `h-3.5 w-3.5` to `h-5 w-5`
- No icon-only buttons without aria-labels
- No emoji used anywhere — Lucide icons replace any potential emoji usage
- Icons are never filled; always stroke style

**Assets directory:** `assets/` — see below for logos and visual assets

---

## Files Index

```
README.md                    ← This file
colors_and_type.css          ← Full CSS custom properties: colors, typography, shadows
SKILL.md                     ← Agent skill descriptor

assets/
  cogcare-logo.svg           ← Wordmark SVG (Brain icon + CogCare.org text)
  hero-bg.png                ← Hero background image from Cogcare 3.0

preview/
  colors-brand.html          ← Brand color swatches
  colors-semantic.html       ← Semantic color usage
  type-display.html          ← Display / serif type specimens
  type-body.html             ← Body and UI type specimens
  type-labels.html           ← Label / caption styles
  spacing-tokens.html        ← Border radius + shadow tokens
  components-buttons.html    ← Button variants
  components-forms.html      ← Form inputs and fields
  components-cards.html      ← Card variants
  components-badges.html     ← Badges, pills, labels
  components-nav.html        ← Navigation patterns

ui_kits/
  app/
    README.md                ← UI kit notes
    index.html               ← Interactive dashboard prototype
    components.jsx           ← Shared components
    DashboardPage.jsx        ← Dashboard shell + tabs
    HomePage.jsx             ← Marketing homepage
    LoginPage.jsx            ← Auth flow
```
