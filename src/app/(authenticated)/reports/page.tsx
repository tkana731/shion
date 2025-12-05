"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@/lib/supabase/client'
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, Heart } from "lucide-react"

interface Transaction {
  id: string
  type: 'expense' | 'income'
  amount: number
  category: string
  date: string
  oshi?: {
    id: string
    name: string
    color: string | null
  } | null
}

interface CategoryTotal {
  category: string
  amount: number
}

interface OshiTotal {
  name: string
  amount: number
  color: string
}

interface MonthlyTotal {
  month: string
  expense: number
  income: number
}

const COLORS = ['#9333EA', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function ReportsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'month' | 'year'>('month')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
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

    if (error) {
      console.error('Error fetching transactions:', error)
      toast.error("データの読み込みに失敗しました")
    } else {
      setTransactions(data || [])
    }

    setLoading(false)
  }

  // 期間でフィルタリング
  const getFilteredTransactions = () => {
    const now = new Date()
    const startDate = new Date()

    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1)
    } else {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    return transactions.filter(t => new Date(t.date) >= startDate)
  }

  const filteredTransactions = getFilteredTransactions()

  // 総収入・総支出
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  // カテゴリ別集計
  const categoryTotals: CategoryTotal[] = Object.entries(
    filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)
  )
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  // 推し別集計
  const oshiTotals: OshiTotal[] = Object.entries(
    filteredTransactions
      .filter(t => t.type === 'expense' && t.oshi)
      .reduce((acc, t) => {
        if (t.oshi) {
          const key = t.oshi.id
          if (!acc[key]) {
            acc[key] = {
              name: t.oshi.name,
              amount: 0,
              color: t.oshi.color || '#9333EA'
            }
          }
          acc[key].amount += t.amount
        }
        return acc
      }, {} as Record<string, OshiTotal>)
  )
    .map(([_, data]) => data)
    .sort((a, b) => b.amount - a.amount)

  // 月別推移（直近6ヶ月）
  const monthlyData: MonthlyTotal[] = (() => {
    const data: Record<string, MonthlyTotal> = {}
    const now = new Date()

    // 直近6ヶ月を初期化
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`
      data[key] = { month: key, expense: 0, income: 0 }
    }

    // トランザクションを集計
    transactions.forEach(t => {
      const date = new Date(t.date)
      const key = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`
      if (data[key]) {
        if (t.type === 'expense') {
          data[key].expense += t.amount
        } else {
          data[key].income += t.amount
        }
      }
    })

    return Object.values(data)
  })()

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        読み込み中...
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <PageHeader title="分析レポート" description="収支の傾向を確認できます" />

      {/* 期間選択 */}
      <div className="flex justify-end">
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">直近1ヶ月</SelectItem>
            <SelectItem value="year">直近1年</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">収入</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">支出</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatAmount(totalExpense)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">収支</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              {formatAmount(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 月別推移 */}
      <Card>
        <CardHeader>
          <CardTitle>月別推移</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatAmount(value as number)} />
              <Legend />
              <Bar dataKey="income" name="収入" fill="#10B981" />
              <Bar dataKey="expense" name="支出" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* カテゴリ別支出 */}
      {categoryTotals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>カテゴリ別支出</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.category}: ${formatAmount(entry.amount)}`}
                >
                  {categoryTotals.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatAmount(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* 推し別支出 */}
      {oshiTotals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600 fill-pink-600" />
              推し別支出
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {oshiTotals.map((oshi, index) => {
                const percentage = (oshi.amount / totalExpense) * 100
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{oshi.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatAmount(oshi.amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: oshi.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
