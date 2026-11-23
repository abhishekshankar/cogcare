export default function DashboardErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50/95 px-4 py-3 text-sm text-red-950/90"
      role="alert"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>{message}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 rounded-full border border-red-300/80 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-red-900 hover:bg-red-50"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  )
}
