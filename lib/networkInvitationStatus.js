/**
 * @param {{ status?: string, expiresAt?: string } | null | undefined} invitation
 * @param {number} [nowMs]
 * @returns {string | null} User-facing block message, or null if invite may proceed.
 */
export function inviteStatusMessage(invitation, nowMs = Date.now()) {
  if (!invitation) return null
  if (invitation.status === 'revoked') return 'This invitation has been revoked.'
  if (invitation.status === 'accepted') return 'This invitation has already been accepted.'
  if (invitation.status === 'expired') return 'This invitation has expired.'
  const expiresAt = invitation.expiresAt ? new Date(invitation.expiresAt) : null
  if (expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < nowMs) {
    return 'This invitation has expired.'
  }
  return null
}
