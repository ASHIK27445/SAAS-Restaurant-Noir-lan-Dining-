// Skeleton Components - আপনার ফাইলের উপরে যোগ করুন

const CategoryCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
      <div className="flex h-60">
        <div className="w-1/2 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-4 w-12 bg-outline-variant/30 rounded"></div>
              <div className="h-3 w-16 bg-outline-variant/30 rounded"></div>
            </div>
            <div className="h-7 w-32 bg-outline-variant/30 rounded mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-outline-variant/30 rounded"></div>
              <div className="h-4 w-3/4 bg-outline-variant/30 rounded"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-outline-variant/30"></div>
              <div className="h-3 w-16 bg-outline-variant/30 rounded"></div>
            </div>
            <div className="h-6 w-6 rounded-full bg-outline-variant/30"></div>
          </div>
        </div>
        <div className="w-1/2 bg-linear-to-br from-outline-variant/20 to-outline-variant/10"></div>
      </div>
    </div>
  </div>
);

const SmallCardSkeleton = () => (
  <div className="animate-pulse bg-surface-container-lowest rounded-xl p-5">
    <div className="flex justify-between items-start mb-4">
      <div className="h-10 w-10 rounded-xl bg-outline-variant/30"></div>
      <div className="h-4 w-12 bg-outline-variant/30 rounded"></div>
    </div>
    <div className="h-6 w-32 bg-outline-variant/30 rounded mb-2"></div>
    <div className="space-y-2 mb-4">
      <div className="h-3 w-full bg-outline-variant/30 rounded"></div>
      <div className="h-3 w-3/4 bg-outline-variant/30 rounded"></div>
    </div>
    <div className="pt-4 border-t border-outline-variant/10">
      <div className="flex justify-between items-center">
        <div className="h-3 w-20 bg-outline-variant/30 rounded"></div>
        <div className="h-3 w-16 bg-outline-variant/30 rounded"></div>
      </div>
    </div>
  </div>
);

const WideCardSkeleton = () => (
  <div className="animate-pulse bg-surface-container-lowest rounded-xl overflow-hidden">
    <div className="flex h-60 flex-row-reverse">
      <div className="w-1/2 p-5 flex flex-col justify-between bg-surface-container-high">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-4 w-14 bg-outline-variant/30 rounded"></div>
            <div className="h-3 w-12 bg-outline-variant/30 rounded"></div>
          </div>
          <div className="h-7 w-40 bg-outline-variant/30 rounded mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-outline-variant/30 rounded"></div>
            <div className="h-4 w-3/4 bg-outline-variant/30 rounded"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 bg-outline-variant/30 rounded"></div>
          <div className="h-7 w-24 bg-outline-variant/30 rounded"></div>
        </div>
      </div>
      <div className="w-1/2 bg-linear-to-br from-outline-variant/20 to-outline-variant/10"></div>
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <div className="grid grid-cols-12 px-4 py-3.5 items-center bg-surface-container-lowest rounded-xl animate-pulse">
    <div className="col-span-5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-outline-variant/30"></div>
      <div>
        <div className="h-4 w-32 bg-outline-variant/30 rounded mb-1"></div>
        <div className="h-3 w-48 bg-outline-variant/30 rounded"></div>
      </div>
    </div>
    <div className="col-span-2 flex justify-center">
      <div className="h-4 w-8 bg-outline-variant/30 rounded"></div>
    </div>
    <div className="col-span-2 flex justify-center">
      <div className="h-4 w-8 bg-outline-variant/30 rounded"></div>
    </div>
    <div className="col-span-2 flex justify-center">
      <div className="h-5 w-16 bg-outline-variant/30 rounded-full"></div>
    </div>
    <div className="col-span-1 flex justify-end gap-1.5">
      <div className="h-7 w-7 rounded-lg bg-outline-variant/30"></div>
      <div className="h-7 w-7 rounded-lg bg-outline-variant/30"></div>
    </div>
  </div>
);


const CategoryManagementSkeletonLoading = () => {
    return (
    <div className="bg-surface text-on-surface min-h-screen flex font-body">
      <main className="flex-1 flex flex-col min-h-screen">
        <section className="px-8 pt-3 pb-8 space-y-6">

          {/* Header Skeleton */}
          <div className="flex justify-between items-end animate-pulse">
            <div className="max-w-2xl">
              <div className="h-8 w-64 bg-outline-variant/30 rounded mb-2"></div>
              <div className="h-4 w-96 bg-outline-variant/30 rounded"></div>
              <div className="h-3 w-48 bg-outline-variant/30 rounded mt-2"></div>
            </div>
            <div className="h-10 w-36 bg-outline-variant/30 rounded-xl"></div>
          </div>

          {/* Featured Bento Grid Skeleton */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8">
              <CategoryCardSkeleton />
            </div>
            <div className="col-span-12 md:col-span-4 space-y-4">
              <SmallCardSkeleton />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <SmallCardSkeleton />
            </div>
            <div className="col-span-12 md:col-span-8">
              <WideCardSkeleton />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-surface-container-low rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5 animate-pulse">
              <div>
                <div className="h-6 w-32 bg-outline-variant/30 rounded mb-1"></div>
                <div className="h-3 w-48 bg-outline-variant/30 rounded"></div>
              </div>
              <div className="h-8 w-48 bg-outline-variant/30 rounded-xl"></div>
            </div>

            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
export default CategoryManagementSkeletonLoading