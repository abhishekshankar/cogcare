/** Placeholder blocks while dashboard data loads — header and tabs stay visible. */
export default function DashboardMainSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-[#E8DCC4]/80" />
        <div className="h-8 w-48 max-w-full rounded bg-[#E8DCC4]/70" />
        <div className="h-4 w-full max-w-md rounded bg-[#F3EFE9]" />
      </div>
      <div className="rounded-3xl border border-[#E8DCC4]/80 bg-white p-8 shadow-sm">
        <div className="h-3 w-20 rounded bg-[#F3EFE9]" />
        <div className="mt-6 h-14 w-40 rounded bg-[#E8DCC4]/70" />
        <div className="mt-6 h-3 w-full rounded-full bg-[#F3EFE9]" />
        <div className="mt-4 h-3 w-2/3 rounded bg-[#F3EFE9]" />
      </div>
    </div>
  )
}
