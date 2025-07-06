import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section Skeleton */}
      <Skeleton className="h-[300px] md:h-[400px] mb-12 rounded-lg" />

      {/* Our Story Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-[300px] rounded-lg" />
      </div>

      {/* Mission & Vision Skeleton */}
      <Skeleton className="h-[300px] rounded-lg mb-16" />

      {/* Our Values Skeleton */}
      <div className="mb-16">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      </div>

      {/* Our Team Skeleton */}
      <div className="mb-16">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="w-40 h-40 mx-auto rounded-full mb-4" />
              <Skeleton className="h-5 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Skeleton */}
      <div className="mb-16">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="space-y-12">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Showrooms Skeleton */}
      <div className="mb-16">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      </div>

      {/* CTA Skeleton */}
      <Skeleton className="h-[200px] rounded-lg" />
    </div>
  )
}
