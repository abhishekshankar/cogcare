export function escapeHtml(s: unknown): string
export function buildBhiReportEmailHtml(
  results: Record<string, unknown> | null | undefined,
  options?: { footerSource?: 'CogCare' | 'CogCare.org' },
): string
