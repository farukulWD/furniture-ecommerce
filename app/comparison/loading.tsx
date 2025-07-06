import { Skeleton } from "@/components/ui/skeleton"

export default function ComparisonLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>

        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mb-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
