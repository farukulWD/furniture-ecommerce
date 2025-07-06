import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b">
            <div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48 mt-1" />
            </div>

            <div className="text-right">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-32 mt-1" />
            </div>
          </div>

          <div className="p-6 border-b">
            <Skeleton className="h-6 w-32 mb-6" />

            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-5 w-48 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center border-b pb-4">
                  <Skeleton className="w-16 h-16 rounded" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-5 w-48 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
