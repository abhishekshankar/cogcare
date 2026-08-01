/**
 * Cognition briefing cards — editorial, non-clinical network updates.
 * No diagnosis, PHI, or implied endorsement.
 */

/** @typedef {{ id: string, title: string, summary: string, publishedAt: string, tags?: string[] }} NetworkBriefing */

/** @type {NetworkBriefing[]} */
export const NETWORK_BRIEFINGS = [
  {
    id: 'founding-welcome',
    title: 'Founding cohort orientation',
    summary:
      'How the Cognition Network fits across CogCare, Cogtraining, and Neuro Second Opinion — and what passive private membership means.',
    publishedAt: '2026-07-15',
    tags: ['orientation'],
  },
  {
    id: 'consent-controls',
    title: 'Your consent controls stay independent',
    summary:
      'Visibility, name and biography use, and communications are separate choices. Nothing goes public without recorded approval.',
    publishedAt: '2026-07-20',
    tags: ['privacy'],
  },
  {
    id: 'contribution-scope',
    title: 'Contribution opportunities are always optional',
    summary:
      'When we share a scoped ask, you may express interest, decline quietly, or stay passive. Declining never affects your membership.',
    publishedAt: '2026-07-28',
    tags: ['participation'],
  },
]

/**
 * @param {NetworkBriefing[]} [briefings]
 * @returns {NetworkBriefing[]}
 */
export function sortBriefingsNewestFirst(briefings = NETWORK_BRIEFINGS) {
  return [...briefings].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
}
