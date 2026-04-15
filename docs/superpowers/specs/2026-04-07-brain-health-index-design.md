# Brain Health Index — Design Spec
**Date:** 2026-04-07
**Branch:** feature/cogcare-3-frontpage
**Status:** Approved

---

## Overview

Port the existing CCA dementia assessment (17-question Likert-scale quiz + differential diagnosis report) from the `main` branch into the `feature/cogcare-3-frontpage` branch as a **Brain Health Index** feature. Style it using Microsoft Fluent 2 (`@fluentui/react-components`) and match CogCare 3.0's editorial design language.

---

## Scope

**In scope:**
- 17-question quiz (ported from `CCAQuiz`)
- Results report (ported from `CCAReport`, simplified — no caregiver data)
- Scoring logic (`computeResults`)
- Fluent 2 component styling
- Slide-in overlay entry pattern

**Out of scope:**
- Caregiver form (`CCACaregiver`) — deferred
- Backend persistence or user accounts
- Email/share results functionality

---

## Architecture

### State (in `App.jsx`)
Add three state values to the existing `App` component:
```js
const [showQuiz, setShowQuiz] = useState(false)
const [quizAnswers, setQuizAnswers] = useState({})
const [quizResults, setQuizResults] = useState(null)
```

Wire the existing "Begin Assessment" button (`src/App.jsx:159`) to `setShowQuiz(true)`.

### New file: `src/BrainHealthIndex.jsx`
All new components live here. Keeps `App.jsx` clean.

Exports one component: `<BrainHealthIndex />` which receives:
```js
{
  open: boolean,
  onClose: () => void,
  quizAnswers: object,
  setQuizAnswers: fn,
  quizResults: object | null,
  setQuizResults: fn,
}
```

### FluentProvider
Wrap only the `BrainHealthIndex` overlay in `FluentProvider` with a custom Fluent 2 theme matching CogCare colors. Do not wrap the entire app — avoids style conflicts with existing Tailwind classes.

---

## Components

### `BrainHealthIndex` (overlay shell)
- Slide-in panel from right, 58% viewport width on desktop, full-width on mobile
- Animation: matches existing card modal CSS (`animate-modal-panel` / `animate-modal-backdrop`)
- Backdrop: `rgba(61,75,62,0.5)` — clicking it calls `onClose`
- ESC key calls `onClose`
- Manages internal step: `'quiz'` → `'report'`
- When `quizResults` is set, switches to report view automatically
- Close (X) button top-right of panel

### `BHIQuiz`
- Renders one question at a time (current question index in local state)
- Question text: italic serif, `#1A1A1A`, `text-2xl`
- Domain label: small uppercase `#A67B5B`
- Answer options: Fluent 2 `RadioGroup` + `Radio` components, custom tokens for selected state (`#3D4B3E`)
- Progress: Fluent 2 `ProgressBar` with `#A67B5B` fill
- Step counter: "Question 3 of 17"
- Navigation: Fluent 2 `Button` (Back / Next / View Results)
- "Next" disabled until an answer is selected
- On final question: calls `computeResults(quizAnswers)`, sets `quizResults`

### `BHIReport`
- Header: "Your Brain Health Index" in large italic serif
- Urgency badge: HIGH / UNCERTAIN / LOW — color-coded (red / amber / green)
- Differential probability section: horizontal bar per differential (bvFTD-Probable, EOAD Pattern, Late-Onset Depression, Mixed/Uncertain, Normal Aging) using Fluent 2 `ProgressBar` with each differential's color
- Domain scores section: 6 domain pills (Social Cognition, Disinhibition, Compulsive Behaviors, Apathy, Executive Function, Mood/Affect) using Fluent 2 `Badge`
- Footer CTA: Fluent 2 `Button` — "Start Over" (resets answers + results, returns to quiz step)

---

## Data (ported from `main`)

Port these verbatim from `src/App.jsx` on `main`:
- `computeResults(answers)` — scoring function
- `CCA_QUIZ_QUESTIONS` — 17 question objects `{ text, domain }`
- `CCA_LIKERT` — `["Not at all", "Rarely", "Sometimes", "Often", "Almost always"]`
- `CCA_GLOBAL_SCALE` — `["No change", "Mild decline", "Moderate decline", "Significant decline", "Severe decline"]`

Question 17 (index 16) uses `CCA_GLOBAL_SCALE`; all others use `CCA_LIKERT`.

---

## Visual Design

| Element | Value |
|---|---|
| Panel background | `#FDFBF7` |
| Primary text | `#1A1A1A` |
| Brand green | `#3D4B3E` |
| Accent terracotta | `#A67B5B` |
| Border/divider | `#E8DCC4` |
| Question font | Serif, italic |
| UI font | System sans-serif (Fluent default) |
| Panel width | 58vw desktop, 100vw mobile |
| Border radius | `2.5rem` top-left on panel |

### Fluent 2 custom theme tokens
```js
{
  colorBrandBackground: '#3D4B3E',
  colorBrandBackgroundHover: '#4a5c4b',
  colorBrandBackgroundPressed: '#2c3b2d',
  colorNeutralBackground1: '#FDFBF7',
  colorNeutralStroke1: '#E8DCC4',
}
```

---

## Dependencies

```bash
npm install @fluentui/react-components
```

No other new dependencies.

---

## File Changes

| File | Change |
|---|---|
| `src/App.jsx` | Add 3 state vars, wire Begin Assessment button, import + render `BrainHealthIndex` |
| `src/BrainHealthIndex.jsx` | New file — all quiz/report components + data |
| `package.json` | Add `@fluentui/react-components` |

---

## Out of Scope (future)
- Caregiver observations form
- Save/share results
- Routing (`/assessment` URL)
- Analytics/tracking
