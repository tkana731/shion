"use client"

import { Sparkles, Eye, EyeOff } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function BudgetHero() {
  const [isVisible, setIsVisible] = useState(true)

  const totalBudget = 200000
  const spent = 125000
  const remaining = totalBudget - spent
  const percentageUsed = (spent / totalBudget) * 100

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary px-6 pt-6 pb-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-white/90" />
            <p className="text-white/90 text-sm font-medium">推し活を楽しもう</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 text-balance">今月あと</h1>
        <p className="text-6xl font-black text-white mb-6">
          {isVisible ? `¥${remaining.toLocaleString("ja-JP")}` : "¥***,***"}
        </p>

        <div className="space-y-2 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex justify-between text-sm text-white/90 mb-2">
            <span>使用済: {isVisible ? `¥${spent.toLocaleString("ja-JP")}` : "¥***,***"}</span>
            <span>予算: {isVisible ? `¥${totalBudget.toLocaleString("ja-JP")}` : "¥***,***"}</span>
          </div>
          <Progress value={percentageUsed} className="h-3 bg-white/20" />
          <p className="text-xs text-white/80 text-center mt-2">予算の{percentageUsed.toFixed(0)}%を使用中</p>
        </div>
      </div>
    </div>
  )
}
