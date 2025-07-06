"use client"

import { BarChart2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useComparison } from "@/context/comparison-context"
import { useTranslation } from "@/context/i18n-context"

export default function ComparisonButton() {
  const { comparisonCount, clearComparison } = useComparison()
  const router = useRouter()
  const { t } = useTranslation()

  if (comparisonCount === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md"
        onClick={clearComparison}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">{t("clear_comparison")}</span>
      </Button>
      <Button
        onClick={() => router.push("/comparison")}
        className="h-10 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-full shadow-md flex items-center gap-2"
      >
        <BarChart2 className="h-4 w-4" />
        <span>
          {t("compare")} ({comparisonCount})
        </span>
      </Button>
    </div>
  )
}
