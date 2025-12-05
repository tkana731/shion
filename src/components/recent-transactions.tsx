"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Trash2, Receipt, Edit } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { toast } from "sonner"
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getCategoryIcon, getCategoryColor } from "@/lib/categories"

interface RecentTransactionsProps {
  includeFutureExpenses: boolean
  refreshTrigger?: number
}

export function RecentTransactions({ includeFutureExpenses, refreshTrigger }: RecentTransactionsProps) {
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      // 取引を取得（推し情報を含む）
      const { data: transactionsData, error } = await supabase
        .from('transactions')
        .select(`
          *,
          oshi:oshi_id (
            id,
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10)

      if (error) throw error

      // タグ情報を取得
      const transactionsWithTags = await Promise.all(
        (transactionsData || []).map(async (transaction) => {
          const { data: tagData } = await supabase
            .from('transaction_tags')
            .select(`
              tag:tag_id (
                id,
                name,
                color
              )
            `)
            .eq('transaction_id', transaction.id)

          return {
            ...transaction,
            tags: tagData?.map(t => t.tag) || []
          }
        })
      )

      setTransactions(transactionsWithTags)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      toast.error("取引の取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [refreshTrigger])

  const handleDelete = async (id: string) => {
    if (!confirm("この取引を削除してもよろしいですか？")) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success("取引を削除しました")
      fetchTransactions()
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      toast.error("削除に失敗しました")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const relativeTime = formatDistanceToNow(date, { addSuffix: true, locale: ja })
    const fullDate = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short'
    })
    return { relativeTime, fullDate }
  }

  if (loading) {
    return (
      <Card className="border shadow-md">
        <CardContent className="p-5">
          <div className="text-center py-8 text-muted-foreground">読み込み中...</div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="border shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Receipt className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-foreground">最近の支出・収入</h2>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            まだ取引が登録されていません
          </div>
        </CardContent>
      </Card>
    )
  }

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
          {transactions.map((transaction) => {
            const CategoryIcon = getCategoryIcon(transaction.category)
            const { relativeTime, fullDate } = formatDate(transaction.date)
            const categoryColor = getCategoryColor(transaction.category)
            const isIncome = transaction.type === 'income'
            const displayAmount = isIncome ? transaction.amount : -transaction.amount

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="font-semibold text-sm truncate">{transaction.memo || transaction.category}</p>
                    {transaction.is_oshi_related && transaction.oshi && (
                      <Badge variant="outline" className="text-xs bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/30">
                        {transaction.oshi.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium ${categoryColor} flex items-center gap-1`}
                    >
                      <CategoryIcon className="h-3 w-3" />
                      {transaction.category}
                    </Badge>
                    {transaction.tags && transaction.tags.map((tag: any) => (
                      <span key={tag.id} className="text-xs text-muted-foreground/70 font-normal">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {relativeTime} • {fullDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${isIncome ? "text-green-600 dark:text-green-400" : "text-foreground"}`}
                    >
                      {isIncome ? "+" : "-"}¥{Math.abs(displayAmount).toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500/10 hover:text-blue-600 mr-1"
                    onClick={() => router.push(`/transactions/${transaction.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(transaction.id)}
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
