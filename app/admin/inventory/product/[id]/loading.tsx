import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProductInventoryLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-36 mb-1" />
                <Skeleton className="h-4 w-36 mb-1" />
                <Skeleton className="h-5 w-24 mt-2" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="mt-4">
                <Skeleton className="h-5 w-48 mb-2" />
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 flex-1" />
                ))}
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>

              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4">
              <div className="flex items-center gap-4 py-3">
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/6" />
              </div>

              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4">
                  <Skeleton className="h-6 w-1/6" />
                  <Skeleton className="h-6 w-1/6" />
                  <Skeleton className="h-6 w-1/6" />
                  <Skeleton className="h-6 w-1/6" />
                  <Skeleton className="h-6 w-1/6" />
                  <Skeleton className="h-6 w-1/6" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
