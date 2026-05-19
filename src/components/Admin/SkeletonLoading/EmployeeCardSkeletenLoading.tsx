const EmployeeCardSkeletonLoading = () => {
  return (
    <div className="group bg-surface-container-lowest rounded-xl p-4 relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header row */}
      <div className="flex justify-between items-start mb-3">
        <div className="relative">
          <div className="w-14 h-14 rounded-xl bg-surface-container-high" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-slate-300" />
        </div>
        <div className="flex gap-0.5">
          <div className="p-1.5 w-6 h-6 bg-surface-container-high rounded" />
          <div className="p-1.5 w-6 h-6 bg-surface-container-high rounded" />
        </div>
      </div>

      {/* Name & role */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-32 bg-surface-container-high rounded" />
          <div className="h-3 w-12 bg-surface-container-high rounded" />
        </div>
        <div className="h-3 w-24 bg-surface-container-high rounded" />
      </div>

      {/* Contact */}
      <div className="space-y-2 py-3 border-t border-outline-variant/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-surface-container-high rounded" />
          <div className="h-3 w-36 bg-surface-container-high rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-surface-container-high rounded" />
          <div className="h-3 w-28 bg-surface-container-high rounded" />
        </div>
      </div>

      {/* Status */}
      <div className="mt-3 pt-3 border-t border-outline-variant/10 space-y-2">
        <div className="h-2 w-12 bg-surface-container-high rounded" />
        <div className="h-3 w-24 bg-surface-container-high rounded" />
        <div className="h-3 w-20 bg-surface-container-high rounded" />
      </div>
    </div>
  )
}
export default EmployeeCardSkeletonLoading