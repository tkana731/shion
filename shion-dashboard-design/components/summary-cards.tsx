import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingBag, TrendingDown, TrendingUp, Wallet } from "lucide-react"

const summaryData = [
  {
    id: 1,
    label: "今月の支出",
    amount: 125000,
    change: 12.5,
    isPositive: false,
    icon: Wallet,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    label: "推し活費用",
    amount: 78000,
    change: 8.3,
    isPositive: false,
    icon: Heart,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    id: 3,
    label: "生活費",
    amount: 47000,
    change: 5.2,
    isPositive: true,
    icon: ShoppingBag,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
  },
]

export function SummaryCards() {
  return (
    <div className="grid gap-3">
      {summaryData.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.id} className="overflow-hidden border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground mb-1">¥{item.amount.toLocaleString("ja-JP")}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {item.isPositive ? (
                      <>
                        <TrendingDown className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-green-600 font-medium">{item.change}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-3.5 w-3.5 text-red-600" />
                        <span className="text-red-600 font-medium">{item.change}%</span>
                      </>
                    )}
                    <span className="text-muted-foreground">先月比</span>
                  </div>
                </div>
                <div className={`${item.bgColor} ${item.color} p-3 rounded-xl`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
