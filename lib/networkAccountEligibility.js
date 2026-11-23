export const BLOCKING_NETWORK_INVITE_STATUSES = new Set(['pending', 'accepted'])

export function hasBlockingNetworkInvitation(invitations, email) {
  const normalized = typeof email === 'string' ? email.trim().toLowerCase() : ''
  return Boolean(normalized && invitations?.some((invite) =>
    typeof invite?.email === 'string' &&
    invite.email.trim().toLowerCase() === normalized &&
    BLOCKING_NETWORK_INVITE_STATUSES.has(invite.status),
  ))
}
