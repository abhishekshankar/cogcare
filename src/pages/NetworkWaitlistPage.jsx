import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Copy, LockKeyhole } from 'lucide-react'
import { requestNetworkInvite } from '../lib/networkWaitlist.js'
import { useDocumentMeta } from '../lib/useDocumentMeta.js'
import { networkBody, networkCard, networkDisplayLg, networkEyebrow, networkPage, networkPrimaryBtn } from '../components/network/networkUi.js'

const ROLES = ['Physician', 'Researcher', 'Educator', 'Care leader', 'Public-health leader', 'Technologist', 'Other']

export default function NetworkWaitlistPage() {
  const [form, setForm] = useState({ name: '', email: '', roleCategory: '', organization: '', location: '', professionalUrl: '', interest: '', consent: false, website: '' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useDocumentMeta({
    title: 'Request an invitation · Cognition Network',
    description: 'Request consideration for the invitation-only Cognition Network founding cohort.',
    canonical: typeof window !== 'undefined' ? `${window.location.origin}/network/request-invite` : 'https://cogcare.org/network/request-invite',
  })

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  async function submit(event) {
    event.preventDefault()
    if (form.website) return
    setSubmitting(true)
    setError('')
    try {
      setResult(await requestNetworkInvite({ ...form, source: 'member-deck' }))
    } catch (err) {
      setError(err?.message || 'Could not join the waitlist.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={networkPage}>
      <header className="border-b border-border bg-page">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
          <Link to="/network" className="font-serif text-lg italic text-ink">Cognition Network</Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">Powered by CogCare</span>
        </div>
      </header>
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <p className={networkEyebrow}>Founding 100 · Invitation requests</p>
            <h1 className={`mt-5 max-w-4xl ${networkDisplayLg}`}>Request consideration for Cognition Network</h1>
            <p className={`mt-6 max-w-2xl ${networkBody}`}>The founding cohort is assembled in small, considered groups. Membership is free, invitation-only, and designed for physicians and other leaders whose judgment can strengthen cognitive care.</p>
            <div className="mt-9 grid max-w-3xl gap-4 sm:grid-cols-3">
              {['First 10 shape the charter', 'First 30 influence early initiatives', 'First 100 retain founding recognition'].map((item) => <p key={item} className="border-l-2 border-clay pl-4 text-sm text-ink-muted">{item}</p>)}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <p className={networkEyebrow}>What happens next</p>
            <ol className="mt-6 space-y-5 text-sm leading-relaxed text-ink-muted">
              <li><strong className="text-ink">1. Receive your code.</strong> It confirms your request was recorded.</li>
              <li><strong className="text-ink">2. We review for fit and balance.</strong> A code is not an invitation or endorsement.</li>
              <li><strong className="text-ink">3. Selected people receive a personal invitation.</strong> Participation can remain private and passive.</li>
            </ol>
            <p className="mt-8 flex gap-3 text-xs leading-relaxed text-ink-faint"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />Your contact details remain private and are available only to authorized Network administrators.</p>
          </div>

          {result ? (
            <section className={`${networkCard} p-7 sm:p-9`} aria-live="polite">
              <div className="inline-flex rounded-full bg-surface p-3 text-forest"><Check className="h-5 w-5" aria-hidden /></div>
              <p className={`${networkEyebrow} mt-6`}>Request received</p>
              <h2 className="mt-3 font-serif text-3xl italic text-forest">Your waitlist code</h2>
              <div className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4">
                <strong className="font-mono text-2xl tracking-[0.14em] text-forest">{result.waitlistCode}</strong>
                <button type="button" onClick={() => navigator.clipboard?.writeText(result.waitlistCode)} className="rounded-full border border-border bg-white p-2 text-forest" aria-label="Copy waitlist code"><Copy className="h-4 w-4" /></button>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-ink-muted">Keep this code for reference. If your background matches an upcoming founding cohort need, the CogCare team will contact you personally.</p>
            </section>
          ) : (
            <form onSubmit={submit} className={`${networkCard} p-6 sm:p-8`}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required value={form.name} onChange={(value) => update('name', value)} autoComplete="name" />
                <Field label="Email" required type="email" value={form.email} onChange={(value) => update('email', value)} autoComplete="email" />
                <label className="text-xs font-medium text-forest">Primary role *<select required value={form.roleCategory} onChange={(event) => update('roleCategory', event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-white px-3 text-sm"><option value="">Select role</option>{ROLES.map((role) => <option key={role}>{role}</option>)}</select></label>
                <Field label="Organization" value={form.organization} onChange={(value) => update('organization', value)} autoComplete="organization" />
                <Field label="City / country" value={form.location} onChange={(value) => update('location', value)} autoComplete="country-name" />
                <Field label="Professional profile URL" type="url" value={form.professionalUrl} onChange={(value) => update('professionalUrl', value)} placeholder="https://" />
              </div>
              <label className="mt-5 block text-xs font-medium text-forest">Why is Cognition Network relevant to your work? *<textarea required minLength={20} maxLength={1200} rows={5} value={form.interest} onChange={(event) => update('interest', event.target.value)} className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm" /></label>
              <label className="sr-only">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label>
              <label className="mt-5 flex gap-3 text-xs leading-relaxed text-ink-muted"><input required type="checkbox" checked={form.consent} onChange={(event) => update('consent', event.target.checked)} className="mt-1" />CogCare may contact me about this invitation request. I understand that joining the waitlist does not guarantee membership.</label>
              {error ? <p className="mt-5 text-sm text-error" role="alert">{error}</p> : null}
              <button type="submit" disabled={submitting} className={`mt-7 w-full ${networkPrimaryBtn}`}>{submitting ? 'Requesting…' : 'Request an invitation'}<ArrowRight className="h-4 w-4" aria-hidden /></button>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}

function Field({ label, onChange, type = 'text', ...props }) {
  return <label className="text-xs font-medium text-forest">{label}{props.required ? ' *' : ''}<input {...props} type={type} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-border px-3 text-sm" /></label>
}
