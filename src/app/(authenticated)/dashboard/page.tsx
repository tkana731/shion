"use client"

import { BentoGrid } from "@/components/bento-grid"
import { QuickActions } from "@/components/quick-actions"
import { RecentTransactions } from "@/components/recent-transactions"
import { PaymentReminders } from "@/components/payment-reminders"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [includeFutureExpenses, setIncludeFutureExpenses] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // ページに戻ってきたときにデータを再読み込み
  useEffect(() => {
    const handleFocus = () => {
      setRefreshTrigger(prev => prev + 1)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Label htmlFor="future-expenses" className="text-sm font-medium text-muted-foreground">
          未確定の支出・収入を含める
        </Label>
        <Switch id="future-expenses" checked={includeFutureExpenses} onCheckedChange={setIncludeFutureExpenses} />
      </div>

      <PaymentReminders />
      <BentoGrid includeFutureExpenses={includeFutureExpenses} />
      <QuickActions />
      <RecentTransactions
        includeFutureExpenses={includeFutureExpenses}
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
}
