/**
 * @param {{ memberId?: string } | null | undefined} record
 * @param {string | null | undefined} memberId
 * @returns {boolean}
 */
export function isOwnedByMember(record, memberId) {
  return Boolean(record) && Boolean(memberId) && record.memberId === memberId
}
