import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Trash2, ShoppingBag, UtensilsCrossed, CalendarDays, Wallet, Receipt } from "lucide-react"

const categoryIcons = {
  グッズ: ShoppingBag,
  食費: UtensilsCrossed,
  イベント: CalendarDays,
  収入: Wallet,
}

const transactions = [
  {
    id: 1,
    name: "缶バッジ セット",
    category: "グッズ",
    tags: ["限定", "誕生日"],
    amount: -3200,
    date: "2日前",
    fullDate: "2025/12/3(火)",
    oshi: true,
    oshiName: "さくら",
    oshiColor: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/30",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    isFuture: false,
  },
  {
    id: 2,
    name: "スーパーでお買い物",
    category: "食費",
    tags: ["日用品"],
    amount: -5800,
    date: "3日前",
    fullDate: "2025/12/2(月)",
    oshi: false,
    categoryColor: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    isFuture: false,
  },
  {
    id: 3,
    name: "ライブ チケット",
    category: "イベント",
    tags: ["ライブ", "最前列"],
    amount: -12000,
    date: "5日前",
    fullDate: "2025/11/30(土)",
    oshi: true,
    oshiName: "みお",
    oshiColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
    categoryColor: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    isFuture: false,
  },
  {
    id: 4,
    name: "給料",
    category: "収入",
    tags: ["給与"],
    amount: 280000,
    date: "1週間前",
    fullDate: "2025/11/28(木)",
    oshi: false,
    categoryColor: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    isFuture: false,
  },
  {
    id: 5,
    name: "アクリルスタンド",
    category: "グッズ",
    tags: ["アクスタ"],
    amount: -2500,
    date: "1週間前",
    fullDate: "2025/11/28(木)",
    oshi: true,
    oshiName: "さくら",
    oshiColor: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/30",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    isFuture: false,
  },
  {
    id: 6,
    name: "ライブチケット支払い予定",
    category: "イベント",
    tags: ["当選", "支払い待ち"],
    amount: -15000,
    date: "未確定",
    fullDate: "2025/12/15(日)",
    oshi: true,
    oshiName: "さくら",
    oshiColor: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/30",
    categoryColor: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    isFuture: true,
  },
  {
    id: 7,
    name: "予約商品の入金",
    category: "グッズ",
    tags: ["予約", "入金待ち"],
    amount: -8000,
    date: "未確定",
    fullDate: "2025/12/20(金)",
    oshi: true,
    oshiName: "みお",
    oshiColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    isFuture: true,
  },
]

interface RecentTransactionsProps {
  includeFutureExpenses: boolean
}

export function RecentTransactions({ includeFutureExpenses }: RecentTransactionsProps) {
  const displayedTransactions = includeFutureExpenses ? transactions : transactions.filter((t) => !t.isFuture)

  return (
    <Card className="border shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Receipt className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-foreground">最近の支出・収入</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
            すべて見る
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {displayedTransactions.map((transaction) => {
            const CategoryIcon = categoryIcons[transaction.category as keyof typeof categoryIcons] || ShoppingBag

            return (
              <div
                key={transaction.id}
                className={`flex items-center gap-3 rounded-xl p-3 hover:bg-muted/50 transition-all group ${
                  transaction.isFuture ? "opacity-60" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="font-semibold text-sm truncate">{transaction.name}</p>
                    {transaction.oshi && (
                      <Badge variant="outline" className={`text-xs ${transaction.oshiColor}`}>
                        {transaction.oshiName}
                      </Badge>
                    )}
                    {transaction.isFuture && (
                      <Badge variant="outline" className="text-xs border-dashed">
                        未確定
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium ${transaction.categoryColor} flex items-center gap-1`}
                    >
                      <CategoryIcon className="h-3 w-3" />
                      {transaction.category}
                    </Badge>
                    {transaction.tags.map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground/70 font-normal">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {transaction.date} • {transaction.fullDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${transaction.amount > 0 ? "text-green-600 dark:text-green-400" : "text-foreground"}`}
                    >
                      {transaction.amount > 0 ? "+" : ""}¥{Math.abs(transaction.amount).toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
