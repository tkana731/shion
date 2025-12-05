"use client"

import { AlertCircle, Calendar, Circle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function PaymentReminders() {
  const [paidReminders, setPaidReminders] = useState<number[]>([])

  const upcomingPayments = [
    {
      id: 1,
      title: "ライブチケット 支払い期限",
      amount: 15000,
      deadline: "2025/12/10(水)",
      daysLeft: 5,
      category: "イベント",
      oshiName: "さくら",
      oshiColor: "bg-pink-500",
    },
    {
      id: 2,
      title: "予約グッズ 入金期限",
      amount: 8500,
      deadline: "2025/12/15(月)",
      daysLeft: 10,
      category: "グッズ",
      oshiName: "みお",
      oshiColor: "bg-purple-500",
    },
    {
      id: 3,
      title: "クレジットカード 支払日",
      amount: 45000,
      deadline: "2025/12/25(木)",
      daysLeft: 20,
      category: "その他",
      oshiName: null,
      oshiColor: null,
    },
  ]

  const activePayments = upcomingPayments.filter((p) => !paidReminders.includes(p.id))

  const handleMarkAsPaid = (id: number) => {
    setPaidReminders([...paidReminders, id])
  }

  if (activePayments.length === 0) {
    return null
  }

  return (
    <Card className="border shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-foreground">支払い予定のリマインド</h2>
        </div>
        <div className="grid gap-2">
          {activePayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center gap-3 rounded-xl p-3 bg-card hover:bg-muted/50 transition-colors duration-200 border border-border/50"
            >
              <button
                onClick={() => handleMarkAsPaid(payment.id)}
                className="shrink-0 h-6 w-6 rounded-full border-2 border-muted-foreground/40 hover:border-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center group"
                aria-label="支払済にする"
              >
                <Circle className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </button>

              <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground truncate">{payment.title}</p>
                    {payment.oshiName && (
                      <div className="flex items-center gap-1 shrink-0">
                        <div className={`h-2 w-2 rounded-full ${payment.oshiColor}`} />
                        <span className="text-xs font-medium text-muted-foreground">{payment.oshiName}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{payment.deadline}</span>
                    <Badge
                      variant="secondary"
                      className={`h-4 text-[10px] font-semibold px-1.5 ${payment.daysLeft <= 7 ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"}`}
                    >
                      あと{payment.daysLeft}日
                    </Badge>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-foreground">¥{payment.amount.toLocaleString("ja-JP")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
