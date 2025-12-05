"use client"

import { BentoGrid } from "@/components/bento-grid"
import { QuickActions } from "@/components/quick-actions"
import { RecentTransactions } from "@/components/recent-transactions"
import { BottomNav } from "@/components/bottom-nav"
import { MobileHeader } from "@/components/mobile-header"
import { PaymentReminders } from "@/components/payment-reminders"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function DashboardPage() {
  const [includeFutureExpenses, setIncludeFutureExpenses] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="p-4 space-y-4">
        <div className="flex items-center justify-end gap-2">
          <Label htmlFor="future-expenses" className="text-sm font-medium text-muted-foreground">
            未確定の支出・収入を含める
          </Label>
          <Switch id="future-expenses" checked={includeFutureExpenses} onCheckedChange={setIncludeFutureExpenses} />
        </div>

        <PaymentReminders />
        <BentoGrid includeFutureExpenses={includeFutureExpenses} />
        <QuickActions />
        <RecentTransactions includeFutureExpenses={includeFutureExpenses} />
      </main>

      <BottomNav />
    </div>
  )
}
