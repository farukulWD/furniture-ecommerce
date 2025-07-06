import { POSInterface } from "@/components/admin/pos/pos-interface"

export default function POSPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
      </div>

      <POSInterface />
    </div>
  )
}
