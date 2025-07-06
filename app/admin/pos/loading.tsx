import { Skeleton } from "@/components/ui/skeleton"

export default function POSLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        <div className="lg:col-span-2 border rounded-md p-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-md" />
              ))}
          </div>
        </div>

        <div className="border rounded-md p-4 flex flex-col">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-4 flex-1">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
