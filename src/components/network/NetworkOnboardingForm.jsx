import { ArrowRight, Loader2 } from 'lucide-react'
import {
  COMMUNICATION_PREFERENCES,
  PARTICIPATION_MODES,
  PUBLIC_VISIBILITY_OPTIONS,
} from '../../../lib/networkOnboarding.js'
import { NETWORK_BRANDS } from '../../../lib/networkConstants.js'
import { NETWORK_PROFILE_BIO_HINT, NETWORK_PUBLIC_DISCLAIMER } from '../../lib/consultantVisibility'
import { NETWORK_PRIMARY_ACTION } from '../../../lib/networkIntro.js'
import {
  networkBodySm,
  networkCaption,
  networkConsentBox,
  networkInput,
  networkLabel,
  networkPrimaryBtn,
  networkSectionTitle,
  networkStack,
} from './networkUi'

/**
 * @param {{
 *   form: object
 *   setForm: (updater: (prev: object) => object) => void
 *   error: string
 *   submitting: boolean
 *   onSubmit: (e: import('react').FormEvent) => void
 * }} props
 */
export default function NetworkOnboardingForm({ form, setForm, error, submitting, onSubmit }) {
  const canSubmit =
    form.privateJoinConsent &&
    form.disclosureAcknowledged &&
    (!form.publicProfileConsent || form.nameBioConsent)

  function toggleVenture(id) {
    setForm((prev) => {
      const has = prev.ventureAssociations.includes(id)
      const next = has
        ? prev.ventureAssociations.filter((v) => v !== id)
        : [...prev.ventureAssociations, id]
      return { ...prev, ventureAssociations: next.length ? next : [id] }
    })
  }

  return (
    <form onSubmit={onSubmit} className={`mt-10 ${networkStack}`} aria-labelledby="network-onboarding-title">
      <h2 id="network-onboarding-title" className={networkSectionTitle}>
        Acceptance & onboarding
      </h2>
      <p className={networkBodySm}>
        Minimum professional details only — no patient information or PHI.
      </p>

      {error ? (
        <div
          className="rounded-xl border border-error-border bg-error-bg px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2" htmlFor="onboard-name">
          <span className={networkLabel}>Name *</span>
          <input
            id="onboard-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className={networkInput}
            disabled={submitting}
          />
        </label>

        <label className="block sm:col-span-2" htmlFor="onboard-title">
          <span className={networkLabel}>Professional title *</span>
          <input
            id="onboard-title"
            name="title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className={networkInput}
            placeholder="Behavioral neurologist"
            disabled={submitting}
          />
        </label>

        <label className="block sm:col-span-2" htmlFor="onboard-organization">
          <span className={networkLabel}>Organization *</span>
          <input
            id="onboard-organization"
            name="organization"
            autoComplete="organization"
            value={form.organization}
            onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
            className={networkInput}
            disabled={submitting}
          />
        </label>

        <label className="block sm:col-span-2" htmlFor="onboard-professional-url">
          <span className={networkLabel}>
            Professional URL <span className="font-normal normal-case tracking-normal text-ink-faint">(optional)</span>
          </span>
          <input
            id="onboard-professional-url"
            name="professionalUrl"
            type="url"
            value={form.professionalUrl}
            onChange={(e) => setForm((p) => ({ ...p, professionalUrl: e.target.value }))}
            className={networkInput}
            placeholder="https://…"
            disabled={submitting}
          />
        </label>

        <label className="block sm:col-span-2" htmlFor="onboard-bio">
          <span className={networkLabel}>
            Short biography <span className="font-normal normal-case tracking-normal text-ink-faint">(optional)</span>
          </span>
          <textarea
            id="onboard-bio"
            name="bio"
            rows={4}
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            className={networkInput}
            aria-describedby="onboard-bio-hint"
            disabled={submitting}
          />
          <p id="onboard-bio-hint" className="mt-2 text-xs leading-relaxed text-ink/60">
            {NETWORK_PROFILE_BIO_HINT}
          </p>
        </label>
      </div>

      <fieldset className="space-y-3">
        <legend className={networkLabel}>Participation mode *</legend>
        <div className="space-y-2">
          {PARTICIPATION_MODES.map((mode) => (
            <label
              key={mode.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-white p-4 text-sm"
            >
              <input
                type="radio"
                name="participationMode"
                value={mode.id}
                checked={form.participationMode === mode.id}
                onChange={() => setForm((p) => ({ ...p, participationMode: mode.id }))}
                className="mt-1"
                disabled={submitting}
              />
              <span>
                <span className="font-semibold text-ink">{mode.label}</span>
                <span className="mt-1 block text-ink-muted">{mode.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={networkLabel}>Venture associations *</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {NETWORK_BRANDS.map((brand) => (
            <button
              key={brand.id}
              type="button"
              aria-pressed={form.ventureAssociations.includes(brand.id)}
              onClick={() => toggleVenture(brand.id)}
              disabled={submitting}
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                form.ventureAssociations.includes(brand.id)
                  ? 'bg-forest-deep text-white'
                  : 'border border-border bg-surface text-ink-muted'
              }`}
            >
              {brand.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block" htmlFor="onboard-interests">
        <span className={networkLabel}>
          Interests <span className="font-normal normal-case tracking-normal text-ink-faint">(optional)</span>
        </span>
        <input
          id="onboard-interests"
          name="interests"
          value={form.interests}
          onChange={(e) => setForm((p) => ({ ...p, interests: e.target.value }))}
          className={networkInput}
          placeholder="e.g. caregiver education, early risk, digital tools"
          disabled={submitting}
        />
      </label>

      <section className="space-y-4" aria-labelledby="consent-choices-title">
        <div>
          <h3 id="consent-choices-title" className="font-serif text-lg text-ink">
            Your consent choices
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            Each choice is separate. You may join privately without public visibility or network
            communications.
          </p>
        </div>

        <label className={networkConsentBox}>
          <input
            id="onboard-private-join"
            name="privateJoinConsent"
            type="checkbox"
            checked={form.privateJoinConsent}
            onChange={(e) => setForm((p) => ({ ...p, privateJoinConsent: e.target.checked }))}
            className="mt-1 h-4 w-4 shrink-0 rounded border-border"
            disabled={submitting}
            required
          />
          <span>
            <span className="font-semibold text-ink">Join privately *</span>
            <span className="mt-1 block">
              I accept membership in the Cognition Network as a private member. My name and biography
              will not be published unless I opt in below.
            </span>
          </span>
        </label>

        <div className="space-y-3 rounded-xl border border-border bg-white p-4">
          <label className="flex items-start gap-3 text-sm text-ink/85">
            <input
              id="onboard-public-profile"
              name="publicProfileConsent"
              type="checkbox"
              checked={form.publicProfileConsent}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  publicProfileConsent: e.target.checked,
                  nameBioConsent: e.target.checked ? p.nameBioConsent : false,
                }))
              }
              className="mt-1 h-4 w-4 shrink-0 rounded border-border"
              disabled={submitting}
            />
            <span>
              <span className="font-semibold text-ink">Public profile visibility</span>
              <span className="mt-1 block">
                I consent to listing beyond private membership. Leave unchecked to stay fully private.
              </span>
            </span>
          </label>

          {form.publicProfileConsent ? (
            <fieldset className="ml-7 space-y-2 border-l-2 border-border pl-4">
              <legend className="sr-only">Visibility level</legend>
              {PUBLIC_VISIBILITY_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface/40 p-3 text-sm"
                >
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option.id}
                    checked={form.profileVisibility === option.id}
                    onChange={() => setForm((p) => ({ ...p, profileVisibility: option.id }))}
                    className="mt-1"
                    disabled={submitting}
                  />
                  <span>
                    <span className="font-semibold text-ink">{option.label}</span>
                    <span className="mt-1 block text-ink-muted">{option.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          ) : null}
        </div>

        <label className={networkConsentBox}>
          <input
            id="onboard-name-bio-consent"
            name="nameBioConsent"
            type="checkbox"
            checked={form.nameBioConsent}
            onChange={(e) => setForm((p) => ({ ...p, nameBioConsent: e.target.checked }))}
            className="mt-1 h-4 w-4 shrink-0 rounded border-border"
            disabled={submitting || !form.publicProfileConsent}
            aria-describedby="onboard-name-bio-hint"
          />
          <span>
            <span className="font-semibold text-ink">Use of name & biography</span>
            <span id="onboard-name-bio-hint" className="mt-1 block">
              I consent to the use of my name and biography as described above. This is directory
              information only — not diagnosis, medical advice, or patient care — and does not imply
              endorsement, employment, clinical approval, or active participation.
              {form.publicProfileConsent ? '' : ' Enable public profile visibility to use this consent.'}
            </span>
          </span>
        </label>

        <div className="space-y-3 rounded-xl border border-border bg-white p-4">
          <label className="flex items-start gap-3 text-sm text-ink/85">
            <input
              id="onboard-communications"
              name="communicationsConsent"
              type="checkbox"
              checked={form.communicationsConsent}
              onChange={(e) => setForm((p) => ({ ...p, communicationsConsent: e.target.checked }))}
              className="mt-1 h-4 w-4 shrink-0 rounded border-border"
              disabled={submitting}
            />
            <span>
              <span className="font-semibold text-ink">Network communications</span>
              <span className="mt-1 block">
                I consent to receive network communications. Leave unchecked for no outreach.
              </span>
            </span>
          </label>

          {form.communicationsConsent ? (
            <fieldset className="ml-7 border-l-2 border-border pl-4">
              <legend className={networkLabel}>How to reach you</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {COMMUNICATION_PREFERENCES.map((pref) => (
                  <label
                    key={pref.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface/40 px-4 py-3 text-sm"
                  >
                    <input
                      type="radio"
                      name="communicationPreference"
                      value={pref.id}
                      checked={form.communicationPreference === pref.id}
                      onChange={() => setForm((p) => ({ ...p, communicationPreference: pref.id }))}
                      disabled={submitting}
                    />
                    <span>{pref.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
        </div>

        <label className={networkConsentBox}>
          <input
            id="onboard-disclosure"
            name="disclosureAcknowledged"
            type="checkbox"
            checked={form.disclosureAcknowledged}
            onChange={(e) => setForm((p) => ({ ...p, disclosureAcknowledged: e.target.checked }))}
            className="mt-1 h-4 w-4 shrink-0 rounded border-border"
            disabled={submitting}
            required
          />
          <span>
            <span className="font-semibold text-ink">Disclosure acknowledgement *</span>
            <span className="mt-1 block">
              I acknowledge that network participation and visibility can change at any time, that
              passive participation is valid, and that no name is published without my approval.
            </span>
          </span>
        </label>
      </section>

      <label className="block" htmlFor="onboard-note">
        <span className={networkLabel}>
          Optional note <span className="font-normal normal-case tracking-normal text-ink-faint">(optional)</span>
        </span>
        <textarea
          id="onboard-note"
          name="note"
          rows={3}
          value={form.note}
          onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
          className={networkInput}
          disabled={submitting}
        />
      </label>

      <button
        type="submit"
        disabled={submitting || !canSubmit}
        aria-busy={submitting}
        className={`${networkPrimaryBtn} px-6 disabled:opacity-60`}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden />
            Submitting…
          </>
        ) : (
          <>
            {NETWORK_PRIMARY_ACTION}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>

      <p className={networkCaption}>{NETWORK_PUBLIC_DISCLAIMER}</p>
    </form>
  )
}
