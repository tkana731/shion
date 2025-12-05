"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Eye, EyeOff, TrendingUp, Star, Banknote } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface BentoGridProps {
  includeFutureExpenses: boolean
}

export function BentoGrid({ includeFutureExpenses }: BentoGridProps) {
  const [isVisible, setIsVisible] = useState(true)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const periodStart = `${year}/${month}/1`
  const lastDay = new Date(year, month, 0).getDate()
  const periodEnd = `${year}/${month}/${lastDay}`
  const currentPeriod = `${periodStart} 〜 ${periodEnd}`

  const futureExpenses = 35000
  const totalBudget = 200000
  const currentSpent = 125000
  const spent = includeFutureExpenses ? currentSpent + futureExpenses : currentSpent
  const remaining = totalBudget - spent
  const percentageUsed = (spent / totalBudget) * 100

  const previousMonthSpent = 111111
  const monthOverMonth = ((spent - previousMonthSpent) / previousMonthSpent) * 100
  const isIncrease = monthOverMonth > 0

  const categories = [
    {
      id: 1,
      label: "推し活費用",
      amount: 78000,
      budget: 100000,
      icon: Star,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      id: 2,
      label: "生活費",
      amount: 47000,
      budget: 80000,
      icon: Wallet,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ]

  const oshiData = [
    { name: "さくら", amount: 845000, color: "bg-pink-500" },
    { name: "みお", amount: 640000, color: "bg-purple-500" },
  ]
  const totalOshiSpending = oshiData.reduce((sum, oshi) => sum + oshi.amount, 0)

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Large card - Budget remaining (hero) */}
      <Card className="col-span-2 overflow-hidden border shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Banknote className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">今月の予算</span>
                <p className="text-xs text-muted-foreground">{currentPeriod}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="h-9 w-9 p-0 hover:bg-primary/10 rounded-full"
            >
              {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500/10 text-blue-600 p-1.5 rounded-lg">
                  <Banknote className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium text-foreground">総予算</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {isVisible ? `¥${spent.toLocaleString("ja-JP")}` : "¥***,***"}
                </span>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-xs text-muted-foreground">
                  {isVisible ? `¥${totalBudget.toLocaleString("ja-JP")}` : "¥***,***"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={percentageUsed} className="h-1.5 flex-1" />
              <Badge
                variant={percentageUsed > 100 ? "destructive" : "secondary"}
                className={`h-5 text-xs px-2 ${percentageUsed <= 100 && "bg-primary/10 text-primary hover:bg-primary/20"}`}
              >
                {percentageUsed.toFixed(0)}%
              </Badge>
            </div>
          </div>

          <div className="mb-4">
            <div
              className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl w-fit ${
                isIncrease ? "bg-orange-50 dark:bg-orange-950/20" : "bg-emerald-50 dark:bg-emerald-950/20"
              }`}
            >
              <TrendingUp className={`h-4 w-4 ${isIncrease ? "text-orange-600" : "text-emerald-600 rotate-180"}`} />
              <span className={`font-semibold ${isIncrease ? "text-orange-600" : "text-emerald-600"}`}>
                {isIncrease ? "+" : ""}
                {monthOverMonth.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">前月比</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-4 border border-primary/10 mb-4">
            <p className="text-xs text-muted-foreground mb-1">あと使える金額</p>
            <p className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {isVisible ? `¥${remaining.toLocaleString("ja-JP")}` : "¥***,***"}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground mb-3">カテゴリ別予算</p>
            {categories.map((category) => {
              const Icon = category.icon
              const percentage = (category.amount / category.budget) * 100
              const isOverBudget = percentage > 100

              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`${category.bgColor} ${category.color} p-1.5 rounded-lg`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{category.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {isVisible ? `¥${category.amount.toLocaleString("ja-JP")}` : "¥**,***"}
                      </span>
                      <span className="text-xs text-muted-foreground">/</span>
                      <span className="text-xs text-muted-foreground">
                        {isVisible ? `¥${category.budget.toLocaleString("ja-JP")}` : "¥**,***"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={Math.min(percentage, 100)} className="h-1.5 flex-1" />
                    <Badge
                      variant={isOverBudget ? "destructive" : "secondary"}
                      className={`h-5 text-xs px-2 ${!isOverBudget && "bg-primary/10 text-primary hover:bg-primary/20"}`}
                    >
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Large card - Total oshi spending */}
      <Card className="col-span-2 overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <Star className="h-4 w-4 text-white fill-white" />
              </div>
              <p className="text-lg font-bold text-foreground">これまでの推し活投資額</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="h-8 w-8 p-0 hover:bg-muted rounded-full"
            >
              {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
          <div className="space-y-2 mb-3">
            {oshiData.map((oshi) => (
              <div
                key={oshi.name}
                className="flex items-center justify-between bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl p-3 hover:from-muted/50 hover:to-muted/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${oshi.color}`} />
                  <span className="text-sm text-foreground font-medium">{oshi.name}</span>
                </div>
                <span className="text-base font-bold text-foreground">
                  {isVisible ? `¥${oshi.amount.toLocaleString("ja-JP")}` : "¥***,***"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-3.5 border border-primary/20">
            <span className="text-sm font-bold text-primary">合計投資額</span>
            <span className="text-xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {isVisible ? `¥${totalOshiSpending.toLocaleString("ja-JP")}` : "¥*,***,***"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
