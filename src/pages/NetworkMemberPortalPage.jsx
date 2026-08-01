import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Loader2, Shield, Sparkles, X } from 'lucide-react'
import {
  COMMUNICATION_PREFERENCES,
  PARTICIPATION_MODES,
  PUBLIC_VISIBILITY_OPTIONS,
  validateNetworkMemberProfile,
} from '../../lib/networkMemberProfile.js'
import { NETWORK_BRANDS, brandLabel, parseBrandsJson, roleLabel } from '../../lib/networkConstants.js'
import { NETWORK_CORE_PROMISE, NETWORK_PASSIVE_PRIVATE, NETWORK_PRIVACY_DEFAULT } from '../../lib/networkIntro.js'
import { memberWorkspaceSectionNav } from '../../lib/networkMemberWorkspace.js'
import { NETWORK_PUBLIC_DISCLAIMER, NETWORK_PROFILE_BIO_HINT } from '../lib/consultantVisibility.js'
import { NETWORK_PUBLIC_ROUTES } from '../../lib/networkRoutes.js'
import { hasRecordedContributions } from '../../lib/networkContributions.js'
import { useNetworkMember } from '../hooks/useNetworkMember.js'
import NetworkOnboardingFeedback from '../components/network/NetworkOnboardingFeedback.jsx'
import NetworkVentureCards from '../components/network/NetworkVentureCards.jsx'
import NetworkInstitutionalMemberSections from '../components/network/NetworkInstitutionalMemberSections.jsx'
import { NETWORK_FEEDBACK_CONTEXT_MEMBER_PORTAL } from '../../lib/networkFeedbackTypes.js'
import {
  networkBody,
  networkBodySm,
  networkCaption,
  networkCard,
  networkCardPad,
  networkConsentBox,
  networkDisplaySm,
  networkEyebrow,
  networkInput,
  networkLabel,
  networkPanel,
  networkPrimaryBtn,
  networkSecondaryBtn,
  networkSectionTitle,
  networkStack,
  networkStackTight,
  networkSuccessPanel,
} from '../components/network/networkUi.js'

/**
 * @param {{ email: string }} props
 */
export default function NetworkMemberPortalPage({ email }) {
  const {
    consultant,
    briefings,
    opportunities,
    contributions,
    opportunityResponses,
    workspace,
    profileForm,
    setProfileForm,
    loading,
    error,
    saving,
    saveProfile,
    respondToOpportunity,
    load,
  } = useNetworkMember(email)

  const [profileError, setProfileError] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const [oppError, setOppError] = useState('')
  const [oppBusy, setOppBusy] = useState('')

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-6 w-6 animate-spin text-clay motion-reduce:animate-none" aria-hidden />
        <span className="sr-only">Loading your Cognition Network portal…</span>
      </div>
    )
  }

  if (!consultant) {
    return (
      <section className={`${networkCard} ${networkCardPad}`} aria-labelledby="network-member-missing-title">
        <p className={networkEyebrow}>Cognition Network</p>
        <h1 id="network-member-missing-title" className={`mt-3 ${networkDisplaySm}`}>
          No membership record found
        </h1>
        <p className={`mt-4 ${networkBody}`}>
          This portal is for invited Cognition Network members. If you have a founding invitation, accept it
          first — or sign in with the email your invitation was sent to.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to={NETWORK_PUBLIC_ROUTES.founding} className={networkPrimaryBtn}>
            Understand the Network
          </Link>
          <Link to="/network" className={networkSecondaryBtn}>
            Back to Network home
          </Link>
        </div>
      </section>
    )
  }

  const brands = parseBrandsJson(consultant.networkBrandsJson)
  const responseByOpp = Object.fromEntries(
    opportunityResponses.map((r) => [r.opportunityId, r]),
  )

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setProfileError('')
    setProfileSaved(false)
    const validation = validateNetworkMemberProfile(profileForm)
    if (!validation.ok) {
      setProfileError(validation.error)
      return
    }
    const result = await saveProfile(profileForm)
    if (result.ok) {
      setProfileSaved(true)
    } else if (!result.ok && result.error) {
      setProfileError(result.error)
    }
  }

  async function handleOpportunityResponse(opportunityId, kind) {
    setOppError('')
    setOppBusy(opportunityId)
    try {
      const result = await respondToOpportunity(opportunityId, kind)
      if (!result.ok) setOppError(result.error)
    } finally {
      setOppBusy('')
    }
  }

  function toggleVenture(id) {
    setProfileForm((prev) => {
      const has = prev.ventureAssociations.includes(id)
      const next = has
        ? prev.ventureAssociations.filter((v) => v !== id)
        : [...prev.ventureAssociations, id]
      return { ...prev, ventureAssociations: next.length ? next : [id] }
    })
  }

  const visibilityLabel =
    profileForm.publicProfileConsent && profileForm.profileVisibility === 'public'
      ? 'Public profile'
      : profileForm.publicProfileConsent && profileForm.profileVisibility === 'directory'
        ? 'Directory only'
        : 'Private — no public listing'

  const hasVentures = profileForm.ventureAssociations.length > 0
  const workspaceSections = memberWorkspaceSectionNav({ hasVentures })
  const isPassive = profileForm.participationMode === 'passive'
  const matchedOpportunityCount = opportunities.length
  const recordedContributionCount = contributions.length

  return (
    <div className={networkStack}>
      {error ? (
        <div className="rounded-xl border border-error-border bg-error-bg px-4 py-3 text-sm text-error" role="alert">
          {error}
        </div>
      ) : null}

      <nav
        aria-label="Member workspace sections"
        className="sticky top-0 z-10 flex gap-2 overflow-x-auto rounded-2xl border border-border bg-page/95 px-4 py-3 backdrop-blur"
      >
        {workspaceSections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="shrink-0 rounded-full border border-border bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-forest hover:bg-surface"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <section id="overview" className={`${networkCard} ${networkCardPad}`} aria-labelledby="network-member-overview-title">
        <p className={networkEyebrow}>Cognition Network member workspace</p>
        <h1 id="network-member-overview-title" className={`mt-3 ${networkDisplaySm}`}>
          {NETWORK_CORE_PROMISE}
        </h1>
        <p className={`mt-4 ${networkBody}`}>
          Welcome, {consultant.name}. This is your private professional workspace — not a patient dashboard,
          not a social feed, and not a public endorsement of any venture.
        </p>

        {isPassive ? (
          <div className={`mt-6 ${networkPanel} p-4`} role="status">
            <p className={networkLabel}>Passive membership</p>
            <p className={`mt-2 ${networkBodySm}`}>{NETWORK_PASSIVE_PRIVATE}</p>
          </div>
        ) : null}

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className={`${networkPanel} p-4`}>
            <dt className={networkLabel}>Cohort</dt>
            <dd className="mt-1 text-sm text-ink">{consultant.networkCohort || 'Founding'}</dd>
          </div>
          <div className={`${networkPanel} p-4`}>
            <dt className={networkLabel}>Role</dt>
            <dd className="mt-1 text-sm text-ink">
              {roleLabel(consultant.networkRoleCategory || '')}
            </dd>
          </div>
          <div className={`${networkPanel} p-4`}>
            <dt className={networkLabel}>Participation</dt>
            <dd className="mt-1 text-sm text-ink">
              {PARTICIPATION_MODES.find((m) => m.id === profileForm.participationMode)?.label || 'Passive'}
            </dd>
          </div>
          <div className={`${networkPanel} p-4`}>
            <dt className={networkLabel}>Visibility</dt>
            <dd className="mt-1 text-sm text-ink">{visibilityLabel}</dd>
          </div>
          <div className={`${networkPanel} p-4`}>
            <dt className={networkLabel}>Matched opportunities</dt>
            <dd className="mt-1 text-sm text-ink">
              {matchedOpportunityCount
                ? `${matchedOpportunityCount} scoped ask${matchedOpportunityCount === 1 ? '' : 's'} for your ventures`
                : 'None for your current venture associations'}
            </dd>
          </div>
          <div className={`${networkPanel} p-4`}>
            <dt className={networkLabel}>Recorded contributions</dt>
            <dd className="mt-1 text-sm text-ink">
              {recordedContributionCount
                ? `${recordedContributionCount} verified on file`
                : 'None recorded — membership alone does not create activity'}
            </dd>
          </div>
        </dl>

        <p className={`mt-6 ${networkCaption}`}>
          Use the section links above to review briefings, adjust consent, respond to optional asks, or
          leave everything unchanged.
        </p>
        <p className={`mt-2 ${networkCaption}`}>{NETWORK_PUBLIC_DISCLAIMER}</p>
      </section>

      <section id="briefings" className={`${networkCard} ${networkCardPad}`} aria-labelledby="network-member-briefings-title">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden />
          <div>
            <h2 id="network-member-briefings-title" className={networkSectionTitle}>
              Cognition briefings
            </h2>
            <p className={`mt-2 ${networkBodySm}`}>
              Short orientation notes — not clinical guidance or patient care.
            </p>
          </div>
        </div>
        {briefings.length ? <ul className={`mt-6 ${networkStackTight}`}>
          {briefings.map((b) => (
            <li key={b.id} className={`${networkPanel} p-5`}>
              <p className={networkEyebrow}>{b.publishedAt}</p>
              <h3 className={`mt-2 font-serif text-lg text-ink`}>{b.title}</h3>
              <p className={`mt-2 ${networkBodySm}`}>{b.summary}</p>
            </li>
          ))}
        </ul> : <p className={`mt-6 ${networkBodySm}`}>No briefings have been published for members yet.</p>}
      </section>

      {hasVentures ? (
        <div id="ventures">
          <NetworkVentureCards
            ventureAssociations={profileForm.ventureAssociations}
            memberPortalReturnTo="/network/member"
          />
        </div>
      ) : null}

      <section id="profile" className={`${networkCard} ${networkCardPad}`} aria-labelledby="network-member-profile-title">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden />
          <div>
            <h2 id="network-member-profile-title" className={networkSectionTitle}>
              Profile & consent
            </h2>
            <p className={`mt-2 ${networkBodySm}`}>{NETWORK_PRIVACY_DEFAULT}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className={`mt-8 ${networkStackTight}`}>
          {profileError ? (
            <div className="rounded-xl border border-error-border bg-error-bg px-4 py-3 text-sm text-error" role="alert">
              {profileError}
            </div>
          ) : null}
          {profileSaved ? (
            <div className={`${networkSuccessPanel} px-4 py-3 ${networkBodySm}`} role="status" aria-live="polite">
              Your settings were saved.
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2" htmlFor="member-name">
              <span className={networkLabel}>Name</span>
              <input
                id="member-name"
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                className={networkInput}
                disabled={saving}
              />
            </label>
            <label className="block sm:col-span-2" htmlFor="member-title">
              <span className={networkLabel}>Professional title</span>
              <input
                id="member-title"
                value={profileForm.title}
                onChange={(e) => setProfileForm((p) => ({ ...p, title: e.target.value }))}
                className={networkInput}
                disabled={saving}
              />
            </label>
            <label className="block sm:col-span-2" htmlFor="member-organization">
              <span className={networkLabel}>Organization</span>
              <input
                id="member-organization"
                value={profileForm.organization}
                onChange={(e) => setProfileForm((p) => ({ ...p, organization: e.target.value }))}
                className={networkInput}
                disabled={saving}
              />
            </label>
            <label className="block sm:col-span-2" htmlFor="member-bio">
              <span className={networkLabel}>Biography (optional)</span>
              <textarea
                id="member-bio"
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                className={networkInput}
                aria-describedby="member-bio-hint"
                disabled={saving}
              />
              <p id="member-bio-hint" className={`mt-2 ${networkCaption}`}>
                {NETWORK_PROFILE_BIO_HINT}
              </p>
            </label>
          </div>

          <fieldset>
            <legend className={networkLabel}>Participation mode</legend>
            <p className={`mt-2 ${networkCaption}`}>{NETWORK_PASSIVE_PRIVATE}</p>
            <div className="mt-4 space-y-3">
              {PARTICIPATION_MODES.map((mode) => (
                <label key={mode.id} className={`${networkConsentBox} cursor-pointer`}>
                  <input
                    type="radio"
                    name="participationMode"
                    value={mode.id}
                    checked={profileForm.participationMode === mode.id}
                    onChange={() => setProfileForm((p) => ({ ...p, participationMode: mode.id }))}
                    disabled={saving}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium text-ink">{mode.label}</span>
                    <span className={`mt-1 block ${networkCaption}`}>{mode.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={networkLabel}>Venture associations</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {NETWORK_BRANDS.map((brand) => {
                const active = profileForm.ventureAssociations.includes(brand.id)
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => toggleVenture(brand.id)}
                    disabled={saving}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? 'border-forest-deep bg-forest-deep/10 text-forest-deep'
                        : 'border-border bg-white text-ink-muted hover:bg-surface'
                    }`}
                  >
                    {brand.label}
                  </button>
                )
              })}
            </div>
            <p className={`mt-2 ${networkCaption}`}>
              Association is directory context only — not employment or endorsement.
            </p>
          </fieldset>

          <fieldset>
            <legend className={networkLabel}>Public visibility (independent)</legend>
            <label className={`${networkConsentBox} mt-3 cursor-pointer`}>
              <input
                id="member-public-profile"
                type="checkbox"
                checked={profileForm.publicProfileConsent}
                onChange={(e) =>
                  setProfileForm((p) => ({
                    ...p,
                    publicProfileConsent: e.target.checked,
                    profileVisibility: e.target.checked ? p.profileVisibility || 'public' : 'private',
                    nameBioConsent: e.target.checked ? p.nameBioConsent : false,
                  }))
                }
                disabled={saving}
              />
              <span>I opt in to listing my professional profile in the network.</span>
            </label>

            {profileForm.publicProfileConsent ? (
              <div className="mt-4 space-y-3">
                {PUBLIC_VISIBILITY_OPTIONS.map((opt) => (
                  <label key={opt.id} className={`${networkConsentBox} cursor-pointer`}>
                    <input
                      type="radio"
                      name="profileVisibility"
                      value={opt.id}
                      checked={profileForm.profileVisibility === opt.id}
                      onChange={() => setProfileForm((p) => ({ ...p, profileVisibility: opt.id }))}
                      disabled={saving}
                    />
                    <span>
                      <span className="font-medium text-ink">{opt.label}</span>
                      <span className={`mt-1 block ${networkCaption}`}>{opt.description}</span>
                    </span>
                  </label>
                ))}
                <label className={`${networkConsentBox} cursor-pointer`}>
                  <input
                    id="member-name-bio"
                    type="checkbox"
                    checked={profileForm.nameBioConsent}
                    onChange={(e) => setProfileForm((p) => ({ ...p, nameBioConsent: e.target.checked }))}
                    disabled={saving}
                  />
                  <span>I consent to use my name and biography as described above.</span>
                </label>
              </div>
            ) : (
              <p className={`mt-3 ${networkBodySm}`}>Private — no public listing. Passive participation is valid.</p>
            )}
          </fieldset>

          <fieldset>
            <legend className={networkLabel}>Communications (independent)</legend>
            <label className={`${networkConsentBox} mt-3 cursor-pointer`}>
              <input
                id="member-communications"
                type="checkbox"
                checked={profileForm.communicationsConsent}
                onChange={(e) =>
                  setProfileForm((p) => ({
                    ...p,
                    communicationsConsent: e.target.checked,
                  }))
                }
                disabled={saving}
              />
              <span>I would like to receive network communications.</span>
            </label>
            {profileForm.communicationsConsent ? (
              <div className="mt-3 space-y-2">
                {COMMUNICATION_PREFERENCES.map((pref) => (
                  <label key={pref.id} className={`${networkConsentBox} cursor-pointer`}>
                    <input
                      type="radio"
                      name="communicationPreference"
                      value={pref.id}
                      checked={profileForm.communicationPreference === pref.id}
                      onChange={() =>
                        setProfileForm((p) => ({ ...p, communicationPreference: pref.id }))
                      }
                      disabled={saving}
                    />
                    <span>{pref.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className={`mt-3 ${networkBodySm}`}>No network communications.</p>
            )}
          </fieldset>

          <button type="submit" disabled={saving} className={networkPrimaryBtn} aria-busy={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
            Save profile & consent
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </form>
      </section>

      <section id="opportunities" className={`${networkCard} ${networkCardPad}`} aria-labelledby="network-member-opportunities-title">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden />
          <div>
            <h2 id="network-member-opportunities-title" className={networkSectionTitle}>
              Matched contribution opportunities
            </h2>
            <p className={`mt-2 ${networkBodySm}`}>
              Optional asks scoped to your venture associations. Express interest or decline quietly — neither
              implies endorsement. Your response is saved privately and can be withdrawn later.
            </p>
          </div>
        </div>

        {oppError ? (
          <p className="mt-4 rounded-xl border border-error-border bg-error-bg px-4 py-3 text-sm text-error" role="alert">
            {oppError}
          </p>
        ) : null}

        {opportunities.length ? (
        <ul className={`mt-6 ${networkStackTight}`}>
          {opportunities.map((opp) => {
            const response = responseByOpp[opp.id]
            const busy = oppBusy === opp.id
            return (
              <li key={opp.id} className={`${networkPanel} p-5`}>
                <p className={networkEyebrow}>{brandLabel(opp.brand)}</p>
                <h3 className="mt-2 font-serif text-lg text-ink">{opp.title}</h3>
                {opp.why ? (
                  <p className={`mt-2 ${networkBodySm}`}>
                    <span className={networkLabel}>Why: </span>
                    {opp.why}
                  </p>
                ) : null}
                <p className={`mt-2 ${networkBodySm}`}>{opp.scope}</p>
                <p className={`mt-2 ${networkCaption}`}>Time: {opp.timeCommitment}</p>
                {response ? (
                  <p className={`mt-4 ${networkBodySm}`} role="status">
                    {response.kind === 'interest' ? (
                      <span className="inline-flex items-center gap-1 text-forest-deep">
                        <Check className="h-4 w-4" aria-hidden /> Interest recorded — we will follow up if needed.
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-ink-muted">
                        <X className="h-4 w-4" aria-hidden /> Declined — no further action expected.
                      </span>
                    )}
                  </p>
                ) : (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleOpportunityResponse(opp.id, 'interest')}
                      className={networkPrimaryBtn}
                      aria-busy={busy}
                    >
                      Express interest
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleOpportunityResponse(opp.id, 'declined')}
                      className={networkSecondaryBtn}
                    >
                      Decline quietly
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
        ) : (
          <p className={`mt-6 ${networkBodySm}`}>
            No opportunities match your current venture associations. You can add associations under Profile
            & consent, or remain passive — both are valid.
          </p>
        )}
      </section>

      <section id="activity" className={`${networkCard} ${networkCardPad}`} aria-labelledby="network-member-activity-title">
        <h2 id="network-member-activity-title" className={networkSectionTitle}>
          Verified contributions & impact
        </h2>
        <p className={`mt-2 ${networkBodySm}`}>
          Only contributions we have recorded appear here — we do not infer participation from membership alone.
        </p>
        {hasRecordedContributions(contributions) ? (
          <ul className={`mt-6 ${networkStackTight}`}>
            {contributions.map((c) => (
              <li key={c.id} className={`${networkPanel} p-5`}>
                <p className={networkEyebrow}>{c.recordedAt || c.verifiedAt}</p>
                <h3 className="mt-2 font-serif text-lg text-ink">{c.title}</h3>
                {c.recognition || c.description ? <p className={`mt-2 ${networkBodySm}`}>{c.recognition || c.description}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className={`mt-6 ${networkBodySm}`}>
            No recorded contributions yet. Passive private membership is valid — recognition appears only after
            a contribution is logged.
          </p>
        )}
      </section>

      <NetworkInstitutionalMemberSections
        workspace={workspace}
        onRefresh={load}
        communicationsConsent={profileForm.communicationsConsent}
      />

      <div id="feedback">
        <NetworkOnboardingFeedback
          memberEmail={email}
          slug={consultant.slug}
          feedbackContext={NETWORK_FEEDBACK_CONTEXT_MEMBER_PORTAL}
        />
      </div>

      {brands.length && consultant.slug && profileForm.publicProfileConsent ? (
        <p className={networkCaption}>
          Public profile (if enabled):{' '}
          <Link to={NETWORK_PUBLIC_ROUTES.consultantProfile(consultant.slug)} className="underline">
            /dr/{consultant.slug}
          </Link>
        </p>
      ) : null}
    </div>
  )
}
