import { getDataClient } from './dataClient.js'

/**
 * Idempotent seed for the founding internal consultant (Dr. Nasir Ahmad).
 * Call once per environment from a signed-in admin context, e.g. via the
 * browser console:  await window.__seedFoundingConsultant()
 *
 * Safe to re-run: checks for an existing row by name before creating.
 */
export async function seedFoundingConsultant() {
  const client = getDataClient()
  const existing = await client.models.Consultant.list({ limit: 50 })
  const already = existing?.data?.find(
    (c) => c.name?.toLowerCase() === 'dr. nasir ahmad, md',
  )
  if (already) {
    return { created: false, id: already.id }
  }

  const { data, errors } = await client.models.Consultant.create({
    name: 'Dr. Nasir Ahmad, MD',
    title: 'Founder & Chief Medical Officer',
    credentials: 'MD, Board-Certified Psychiatrist',
    bio: 'Founder of CogCare. Sees patients via telehealth and at our flagship location.',
    photoUrl: '/nasir-photo.jpg',
    // TODO: replace with the real Calendly event URL.
    bookingUrl: 'https://calendly.com/cogcare/30min',
    contactEmail: 'hello@cogcare.org',
    affiliation: 'in_house',
    licensedStates: ['NJ'],
    locationCity: 'Jersey City',
    locationState: 'NJ',
    sortOrder: 0,
  })
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('; '))
  }
  return { created: true, id: data?.id }
}

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Expose for one-shot console seeding in dev.
  window.__seedFoundingConsultant = seedFoundingConsultant
}
