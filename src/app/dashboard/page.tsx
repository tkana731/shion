"use client"

import { redirect } from 'next/navigation';
import { BentoGrid } from "@/components/bento-grid"
import { QuickActions } from "@/components/quick-actions"
import { RecentTransactions } from "@/components/recent-transactions"
import { BottomNav } from "@/components/bottom-nav"
import { MobileHeader } from "@/components/mobile-header"
import { PaymentReminders } from "@/components/payment-reminders"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [includeFutureExpenses, setIncludeFutureExpenses] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        redirect('/login')
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">読み込み中...</div>
  }

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
