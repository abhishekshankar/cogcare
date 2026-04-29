# Dr. Nasir Brain Wellness Quiz — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the caregiver BHI quiz (13-question AD8-inspired, 1–5 scale) with Dr. Imaad Nasir's Brain Wellness Quiz (14 questions, 0–4 Likert scale), keeping the overlay shell, progress bar, all Cards 4–8, and email/PDF flows completely unchanged.

**Architecture:** Two files change. `BrainHealthIndex.jsx` gets new question constants, updated `computeResults()` returning phenotype + cluster scores, and BHIQuiz component updates for the 0-4 scale and optional Skip button. `BHIReportContent.jsx` gets new constants (GSI_LEVELS, PHENOTYPES, DOMAIN_COPY, DOMAIN_META) and updated Cards 2–3; Cards 4–8 are untouched.

**Tech Stack:** React 18, Vite, Fluent UI 2, Tailwind CSS

---

## File Map

| File | What changes |
|------|-------------|
| `src/BrainHealthIndex.jsx` | Lines 11–65: replace CAREGIVER_QUESTIONS, FREQUENCY_SCALE, ANALYZING_STEPS, domainLevel(), computeResults(); Lines 86–237: update BHIQuiz component |
| `src/components/BHIReportContent.jsx` | Lines 5–49: replace STAGES, DOMAIN_COPY, DOMAIN_META, CONCERN_LABEL/STYLE; add PHENOTYPES, clusterLevel(); Lines 51–106: update StageSpectrum + DomainCard; Lines 210–321: update result destructuring + Cards 2–3 |

---

### Task 0: Create git worktree on feature/dr-nasir-quiz

**Files:**
- No file edits — shell commands only

- [ ] **Step 1: Create the worktree**

Run from `/Users/user1/Desktop`:
```bash
git -C cogcare worktree add ../cogcare-dr-nasir-quiz -b feature/dr-nasir-quiz
```
Expected output: `Preparing worktree (new branch 'feature/dr-nasir-quiz')`

- [ ] **Step 2: Symlink node_modules to skip reinstall**

```bash
ln -s /Users/user1/Desktop/cogcare/node_modules /Users/user1/Desktop/cogcare-dr-nasir-quiz/node_modules
```

- [ ] **Step 3: Start dev server on port 5174**

```bash
cd /Users/user1/Desktop/cogcare-dr-nasir-quiz && npm run dev -- --port 5174
```
Expected: Vite starts at http://localhost:5174/

- [ ] **Step 4: Verify baseline in browser**

Open http://localhost:5174/ and click "Take the Brain Health Index" — confirm the current 13-question caregiver quiz loads and the report renders with "Cognitive Stage Assessment". This is the before state.

---

### Task 1: Replace data constants and computeResults() in BrainHealthIndex.jsx

**Files:**
- Modify: `src/BrainHealthIndex.jsx:11-65` (in the worktree: `/Users/user1/Desktop/cogcare-dr-nasir-quiz/src/BrainHealthIndex.jsx`)

- [ ] **Step 1: Replace CAREGIVER_QUESTIONS, FREQUENCY_SCALE, ANALYZING_STEPS**

Find and replace lines 10–34 (everything from `// ---- Caregiver quiz questions ----` through `]`/`const ANALYZING_STEPS`) with:

```js
// ---- Dr. Nasir Brain Wellness Quiz questions ----
const NASIR_SCALE = ['Not at all', 'A little', 'Somewhat', 'Often', 'Almost always']
const ENDURANCE_SCALE = ['Hours', '60 mins', '30 mins', '10 mins', 'Almost immediately']

const NASIR_QUESTIONS = [
  { id: 'name',     type: 'text',      domain: 'About your loved one', text: "What is your loved one's first name?", placeholder: 'First name' },
  { id: 'age',      type: 'number',    domain: 'About your loved one', text: 'How old are they?', placeholder: 'Age' },
  { id: 'relation', type: 'choice',    domain: 'About your loved one', text: 'What is your relationship to them?', options: ['Parent', 'Grandparent', 'Spouse', 'Sibling', 'Other'] },
  { id: 'q1',  type: 'scale', domain: "How {name}'s Brain Feels", text: 'How often does {name} seem foggy, slowed down, or "not as sharp" as usual?' },
  { id: 'q2',  type: 'scale', domain: "How {name}'s Brain Feels", text: 'How often does low energy make it harder for {name} to think or function?' },
  { id: 'q3',  type: 'scale', domain: "How {name}'s Brain Feels", text: 'How often does {name} experience head pressure, tightness, or headaches?' },
  { id: 'q4',  type: 'scale', domain: "How {name}'s Brain Feels", text: 'How often does {name} struggle to stay focused or get easily distracted?' },
  { id: 'q5',  type: 'scale', domain: "How {name}'s Brain Feels", text: 'How often does {name} seem scattered, overwhelmed, or disorganised?' },
  { id: 'q6',  type: 'scale', domain: 'Stress, Mood & Autonomic', text: 'How often does {name} seem keyed-up, tense, or on edge?' },
  { id: 'q7',  type: 'scale', domain: 'Stress, Mood & Autonomic', text: 'How often does {name} experience palpitations, sudden dips in energy, dizziness, heat intolerance, or shakiness?' },
  { id: 'q8',  type: 'scale', domain: 'Stress, Mood & Autonomic', text: "How often is {name}'s sleep light, unrefreshing, or disrupted?" },
  { id: 'q9',  type: 'scale', domain: 'Balance & Sensory',        text: 'Does {name} get dizzy, off-balance, or sensitive to busy environments or fast movements?' },
  { id: 'q10', type: 'scale', domain: 'Balance & Sensory',        text: 'How often does {name} have trouble finding words, remembering names, or recalling information quickly?' },
  { id: 'q11', type: 'scale',     domain: 'Optional -- Fine-Tune the Profile', text: "Do {name}'s symptoms get worse after mental or physical activity?",               optional: true },
  { id: 'q12', type: 'scale',     domain: 'Optional -- Fine-Tune the Profile', text: 'Is {name} sensitive to noise, screens, bright lights, or crowded spaces?',         optional: true },
  { id: 'q13', type: 'endurance', domain: 'Optional -- Fine-Tune the Profile', text: 'How long can {name} stay mentally sharp before performance drops?',                optional: true },
  { id: 'q14', type: 'scale',     domain: 'Optional -- Fine-Tune the Profile', text: 'Does {name} seem more emotionally reactive or less steady than usual?',             optional: true },
]

const ANALYZING_STEPS = [
  'Reviewing symptom patterns...',
  'Mapping to neurological clusters...',
  'Identifying your phenotype...',
  'Preparing your report...',
]
```

- [ ] **Step 2: Replace domainLevel() and computeResults()**

Find and replace lines 36–65 (from `function domainLevel` through the closing `}` of `computeResults`) with:

```js
function clusterAvg(answers, ids) {
  const vals = ids.map(id => answers[id]).filter(v => v != null && !isNaN(v))
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

function computeResults(answers) {
  const lovedOneName = (typeof answers.name === 'string' ? answers.name : 'Your loved one').trim() || 'Your loved one'
  const lovedOneAge = answers.age || null
  const relationOptions = ['Parent', 'Grandparent', 'Spouse', 'Sibling', 'Other']
  const caregiverRelation = answers.relation ? (relationOptions[answers.relation - 1] || '') : ''

  const nif  = clusterAvg(answers, ['q1', 'q2', 'q3', 'q11', 'q12'])
  const cog  = clusterAvg(answers, ['q4', 'q5', 'q10', 'q13'])
  const aux  = clusterAvg(answers, ['q6', 'q7', 'q8'])
  const vest = clusterAvg(answers, ['q9', 'q12'])

  const allIds = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14']
  const gsi = clusterAvg(answers, allIds)
  const highItems = allIds.filter(id => answers[id] != null && answers[id] >= 3).length

  let phenotype
  if (gsi >= 2.5 && highItems >= 4 && (cog >= 3 || nif >= 3 || vest >= 3)) {
    phenotype = 'severe'
  } else if (nif < 2.5 && cog < 2.5 && aux < 2.5 && vest < 2.5) {
    phenotype = 'longevity'
  } else {
    const clusters = { nif, cog, aux, vest }
    const primary = Object.entries(clusters).reduce((a, b) => b[1] > a[1] ? b : a)[0]
    phenotype = (primary === 'nif' || primary === 'vest') ? 'neuroinflammatory'
              : primary === 'cog' ? 'cognitive'
              : 'autonomic'
  }

  return { lovedOneName, lovedOneAge, caregiverRelation, phenotype, nif, cog, aux, vest, gsi }
}
```

- [ ] **Step 3: Verify the file compiles**

```bash
cd /Users/user1/Desktop/cogcare-dr-nasir-quiz && npx tsc --noEmit 2>&1 | head -30
```
Expected: No errors relating to the changed lines (TypeScript errors about other files are acceptable). If Vite hot-reloads without a crash, that is also sufficient.

- [ ] **Step 4: Commit**

```bash
cd /Users/user1/Desktop/cogcare-dr-nasir-quiz
git add src/BrainHealthIndex.jsx
git commit -m "feat: replace caregiver quiz data with Dr. Nasir 14-question set and phenotype scoring"
```

---

### Task 2: Update BHIQuiz component for new question types

**Files:**
- Modify: `src/BrainHealthIndex.jsx:86-237` (worktree)

The BHIQuiz component needs four changes: (1) use NASIR_QUESTIONS, (2) resolve options for `scale`/`endurance` types, (3) store answers as 0-indexed for scale/endurance, (4) add Skip button for optional questions.

- [ ] **Step 1: Swap question source + add domainText substitution**

Find (line 88):
```js
  const questions = CAREGIVER_QUESTIONS.filter((item) => !excludedQuestionIds.includes(item.id))
```
Replace with:
```js
  const questions = NASIR_QUESTIONS.filter((item) => !excludedQuestionIds.includes(item.id))
```

Find (line 94):
```js
  const questionText = q.text.replace(/\{name\}/g, name)
```
Replace with:
```js
  const domainText = q.domain.replace(/\{name\}/g, name)
  const questionText = q.text.replace(/\{name\}/g, name)
```

- [ ] **Step 2: Update canProceed to always pass for optional questions**

Find (lines 97–101):
```js
  const canProceed = (() => {
    if (q.type === 'text') return typeof currentValue === 'string' && currentValue.trim().length > 0
    if (q.type === 'number') return typeof currentValue === 'number' && currentValue > 0 && currentValue < 130
    return currentValue != null
  })()
```
Replace with:
```js
  const canProceed = (() => {
    if (q.type === 'text') return typeof currentValue === 'string' && currentValue.trim().length > 0
    if (q.type === 'number') return typeof currentValue === 'number' && currentValue > 0 && currentValue < 130
    if (q.optional) return true
    return currentValue != null
  })()
```

- [ ] **Step 3: Add handleSkip after handleBack**

Find (line 116):
```js
  const handleBack = () => {
    if (qi > 0) setQi(qi - 1)
  }

  const options = q.type === 'frequency' ? FREQUENCY_SCALE : (q.options || [])
```
Replace with:
```js
  const handleBack = () => {
    if (qi > 0) setQi(qi - 1)
  }

  const handleSkip = () => {
    const updated = { ...quizAnswers, [q.id]: null }
    if (qi < total - 1) {
      setAnswer(null)
      setQi(qi + 1)
    } else {
      onComplete(computeResults(updated))
    }
  }

  const options = (() => {
    if (q.type === 'scale') return NASIR_SCALE
    if (q.type === 'endurance') return ENDURANCE_SCALE
    return q.options || []
  })()
```

- [ ] **Step 4: Store scale/endurance answers as 0-indexed**

Inside the `options.map((label, i) => {` callback, find (line 183):
```js
                const value = i + 1
```
Replace with:
```js
                const value = (q.type === 'scale' || q.type === 'endurance') ? i : i + 1
```

- [ ] **Step 5: Show number badge for scale/endurance (not frequency)**

Find (line 196):
```js
                    {q.type === 'frequency' && (
                      <span className={['flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums', isOn ? 'bg-forest text-white' : 'bg-surface text-forest group-hover:bg-border/80'].join(' ')} aria-hidden>
                        {value}
                      </span>
                    )}
```
Replace with:
```js
                    {(q.type === 'scale' || q.type === 'endurance') && (
                      <span className={['flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums', isOn ? 'bg-forest text-white' : 'bg-surface text-forest group-hover:bg-border/80'].join(' ')} aria-hidden>
                        {value}
                      </span>
                    )}
```

- [ ] **Step 6: Render domainText instead of q.domain**

Find the domain badge (line 126):
```jsx
          <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-clay ring-1 ring-border/60">
            {q.domain}
          </span>
```
Replace with:
```jsx
          <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-clay ring-1 ring-border/60">
            {domainText}
          </span>
```

Find the domain label above the question (line 142):
```jsx
        <p className="mb-1.5 shrink-0 text-[10px] font-bold uppercase tracking-[0.25em] text-forest/40">
          {q.domain}
        </p>
```
Replace with:
```jsx
        <p className="mb-1.5 shrink-0 text-[10px] font-bold uppercase tracking-[0.25em] text-forest/40">
          {domainText}
        </p>
```

- [ ] **Step 7: Add Skip button to the navigation footer**

Find the navigation footer (line 213):
```jsx
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface/50 px-4 py-3 backdrop-blur-sm sm:px-8 sm:py-4">
        {qi > 0 ? (
          <Button
            appearance="subtle"
            icon={<ChevronLeft className="h-4 w-4" />}
            onClick={handleBack}
          >
            Back
          </Button>
        ) : (
          <div className="min-w-[4rem]" aria-hidden />
        )}
        <Button
```
Replace with:
```jsx
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface/50 px-4 py-3 backdrop-blur-sm sm:px-8 sm:py-4">
        {qi > 0 ? (
          <Button
            appearance="subtle"
            icon={<ChevronLeft className="h-4 w-4" />}
            onClick={handleBack}
          >
            Back
          </Button>
        ) : (
          <div className="min-w-[4rem]" aria-hidden />
        )}
        {q.optional && (
          <Button appearance="subtle" onClick={handleSkip} className="text-clay">
            Skip
          </Button>
        )}
        <Button
```

- [ ] **Step 8: Verify quiz renders in browser**

At http://localhost:5174/ open the quiz. Confirm:
- Q1 shows domain badge "How [name]'s Brain Feels" (or "How your loved one's Brain Feels" before name is entered)
- Scale buttons show 0–4 badges labeled "Not at all" through "Almost always"
- Q11–Q14 show a "Skip" button next to Next
- Q13 shows "Hours / 60 mins / 30 mins / 10 mins / Almost immediately" options
- Completing the quiz reaches the analyzing screen with updated steps ("Mapping to neurological clusters...")

- [ ] **Step 9: Commit**

```bash
cd /Users/user1/Desktop/cogcare-dr-nasir-quiz
git add src/BrainHealthIndex.jsx
git commit -m "feat: update BHIQuiz for 0-4 scale, optional skip button, domain name substitution"
```

---

### Task 3: Replace constants and Cards 2–3 in BHIReportContent.jsx

**Files:**
- Modify: `src/components/BHIReportContent.jsx` (worktree)

- [ ] **Step 1: Replace STAGES with GSI_LEVELS and add PHENOTYPES**

Find (lines 5–11):
```js
const STAGES = [
  { label: 'Normal Aging',    short: 'Normal',   desc: 'Memory lapses typical of age. No intervention needed.' },
  { label: 'Early Changes',   short: 'Early',    desc: 'Subtle but consistent changes that warrant professional attention.' },
  { label: 'Mild Impairment', short: 'Mild MCI', desc: 'Noticeable cognitive changes affecting some daily activities.' },
  { label: 'Moderate',        short: 'Moderate', desc: 'Significant memory and thinking difficulties requiring support.' },
  { label: 'Advanced',        short: 'Advanced', desc: 'Substantial care and structured support required.' },
]
```
Replace with:
```js
const GSI_LEVELS = [
  { short: 'Optimal' },
  { short: 'Mild' },
  { short: 'Moderate' },
  { short: 'Significant' },
  { short: 'Severe' },
]

const PHENOTYPES = {
  neuroinflammatory: {
    name: 'Neuroinflammatory Phenotype',
    desc: "{name}'s responses point to brain fatigue driven by inflammation -- often triggered by illness, stress, or infection. This shows up as persistent fog, low energy, headaches, and sensitivity to light or noise.",
  },
  cognitive: {
    name: 'Cognitive-Phasic Phenotype',
    desc: "The responses highlight difficulty with focus, organisation, and recalling words or information. This reflects a brain that can still function well but tires quickly under mental load.",
  },
  autonomic: {
    name: 'Anxiety / Autonomic Phenotype',
    desc: "The pattern suggests {name}'s stress and nervous system are out of balance -- producing tension, poor sleep, and physical symptoms like a racing heart or dizziness.",
  },
  longevity: {
    name: 'Longevity / Performance Phenotype',
    desc: "No significant impairment detected -- {name}'s brain is functioning well. The opportunity here is optimisation: sharper focus, better energy, and protecting long-term brain health.",
  },
  severe: {
    name: 'Severe Deficit Phenotype',
    desc: "Multiple areas of brain function are significantly affected, suggesting the brain's systems are under serious strain. This profile benefits most from a structured, comprehensive evaluation.",
  },
}
```

- [ ] **Step 2: Replace DOMAIN_COPY with cluster keys**

Find (lines 13–34):
```js
const DOMAIN_COPY = {
  memory: {
    elevated: 'Repeating the same questions within short periods, forgetting recent conversations with family.',
    moderate: 'Occasionally forgetting appointments and recent events, generally recovers with reminders.',
    low:      'Mild forgetfulness consistent with normal aging -- names, occasional dates.',
  },
  language: {
    elevated: 'Frequently pausing mid-sentence to search for words, substituting incorrect words without awareness.',
    moderate: 'Struggling to recall common words in conversation, sometimes losing train of thought.',
    low:      'No significant language changes reported at this time.',
  },
  attention: {
    elevated: 'Confusion in familiar environments, difficulty following multi-step tasks or conversations.',
    moderate: 'Difficulty concentrating on complex tasks, easily distracted in busy environments.',
    low:      'Attention appears largely intact for routine activities.',
  },
  behavior: {
    elevated: 'Noticeable personality shifts, increased anxiety, or withdrawal from social activities.',
    moderate: 'Occasional irritability or mood changes, slightly more than baseline for this person.',
    low:      'Mood and personality appear stable, minor irritability noted.',
  },
}
```
Replace with:
```js
const DOMAIN_COPY = {
  nif: {
    elevated: "This area shows significant strain -- {name} likely experiences persistent fog, low energy, and worsening symptoms after activity. This pattern is common after illness, chronic stress, or long-term inflammation.",
    moderate: "Some brain fatigue is present, with energy and clarity dipping more than expected. Afternoons and busier days tend to be harder.",
    low:      "Brain energy and clarity appear to be holding up well in this area.",
  },
  cog: {
    elevated: "Focus, organisation, and word-finding are significantly affected -- {name} may feel mentally slow, easily distracted, or unable to stay on task for long. This reflects a brain under sustained cognitive strain.",
    moderate: "Attention and thinking take more effort than usual, and mental stamina may fade as the day goes on. Task-switching and staying organised can feel harder.",
    low:      "Focus and thinking appear to be working well for day-to-day demands.",
  },
  aux: {
    elevated: "The nervous system is in a persistent state of overdrive -- producing poor sleep, physical tension, and symptoms like palpitations or dizziness. Stress and recovery are significantly out of balance.",
    moderate: "There are signs of nervous system strain, with background tension and disrupted sleep feeding into each other. Rest does not feel as restorative as it should.",
    low:      "Stress and nervous system regulation appear balanced in this area.",
  },
  vest: {
    elevated: "Dizziness, motion sensitivity, or sensory overload are significantly present -- {name} may feel off-balance or easily overwhelmed in busy environments. This often overlaps with fatigue or stress-related patterns.",
    moderate: "Mild balance or sensory sensitivity is present, tending to worsen in busy or stimulating settings. This is worth monitoring alongside other symptoms.",
    low:      "Balance and sensory processing appear stable.",
  },
}
```

- [ ] **Step 3: Replace DOMAIN_META with cluster keys**

Find (lines 36–41):
```js
const DOMAIN_META = {
  memory:    { emoji: '🧩', label: 'Memory' },
  language:  { emoji: '💬', label: 'Language' },
  attention: { emoji: '🔍', label: 'Attention' },
  behavior:  { emoji: '🌿', label: 'Behavior' },
}
```
Replace with:
```js
const DOMAIN_META = {
  nif:  { emoji: '🔥', label: 'Brain Energy & Clarity' },
  cog:  { emoji: '🧠', label: 'Focus & Thinking' },
  aux:  { emoji: '💫', label: 'Stress & Nervous System' },
  vest: { emoji: '⚖️', label: 'Balance & Senses' },
}

function clusterLevel(score) {
  if (score == null || isNaN(score)) return 'low'
  if (score >= 3.5) return 'elevated'
  if (score >= 2.0) return 'moderate'
  return 'low'
}
```

- [ ] **Step 4: Update StageSpectrum to use GSI_LEVELS**

Find (lines 51–107):
```js
function StageSpectrum({ stageIndex }) {
  const pct = (stageIndex / (STAGES.length - 1)) * 100
  return (
    <div style={{ padding: '4px 0 8px' }}>
      <div style={{
        position: 'relative', height: 10, borderRadius: 9999, overflow: 'visible',
        background: 'linear-gradient(to right, #4A9060, #8DC07A, #E8C060, #D4804A, #A84232)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
      }}>
        {STAGES.map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: -3, bottom: -3,
            left: `${(i / (STAGES.length - 1)) * 100}%`,
            transform: 'translateX(-50%)',
            width: i === 0 || i === STAGES.length - 1 ? 0 : 1,
            background: 'rgba(255,255,255,0.5)',
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '50%',
          left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 22, height: 22,
          background: 'var(--color-white)',
          borderRadius: '50%',
          border: '3px solid var(--color-forest)',
          boxShadow: '0 2px 8px rgba(26,60,52,0.25)',
          zIndex: 2,
          transition: 'left 0.6s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8, height: 8, borderRadius: '50%', background: 'var(--color-forest)',
          }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        {STAGES.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: i === stageIndex ? 10 : 9,
            fontWeight: i === stageIndex ? 700 : 500,
            color: i === stageIndex ? 'var(--color-forest)' : 'rgba(61,75,62,0.4)',
            lineHeight: 1.3,
            transition: 'all 0.3s',
          }}>
            {s.short}
            {i === stageIndex && (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-forest)', margin: '4px auto 0' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```
Replace with:
```js
function StageSpectrum({ gsiIndex }) {
  const pct = (gsiIndex / (GSI_LEVELS.length - 1)) * 100
  return (
    <div style={{ padding: '4px 0 8px' }}>
      <div style={{
        position: 'relative', height: 10, borderRadius: 9999, overflow: 'visible',
        background: 'linear-gradient(to right, #4A9060, #8DC07A, #E8C060, #D4804A, #A84232)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
      }}>
        {GSI_LEVELS.map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: -3, bottom: -3,
            left: `${(i / (GSI_LEVELS.length - 1)) * 100}%`,
            transform: 'translateX(-50%)',
            width: i === 0 || i === GSI_LEVELS.length - 1 ? 0 : 1,
            background: 'rgba(255,255,255,0.5)',
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '50%',
          left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 22, height: 22,
          background: 'var(--color-white)',
          borderRadius: '50%',
          border: '3px solid var(--color-forest)',
          boxShadow: '0 2px 8px rgba(26,60,52,0.25)',
          zIndex: 2,
          transition: 'left 0.6s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8, height: 8, borderRadius: '50%', background: 'var(--color-forest)',
          }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        {GSI_LEVELS.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: i === gsiIndex ? 10 : 9,
            fontWeight: i === gsiIndex ? 700 : 500,
            color: i === gsiIndex ? 'var(--color-forest)' : 'rgba(61,75,62,0.4)',
            lineHeight: 1.3,
            transition: 'all 0.3s',
          }}>
            {s.short}
            {i === gsiIndex && (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-forest)', margin: '4px auto 0' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Update DomainCard to apply name substitution and remove forced quotes**

Find (lines 109–139):
```js
function DomainCard({ domain, level, delay }) {
  const meta = DOMAIN_META[domain]
  const sty = CONCERN_STYLE[level] ?? CONCERN_STYLE.low
  const copy = DOMAIN_COPY[domain]?.[level] ?? ''
  return (
    <div className={`fade-up ${delay}`} style={{
      background: sty.bg, border: `1px solid ${sty.border}`,
      borderRadius: 18, padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--color-ink)' }}>{meta.label}</span>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
          padding: '3px 10px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)',
          color: sty.color, whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sty.dot, display: 'inline-block', flexShrink: 0 }} />
          {CONCERN_LABEL[level]}
        </span>
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.65, color: sty.color, fontStyle: 'italic', margin: 0, opacity: 0.9 }}>
        "{copy}"
      </p>
    </div>
  )
}
```
Replace with:
```js
function DomainCard({ domain, level, delay, name }) {
  const meta = DOMAIN_META[domain]
  const sty = CONCERN_STYLE[level] ?? CONCERN_STYLE.low
  const copy = (DOMAIN_COPY[domain]?.[level] ?? '').replace(/\{name\}/g, name || 'your loved one')
  return (
    <div className={`fade-up ${delay}`} style={{
      background: sty.bg, border: `1px solid ${sty.border}`,
      borderRadius: 18, padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--color-ink)' }}>{meta.label}</span>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
          padding: '3px 10px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)',
          color: sty.color, whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sty.dot, display: 'inline-block', flexShrink: 0 }} />
          {CONCERN_LABEL[level]}
        </span>
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.65, color: sty.color, lineHeight: 1.65, margin: 0 }}>
        {copy}
      </p>
    </div>
  )
}
```

- [ ] **Step 6: Update BHIReportContent result destructuring and derived values**

Find (lines 210–221):
```js
  const { lovedOneName, lovedOneAge, stageIndex, memory, language, attention, behavior } = quizResults
  const name = lovedOneName || 'Your loved one'
  const stage = STAGES[stageIndex ?? 0]

  const domains = [
    { key: 'memory',    level: memory },
    { key: 'language',  level: language },
    { key: 'attention', level: attention },
    { key: 'behavior',  level: behavior },
  ]
  const elevatedCount = domains.filter(d => d.level === 'elevated').length
  const moderateCount = domains.filter(d => d.level === 'moderate').length
```
Replace with:
```js
  const { lovedOneName, lovedOneAge, phenotype, nif, cog, aux, vest, gsi } = quizResults
  const name = lovedOneName || 'Your loved one'
  const gsiIndex = Math.min(4, Math.round(gsi ?? 0))
  const pheno = PHENOTYPES[phenotype ?? 'longevity']

  const domains = [
    { key: 'nif',  level: clusterLevel(nif) },
    { key: 'cog',  level: clusterLevel(cog) },
    { key: 'aux',  level: clusterLevel(aux) },
    { key: 'vest', level: clusterLevel(vest) },
  ]
  const elevatedCount = domains.filter(d => d.level === 'elevated').length
  const moderateCount = domains.filter(d => d.level === 'moderate').length
```

- [ ] **Step 7: Update Card 2 (Brain Health Index result)**

Find (lines 264–298):
```jsx
      {/* 2. Cognitive stage */}
      <div className="fade-up d2" style={{
        background: 'var(--color-white)', border: '1px solid var(--color-border)',
        borderRadius: 24, padding: '22px 24px', marginBottom: 20,
        boxShadow: '0 2px 12px rgba(26,60,52,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-clay)', marginBottom: 6 }}>
              Cognitive Stage Assessment
            </div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', color: 'var(--color-ink)', lineHeight: 1.2 }}>
              {stage.label}
            </div>
          </div>
          <div style={{
            flexShrink: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--color-forest)', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 9999, padding: '5px 14px', marginTop: 4,
          }}>
            For {name}
          </div>
        </div>
        <StageSpectrum stageIndex={stageIndex ?? 0} />
        <div style={{ marginTop: 14, borderRadius: 14, border: '1px solid var(--color-border)', padding: '14px 16px', background: 'var(--color-bg)' }}>
          <p style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.5, margin: '0 0 10px' }}>{stage.desc}</p>
          <div style={{ height: 1, borderTop: '1px dashed var(--color-border)', margin: '10px 0' }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Info size={13} style={{ color: 'var(--color-clay)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11.5, color: 'var(--color-clay)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
              This is a screening indicator, not a medical diagnosis. Only a licensed clinician can diagnose cognitive conditions.
            </p>
          </div>
        </div>
      </div>
```
Replace with:
```jsx
      {/* 2. Brain Health Index result */}
      <div className="fade-up d2" style={{
        background: 'var(--color-white)', border: '1px solid var(--color-border)',
        borderRadius: 24, padding: '22px 24px', marginBottom: 20,
        boxShadow: '0 2px 12px rgba(26,60,52,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-clay)', marginBottom: 6 }}>
              Brain Health Index
            </div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', color: 'var(--color-ink)', lineHeight: 1.2 }}>
              {pheno.name}
            </div>
          </div>
          <div style={{
            flexShrink: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--color-forest)', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 9999, padding: '5px 14px', marginTop: 4,
          }}>
            For {name}
          </div>
        </div>
        <StageSpectrum gsiIndex={gsiIndex} />
        <div style={{ marginTop: 14, borderRadius: 14, border: '1px solid var(--color-border)', padding: '14px 16px', background: 'var(--color-bg)' }}>
          <p style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.5, margin: '0 0 10px' }}>
            {pheno.desc.replace(/\{name\}/g, name)}
          </p>
          <div style={{ height: 1, borderTop: '1px dashed var(--color-border)', margin: '10px 0' }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Info size={13} style={{ color: 'var(--color-clay)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11.5, color: 'var(--color-clay)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
              This is a screening indicator, not a medical diagnosis. Only a licensed clinician can diagnose cognitive conditions.
            </p>
          </div>
        </div>
      </div>
```

- [ ] **Step 8: Update Card 3 (domain grid)**

Find (lines 300–321):
```jsx
      {/* 3. Symptom domains */}
      <div className="fade-up d3" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-clay)', marginBottom: 6 }}>
            Symptom Domains
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', color: 'var(--color-ink)', lineHeight: 1.25, marginBottom: 8 }}>
            What the assessment revealed
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--color-slate)', lineHeight: 1.6, margin: 0 }}>
            Based on your responses, {name} shows{' '}
            {elevatedCount > 0 && <><strong style={{ color: '#7A2E1F' }}>{elevatedCount} elevated</strong> and </>}
            <strong style={{ color: '#7A4A10' }}>{moderateCount} moderate</strong> concern area{moderateCount !== 1 ? 's' : ''}.{' '}
            The quoted behaviors below are drawn directly from what you reported.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {domains.map((d, i) => (
            <DomainCard key={d.key} domain={d.key} level={d.level} delay={`d${i + 4}`} />
          ))}
        </div>
      </div>
```
Replace with:
```jsx
      {/* 3. Brain health clusters */}
      <div className="fade-up d3" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-clay)', marginBottom: 6 }}>
            Brain Health Clusters
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', color: 'var(--color-ink)', lineHeight: 1.25, marginBottom: 8 }}>
            What the assessment revealed
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--color-slate)', lineHeight: 1.6, margin: 0 }}>
            Based on your responses, {name} shows{' '}
            {elevatedCount > 0 && <><strong style={{ color: '#7A2E1F' }}>{elevatedCount} elevated</strong> and </>}
            <strong style={{ color: '#7A4A10' }}>{moderateCount} moderate</strong> area{moderateCount !== 1 ? 's' : ''} across four brain health clusters.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {domains.map((d, i) => (
            <DomainCard key={d.key} domain={d.key} level={d.level} delay={`d${i + 4}`} name={name} />
          ))}
        </div>
      </div>
```

- [ ] **Step 9: Verify in browser**

Complete the full quiz at http://localhost:5174/ with representative answers. Confirm:
- Card 2 shows "Brain Health Index" label + phenotype name (e.g. "Longevity / Performance Phenotype" for all-low answers)
- Spectrum bar shows Optimal–Severe labels with marker positioned correctly
- Card 2 description substitutes the name correctly
- Card 3 shows four cluster cards (Brain Energy & Clarity, Focus & Thinking, Stress & Nervous System, Balance & Senses) with appropriate severity colours
- Cards 4–8 (Care Pathway, FAQ, Dr. Nasir CTA, email, guide opt-in) render identically to before
- Try all-4s answers → severe phenotype, try all-0s → longevity phenotype

- [ ] **Step 10: Commit**

```bash
cd /Users/user1/Desktop/cogcare-dr-nasir-quiz
git add src/components/BHIReportContent.jsx
git commit -m "feat: update BHIReportContent for phenotype model -- GSI_LEVELS, PHENOTYPES, cluster domain cards"
```

---

### Task 4: Smoke test — edge cases and downstream flows

**Files:**
- No code changes — verification only

- [ ] **Step 1: Test phenotype boundary cases**

Open http://localhost:5174/ and complete the quiz three times:

| Test | Answers | Expected phenotype |
|------|---------|-------------------|
| All zeros | All scale questions = 0 | Longevity / Performance |
| NIF dominant | q1=4, q2=4, q3=4, rest=0 | Neuroinflammatory |
| AUX dominant | q6=4, q7=4, q8=4, rest=0 | Anxiety / Autonomic |

Confirm Card 2 heading matches expected phenotype each time.

- [ ] **Step 2: Test Skip on optional questions**

Run the quiz and skip all of Q11–Q14 using the Skip button. Confirm:
- Quiz advances past each optional question
- The report still renders (no crash from missing cluster values)
- Spectrum bar appears at a reasonable position

- [ ] **Step 3: Test dashboard flow (excluded questions)**

If logged in: open the dashboard, navigate to "Take Assessment" for an existing subject. Confirm the name/age/relation questions are skipped (those IDs are still 'name', 'age', 'relation' — unchanged) and the quiz starts at Q1 per `BHI_SUBJECT_QUESTION_IDS` in `bhiQuizConfig.js`.

- [ ] **Step 4: Confirm Cards 4–8 unchanged**

Verify:
- Care Pathway timeline renders
- "What actually happens in a consult" FAQ renders
- Dr. Nasir photo + bio + booking button renders
- Email input and share section renders
- Caregiver guide opt-in renders

- [ ] **Step 5: Final commit with branch summary**

```bash
cd /Users/user1/Desktop/cogcare-dr-nasir-quiz
git log --oneline -5
```
Expected to see the three feature commits from Tasks 1–3.

---

## Merging back to feature/cogcare-3-frontpage

After the user approves the implementation in the worktree, merge back:

```bash
cd /Users/user1/Desktop/cogcare
git merge feature/dr-nasir-quiz --no-ff -m "feat: Dr. Nasir Brain Wellness Quiz -- phenotype scoring and updated report"
```

Then remove the worktree:
```bash
git worktree remove ../cogcare-dr-nasir-quiz
git branch -d feature/dr-nasir-quiz
```
