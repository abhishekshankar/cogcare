/**
 * @param {Record<string, unknown> | null | undefined} claims — verified Cognito JWT claims
 * @returns {boolean}
 */
export function hasAdminGroup(claims) {
  const groups = claims?.['cognito:groups']
  return Array.isArray(groups) && groups.includes('admin')
}
