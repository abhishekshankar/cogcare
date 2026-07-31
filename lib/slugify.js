/**
 * URL-safe slug from a display name.
 * @param {string} name
 */
export function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * @param {string} base
 * @param {Set<string>} taken
 */
export function uniqueSlug(base, taken) {
  const root = slugify(base) || 'member'
  if (!taken.has(root)) return root
  for (let i = 2; i < 100; i++) {
    const candidate = `${root}-${i}`
    if (!taken.has(candidate)) return candidate
  }
  return `${root}-${Date.now()}`
}
