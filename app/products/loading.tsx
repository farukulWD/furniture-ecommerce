import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-96 mb-6" />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar skeleton */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="border rounded-md p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>

            <div className="space-y-6">
              <div>
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-28 mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-24 mb-3" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product grid skeleton */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <Skeleton className="h-4 w-48 mb-2 sm:mb-0" />
            <Skeleton className="h-9 w-48" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border rounded-md p-2">
                <Skeleton className="w-full aspect-square mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
