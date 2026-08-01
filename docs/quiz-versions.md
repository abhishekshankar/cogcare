# CogCare BHI Quiz Versions

---

## Latest — Caregiver BHI Quiz (v2)
**Introduced:** April 19, 2026 (commit `2849d52`)  
**13 questions** — AD8-inspired caregiver screening  
**Persona:** Adult child / caregiver reporting on an aging loved one

**Frequency scale:** 1=Never · 2=Rarely · 3=Sometimes · 4=Often · 5=Always

### About your loved one
| # | Type | Question |
|---|------|----------|
| 1 | text | What is your loved one's first name? |
| 2 | number | How old are they? (1–120) |
| 3 | choice | What is your relationship to them? — Parent / Grandparent / Spouse / Sibling / Other |

### Memory
| # | Question |
|---|----------|
| 4 | How often does [name] repeat the same question or story within the same conversation? |
| 5 | Does [name] forget recent events or conversations from the past day or two? |

### Language
| # | Question |
|---|----------|
| 6 | Does [name] pause mid-sentence searching for words, or use the wrong word without realising it? |
| 7 | Does [name] have difficulty following a conversation or lose their train of thought? |

### Attention
| # | Question |
|---|----------|
| 8 | Does [name] seem confused in familiar places, like their own home or neighbourhood? |
| 9 | Does [name] have difficulty following multi-step instructions, like a recipe or directions? |

### Behaviour
| # | Question |
|---|----------|
| 10 | Has [name]'s personality, mood, or social behaviour changed noticeably compared to 1–2 years ago? |

### Judgement
| # | Question |
|---|----------|
| 11 | Has [name] made unusual financial decisions, had trouble managing bills, or seemed more vulnerable to being taken advantage of? |

### Daily Function
| # | Type | Question / Options |
|---|------|--------------------|
| 12 | choice | Is [name] still managing daily tasks independently? — Fully independent / Mostly independent, with occasional help / Needs help with some tasks / Needs help with most tasks / Requires full-time assistance |

### Trajectory
| # | Type | Question / Options |
|---|------|--------------------|
| 13 | choice | Over the past 6 months, have the changes you are seeing gotten: — Better / Stayed the same / Slightly worse / Noticeably worse / Much worse |

### Scoring (v2)
Frequency domains — average maps to severity:
- `< 2.0` → low
- `2.0–3.4` → moderate
- `≥ 3.5` → elevated

Domain groupings: Memory (Q4,Q5) · Language (Q6,Q7) · Attention (Q8,Q9) · Behaviour (Q10,Q11)

Stage index (0–4: Normal → Advanced) = domain total + function score (Q12) + trajectory score (Q13)

Output: `lovedOneName`, `lovedOneAge`, `caregiverRelation`, `stageIndex`, `memory`, `language`, `attention`, `behavior`

---

## Previous — CCA Brain Health Index Quiz (v1)
**Last active:** before April 19, 2026  
**17 questions** — FTD / EOAD differential diagnostic  
**Persona:** Caregiver or clinician assessing a person (third-person)

**Scale Q1–Q16:** 1=Not at all · 2=Rarely · 3=Sometimes · 4=Often · 5=Almost always  
**Scale Q17:** 1=No change · 2=Mild decline · 3=Moderate decline · 4=Significant decline · 5=Severe decline

| # | Domain | Question |
|---|--------|----------|
| 1 | Attention | Does the person have difficulty staying focused on a task for more than 15 minutes? |
| 2 | Cognitive | Does the person feel mentally exhausted or 'foggy' for most of the day? |
| 3 | Sleep | Has the person's sleep quality noticeably changed in the past 12 months? |
| 4 | Mood | Does the person feel anxious, worried, or on edge most of the time? |
| 5 | Mood | Has the person's mood been persistently low or flat — not just sad, but emotionally blunted? |
| 6 | FTD-Compulsive | Does the person repeat the same questions, statements, or actions within minutes of doing them? |
| 7 | FTD-Social | Has the person shown a noticeable reduction in warmth, compassion, or interest in other people? |
| 8 | FTD-Disinhibition | Has the person done or said things that are socially inappropriate and seemed unaware it was wrong? |
| 9 | FTD-Core | Has the person's personality changed significantly in the past 1–3 years? |
| 10 | Language | Does the person have difficulty finding words or expressing themselves verbally? |
| 11 | Executive | Has the person's ability to plan, organize, or sequence tasks declined? |
| 12 | FTD-Compulsive | Does the person have unusual eating habits, food cravings, or overeat compulsively? |
| 13 | Anosognosia | Is the person less aware of their own behavioral changes than family members are? |
| 14 | FTD-Compulsive | Has the person become more rigid, inflexible, or insistent on routines? |
| 15 | Apathy | Has the person lost interest in hobbies, relationships, or activities they previously enjoyed? |
| 16 | Motor | Does the person show any signs of motor difficulties: slowing, stiffness, tremor, or falls? |
| 17 | Global | How would you rate the overall change in this person's day-to-day functioning compared to 2 years ago? |

### Scoring (v1)
Diagnostic differential probabilities (sum to 100%):
- **bvFTD-Probable** — FTD subscale (Q7, Q8, Q9, Q6, Q12, Q13, Q14)
- **EOAD Pattern** — cognitive subscale (Q2, Q3, Q11, Q12) + global decline (Q17)
- **Late-Onset Depression** — mood subscale (Q4, Q5, Q15)
- **Mixed/Uncertain** — blend of FTD + mood
- **Normal Aging** — residual

Domain scores (0–100%): Social Cognition (Q7) · Disinhibition (Q8) · Compulsive Behaviors (Q6,Q12,Q14) · Apathy (Q15) · Executive Function (Q11) · Mood/Affect (Q5)

Urgency flag: `≥ 3.5` → HIGH · `≥ 2.5` → UNCERTAIN · `< 2.5` → LOW  
Motor flag: set if Q16 ≥ 3
