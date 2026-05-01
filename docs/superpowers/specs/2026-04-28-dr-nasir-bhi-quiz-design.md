# Dr. Nasir Brain Wellness Quiz — Design Spec
**Date:** 2026-04-28
**Branch:** feature/cogcare-3-frontpage
**Status:** Approved

---

## Overview

Replace the current caregiver BHI quiz (13 questions, AD8-inspired) with Dr. Imaad Nasir's
Brain Wellness Quiz (14 questions, 0–4 Likert scale). The quiz remains caregiver-facing —
questions are grammatically adapted to third-person ("[name]" substitution). The overlay
shell, progress bar, analyzing screen, email/share flow, Dr. Nasir CTA, and care pathway
sections are unchanged. Scoring and report result cards are replaced to reflect Dr. Nasir's
phenotype model.

**Scope:** `src/BrainHealthIndex.jsx` + `src/components/BHIReportContent.jsx`

---

## Quiz Questions

Opening questions (unchanged from current):
- Q-name: text — "What is your loved one's first name?"
- Q-age: number — "How old are they?"
- Q-relation: choice — "What is your relationship to them?"

Then Dr. Nasir's 14 questions follow in four named sections (shown in the domain badge):

### Section 1 — "How [name]'s Brain Feels" (Q1–Q5)
Scale: 0=Not at all · 1=A little · 2=Somewhat · 3=Often · 4=Almost always

| ID | Question |
|----|----------|
| q1 | How often does [name] seem foggy, slowed down, or "not as sharp" as usual? |
| q2 | How often does low energy make it harder for [name] to think or function? |
| q3 | How often does [name] experience head pressure, tightness, or headaches? |
| q4 | How often does [name] struggle to stay focused or get easily distracted? |
| q5 | How often does [name] seem scattered, overwhelmed, or disorganized? |

### Section 2 — "Stress, Mood & Autonomic" (Q6–Q8)
Same 0–4 scale.

| ID | Question |
|----|----------|
| q6 | How often does [name] seem keyed-up, tense, or on edge? |
| q7 | How often does [name] experience palpitations, sudden dips in energy, dizziness, heat intolerance, or shakiness? |
| q8 | How often is [name]'s sleep light, unrefreshing, or disrupted? |

### Section 3 — "Balance & Sensory" (Q9–Q10)
Same 0–4 scale.

| ID | Question |
|----|----------|
| q9 | Does [name] get dizzy, off-balance, or sensitive to busy environments or fast movements? |
| q10 | How often does [name] have trouble finding words, remembering names, or recalling information quickly? |

### Section 4 — "Optional — Fine-Tune the Profile" (Q11–Q14)
Each question has a **Skip** button. Skipped questions are excluded from cluster averages.

| ID | Scale | Question |
|----|-------|----------|
| q11 | 0–4 standard | Do [name]'s symptoms get worse after mental or physical activity? |
| q12 | 0–4 standard | Is [name] sensitive to noise, screens, bright lights, or crowded spaces? |
| q13 | time-based (see below) | How long can [name] stay mentally sharp before performance drops? |
| q14 | 0–4 standard | Does [name] seem more emotionally reactive or less steady than usual? |

**Q13 time-based scale:** 0=Hours · 1=60 mins · 2=30 mins · 3=10 mins · 4=Almost immediately

---

## Scoring

All cluster scores are the arithmetic mean of their constituent items (answered only).

```
NIF  = avg(q1, q2, q3, q11*, q12*)   — Brain Energy & Clarity
COG  = avg(q4, q5, q10, q13*)        — Focus & Thinking
AUX  = avg(q6, q7, q8)               — Stress & Nervous System
VEST = avg(q9, q12*)                  — Balance & Senses
GSI  = avg(all answered items)        — Global Severity Index
```
`*` = excluded from average if skipped

### Phenotype Assignment (evaluated in order)

1. **Severe Deficit** — `GSI >= 2.5` AND `>=4 items scored >=3` AND (`COG>=3` OR `NIF>=3` OR `VEST>=3`)
2. **Longevity/Performance** — all four clusters `< 2.5`
3. **Primary = highest cluster**:
   - NIF highest → **Neuroinflammatory**
   - COG highest → **Cognitive-Phasic**
   - AUX highest → **Anxiety/Autonomic**
   - VEST highest → **Neuroinflammatory** (VEST feeds NIF as parent phenotype per Dr. Nasir's framework)

### `computeResults()` return shape

```js
{
  lovedOneName,        // string
  lovedOneAge,         // number | null
  caregiverRelation,   // string
  phenotype,           // 'neuroinflammatory' | 'cognitive' | 'autonomic' | 'longevity' | 'severe'
  nif,                 // 0–4 float
  cog,                 // 0–4 float
  aux,                 // 0–4 float
  vest,                // 0–4 float
  gsi,                 // 0–4 float
}
```

---

## Report — BHIReportContent

The component prop signature is unchanged. Only the constants and cards inside change.

### Card 1 — Caregiver Opener (unchanged)
Same copy. Replaces `lovedOneAge` display if present.

### Card 2 — Brain Health Index Result (replaces "Cognitive Stage Assessment")
- Section label: "Brain Health Index"
- Large serif: phenotype display name (e.g. "Neuroinflammatory Phenotype")
- "For [name]" chip — unchanged
- Patient-friendly description paragraph (from Dr. Nasir's doc)
- **Spectrum bar** — GSI drives position via `gsiIndex = Math.min(4, Math.round(gsi))`; labels: Optimal · Mild · Moderate · Significant · Severe

### Card 3 — Domain Cards (replaces memory/language/attention/behavior 2×2 grid)
Four cards in 2×2 grid mapped to clusters:

| Card | Emoji | Label | Cluster |
|------|-------|-------|---------|
| 1 | 🔥 | Brain Energy & Clarity | NIF |
| 2 | 🧠 | Focus & Thinking | COG |
| 3 | 💫 | Stress & Nervous System | AUX |
| 4 | ⚖️ | Balance & Senses | VEST |

Severity mapping (same thresholds as current):
- `< 2.0` → low
- `2.0–3.4` → moderate
- `>= 3.5` → elevated

Each card body shows a plain-language description (1–2 sentences) for that cluster at the
severity level — written for caregivers, no clinical jargon.

### Cards 4–8 — Unchanged, match main exactly
Care pathway timeline, consult FAQ, Dr. Nasir CTA card (photo, bio, routing), email/share,
and caregiver guide opt-in copy are **identical to main**. No edits to these sections.

---

## Phenotype Descriptions (Card 2 — 1–2 sentences, caregiver-friendly)

| Phenotype | Display name | Description |
|-----------|-------------|-------------|
| neuroinflammatory | Neuroinflammatory Phenotype | "[name]'s responses point to brain fatigue driven by inflammation — often triggered by illness, stress, or infection. This shows up as persistent fog, low energy, headaches, and sensitivity to light or noise." |
| cognitive | Cognitive-Phasic Phenotype | "The responses highlight difficulty with focus, organisation, and recalling words or information. This reflects a brain that can still function well but tires quickly under mental load." |
| autonomic | Anxiety / Autonomic Phenotype | "The pattern suggests [name]'s stress and nervous system are out of balance — producing tension, poor sleep, and physical symptoms like a racing heart or dizziness." |
| longevity | Longevity / Performance Phenotype | "No significant impairment detected — [name]'s brain is functioning well. The opportunity here is optimisation: sharper focus, better energy, and protecting long-term brain health." |
| severe | Severe Deficit Phenotype | "Multiple areas of brain function are significantly affected, suggesting the brain's systems are under serious strain. This profile benefits most from a structured, comprehensive evaluation." |

---

## Domain Copy (plain language, 1–2 sentences per cluster × severity)

### 🔥 Brain Energy & Clarity (NIF)
- **elevated**: "This area shows significant strain — [name] likely experiences persistent fog, low energy, and worsening symptoms after activity. This pattern is common after illness, chronic stress, or long-term inflammation."
- **moderate**: "Some brain fatigue is present, with energy and clarity dipping more than expected. Afternoons and busier days tend to be harder."
- **low**: "Brain energy and clarity appear to be holding up well in this area."

### 🧠 Focus & Thinking (COG)
- **elevated**: "Focus, organisation, and word-finding are significantly affected — [name] may feel mentally slow, easily distracted, or unable to stay on task for long. This reflects a brain under sustained cognitive strain."
- **moderate**: "Attention and thinking take more effort than usual, and mental stamina may fade as the day goes on. Task-switching and staying organised can feel harder."
- **low**: "Focus and thinking appear to be working well for day-to-day demands."

### 💫 Stress & Nervous System (AUX)
- **elevated**: "The nervous system is in a persistent state of overdrive — producing poor sleep, physical tension, and symptoms like palpitations or dizziness. Stress and recovery are significantly out of balance."
- **moderate**: "There are signs of nervous system strain, with background tension and disrupted sleep feeding into each other. Rest does not feel as restorative as it should."
- **low**: "Stress and nervous system regulation appear balanced in this area."

### ⚖️ Balance & Senses (VEST)
- **elevated**: "Dizziness, motion sensitivity, or sensory overload are significantly present — [name] may feel off-balance or easily overwhelmed in busy environments. This often overlaps with fatigue or stress-related patterns."
- **moderate**: "Mild balance or sensory sensitivity is present, tending to worsen in busy or stimulating settings. This is worth monitoring alongside other symptoms."
- **low**: "Balance and sensory processing appear stable."

---

## Analysing Screen (unchanged)
Steps updated to reflect new phenotype model:
1. "Reviewing symptom patterns..."
2. "Mapping to neurological clusters..."
3. "Identifying your phenotype..."
4. "Preparing your report..."

---

## What Does NOT Change
- Overlay shell, panel header ("Brain Health Index"), close/ESC behaviour
- Progress bar and question navigation (Back / Next / View results)
- Analyzing loading screen (step text updated above)
- BHIReport wrapper (email sending, existing account modal, footer)
- Care pathway timeline
- Consult FAQ section
- Dr. Nasir CTA card (photo, bio, routing logic)
- Email/share section
- Caregiver guide opt-in
- Dashboard PDF export
- `bhiQuizConfig.js` — `BHI_SUBJECT_QUESTION_IDS` still excludes `['name', 'age', 'relation']`

---

## Files Changed
- `src/BrainHealthIndex.jsx` — replace `CAREGIVER_QUESTIONS`, `computeResults()`, `ANALYZING_STEPS`
- `src/components/BHIReportContent.jsx` — replace `STAGES`, `DOMAIN_COPY`, `DOMAIN_META`, `CONCERN_LABEL`/`CONCERN_STYLE` keys, result destructuring, spectrum bar labels, Card 2 title/content
