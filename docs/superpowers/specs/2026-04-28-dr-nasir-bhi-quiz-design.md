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

Each card body shows Dr. Nasir's scientific blurb for that cluster at the severity level
(condensed from his framework document to 1–2 sentences per severity).

### Cards 4–8 — Unchanged
Care pathway, consult FAQ, Dr. Nasir CTA card, email/share, caregiver guide opt-in.

---

## Domain Copy (Scientific Blurbs per Cluster × Severity)

### 🔥 Brain Energy & Clarity (NIF)
- **elevated**: "Signs suggest central neuroinflammation — microglial activation and mitochondrial inefficiency are disrupting cortical processing speed, causing fog, fatigue, and sensory overload."
- **moderate**: "Mild neuroinflammatory load is likely slowing cognitive processing. Post-exertional worsening and afternoon fatigue are common at this level."
- **low**: "No significant neuroinflammatory signal detected. Brain energy and clarity appear largely intact."

### 🧠 Focus & Thinking (COG)
- **elevated**: "Frontoparietal network inefficiency — affecting the DLPFC and dorsal attention network — is producing distractibility, poor organisation, slowed processing, and word-finding difficulties."
- **moderate**: "Attention and executive circuits are under strain. Cognitive endurance may drop over the course of the day, with task-switching feeling effortful."
- **low**: "Focus and thinking circuits appear to be functioning well for routine demands."

### 💫 Stress & Nervous System (AUX)
- **elevated**: "Limbic–autonomic dysregulation — heightened amygdala activity and reduced vagal tone — is driving sympathetic overdrive: poor sleep, tension, palpitations, and sensory hypersensitivity."
- **moderate**: "The autonomic nervous system is showing signs of imbalance. Sleep fragmentation and background tension are perpetuating a stress–recovery gap."
- **low**: "Stress and autonomic regulation appear balanced. No significant limbic overactivation detected."

### ⚖️ Balance & Senses (VEST)
- **elevated**: "Vestibular–cortical mismatch and sensory hypersensitivity suggest brainstem or cerebellar involvement, often overlapping with neuroinflammatory or autonomic phenotypes."
- **moderate**: "Mild dizziness or sensory sensitivity may reflect vestibular–autonomic coupling stress. Often worsens in busy or high-stimulus environments."
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
