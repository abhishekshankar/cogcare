import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { isVisibleTo, NETWORK_PUBLIC_DISCLAIMER } from '../lib/consultantVisibility'
import { publicVentureAssociationsForConsultant } from '../../lib/networkVentureAssociation.js'
import { useDocumentMeta } from '../lib/useDocumentMeta'
import { buildConsultantOgDataUrl } from '../lib/buildConsultantOgImage'
import { getMergedAmplifyOutputs } from '../lib/amplifyOutputs.js'


const AFFILIATION_BADGE = {
  in_house: { label: 'CogCare Clinical', cls: 'bg-[#B8D9C1]/40 text-[#2D3D2E]' },
  verified_partner: { label: 'Verified Partner', cls: 'bg-amber-100/70 text-amber-900' },
  marketplace: { label: 'Marketplace', cls: 'bg-stone-200/70 text-stone-800' },
}

export default function ConsultantProfilePage() {
  const { slug } = useParams()
  const [state, setState] = useState({ status: 'loading', consultant: null })

  const meta = useMemo(() => {
    if (state.status !== 'ok' || !state.consultant) return {}
    const c = state.consultant
    const sublineParts = [c.credentials, c.title, c.organization].filter(Boolean)
    const subline = sublineParts.join(' · ')
    const description = c.bio
      ? c.bio.replace(/\s+/g, ' ').slice(0, 280)
      : `${c.name}${subline ? ' — ' + subline : ''} on CogCare.`
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://cogcare.org'
    const canonical = `${origin}/dr/${c.slug}`
    const ogImage = buildConsultantOgDataUrl(c)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name: c.name,
      description,
      url: canonical,
      image: c.photoUrl ? new URL(c.photoUrl, origin).toString() : undefined,
      medicalSpecialty: c.title || undefined,
      areaServed: Array.isArray(c.licensedStates)
        ? c.licensedStates.map((code) => ({ '@type': 'State', name: code }))
        : undefined,
      affiliation: c.organization
        ? { '@type': 'Organization', name: c.organization }
        : c.affiliation
          ? { '@type': 'Organization', name: 'CogCare' }
          : undefined,
    }
    return {
      title: `${c.name} — CogCare`,
      description,
      ogImage,
      canonical,
      jsonLd,
    }
  }, [state])

  useDocumentMeta(meta)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const url = getMergedAmplifyOutputs()?.custom?.networkPublicDataFunctionUrl
        if (typeof url !== 'string' || !url.startsWith('http')) throw new Error('Profile lookup unavailable.')
        const res = await fetch(`${url}?slug=${encodeURIComponent(slug)}`)
        const body = await res.json().catch(() => ({}))
        const found = res.ok ? body.consultant : null
        if (cancelled) return
        if (!found || !isVisibleTo(found, 'profile')) {
          setState({ status: 'notfound', consultant: null })
        } else {
          setState({ status: 'ok', consultant: found })
        }
      } catch (e) {
        if (!cancelled) setState({ status: 'error', consultant: null, message: e?.message })
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-page text-forest">
        <p className="text-sm">Loading…</p>
      </div>
    )
  }

  if (state.status === 'notfound') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center text-forest">
        <h1 className="font-serif text-2xl">Consultant not found</h1>
        <p className="mt-3 text-sm text-forest/70">
          This profile may have moved or is no longer available.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm underline underline-offset-2">
          Back to CogCare
        </Link>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center text-forest">
        <h1 className="font-serif text-2xl">Something went wrong</h1>
        <p className="mt-3 text-sm text-forest/70">Please try again in a moment.</p>
      </div>
    )
  }

  const c = state.consultant
  const publicVentures = publicVentureAssociationsForConsultant(c)
  const badge = c.networkCohort
    ? { label: 'Cognition Network member', cls: 'bg-surface text-forest' }
    : AFFILIATION_BADGE[c.affiliation]
  const isBookable = c.isActive !== false && c.bookingUrl

  return (
    <div className="bg-page text-forest">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <Link to="/" className="text-xs uppercase tracking-[0.14em] text-clay">
          ← CogCare
        </Link>
        <div className="mt-6 grid gap-8 sm:grid-cols-[200px_1fr] sm:gap-10">
          {c.photoUrl ? (
            <img
              src={c.photoUrl}
              alt={c.name}
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="aspect-[4/5] w-full rounded-2xl bg-surface" />
          )}
          <div>
            <h1 className="font-serif text-3xl text-forest sm:text-4xl">{c.name}</h1>
            {c.credentials ? (
              <p className="mt-1 text-sm text-forest/75">{c.credentials}</p>
            ) : null}
            {c.organization ? (
              <p className="mt-2 text-sm text-forest/80">{c.organization}</p>
            ) : null}
            {c.title ? (
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-clay">
                {c.title}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {badge ? (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.cls}`}
                >
                  {badge.label}
                </span>
              ) : null}
              {c.licensedStates?.length ? (
                <span className="rounded-full border border-border bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest/80">
                  Licensed: {c.licensedStates.join(', ')}
                </span>
              ) : null}
              {(c.locationCity || c.locationState) && (
                <span className="rounded-full border border-border bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest/80">
                  {[c.locationCity, c.locationState].filter(Boolean).join(', ')}
                </span>
              )}
              {publicVentures.map((v) => (
                <span
                  key={v.id}
                  className="rounded-full border border-border bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest/80"
                >
                  {v.label} association
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {isBookable ? (
                <a
                  href={c.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[44px] items-center rounded-full bg-forest px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
                >
                  Book a consultation
                </a>
              ) : (
                <span className="rounded-full border border-border px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest/60">
                  Booking unavailable
                </span>
              )}
              <Link
                to="/login"
                className="inline-flex min-h-[44px] items-center rounded-full border border-border px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest"
              >
                Take the brain quiz first
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                className="rounded-full border border-border px-3 py-1.5 font-medium text-forest"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href)
                  } catch {
                    /* clipboard unavailable; ignore */
                  }
                }}
              >
                Copy link
              </button>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-3 py-1.5 font-medium text-forest"
              >
                Share on LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(c.name + ' — CogCare')}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-3 py-1.5 font-medium text-forest"
              >
                Share on X
              </a>
            </div>
          </div>
        </div>

        {c.bio ? (
          <section className="mt-10 max-w-2xl">
            <h2 className="font-serif text-xl">About</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-forest/85">
              {c.bio}
            </p>
          </section>
        ) : null}

        {c.contactEmail ? (
          <p className="mt-10 text-xs text-forest/60">
            Contact:{' '}
            <a href={`mailto:${c.contactEmail}`} className="underline underline-offset-2">
              {c.contactEmail}
            </a>
          </p>
        ) : null}

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-forest/55">{NETWORK_PUBLIC_DISCLAIMER}</p>
      </div>
    </div>
  )
}
