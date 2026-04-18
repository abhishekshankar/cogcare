export function escapeHtml(s: unknown): string

export function buildBhiReportEmailHtml(
  results: Record<string, unknown> | null | undefined,
  options?: { footerSource?: 'CogCare' | 'CogCare.org' },
): string

export function buildBhiReportWithMagicLinkEmailHtml(
  results: Record<string, unknown> | null | undefined,
  options: {
    magicLinkUrl: string
    email: string
    expiresInMinutes?: number
    isNewAccount?: boolean
    footerSource?: 'CogCare' | 'CogCare.org'
  },
): string
