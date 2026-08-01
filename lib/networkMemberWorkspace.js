/**
 * In-page member workspace section anchors for `/network/member`.
 */

/**
 * @param {{ hasVentures?: boolean }} options
 * @returns {{ id: string, label: string }[]}
 */
export function memberWorkspaceSectionNav({ hasVentures = false } = {}) {
  return [
    { id: 'overview', label: 'Overview' },
    { id: 'briefings', label: 'Briefings' },
    hasVentures ? { id: 'ventures', label: 'Ventures' } : null,
    { id: 'profile', label: 'Profile & consent' },
    { id: 'opportunities', label: 'Matched opportunities' },
    { id: 'activity', label: 'Activity' },
    { id: 'institution', label: 'Institution' },
    { id: 'feedback', label: 'Feedback' },
  ].filter(Boolean)
}
