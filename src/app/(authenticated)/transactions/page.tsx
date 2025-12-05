"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Filter } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Transaction {
  id: string
  type: 'expense' | 'income'
  amount: number
  category: string
  date: string
  memo: string | null
  is_oshi_related: boolean
  oshi?: {
    id: string
    name: string
    color: string | null
  } | null
}

interface Oshi {
  id: string
  name: string
  color: string | null
}

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [oshiList, setOshiList] = useState<Oshi[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // フィルター
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all')
  const [filterOshi, setFilterOshi] = useState<string>('all')

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

    // 取引データを取得
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
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
      toast.error("取引の読み込みに失敗しました")
    } else {
      setTransactions(transactionsData || [])
    }

    // 推しリストを取得
    const { data: oshiData } = await supabase
      .from('oshi')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (oshiData) setOshiList(oshiData)

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting transaction:', error)
      toast.error("削除に失敗しました")
    } else {
      toast.success("取引を削除しました")
      setDeletingId(null)
      fetchData()
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/transactions/${id}/edit`)
  }

  // フィルタリングされた取引
  const filteredTransactions = transactions.filter(transaction => {
    if (filterType !== 'all' && transaction.type !== filterType) return false
    if (filterOshi !== 'all' && transaction.oshi?.id !== filterOshi) return false
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
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
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <PageHeader title="取引履歴" description="過去の取引を確認・編集できます" />

      {/* フィルター */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            フィルター
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">種類</label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                  <SelectItem value="income">収入</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">推し</label>
              <Select value={filterOshi} onValueChange={setFilterOshi}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {oshiList.map(oshi => (
                    <SelectItem key={oshi.id} value={oshi.id}>
                      {oshi.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 取引リスト */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              取引がありません
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={transaction.type === 'expense' ? 'destructive' : 'default'}>
                        {transaction.type === 'expense' ? '支出' : '収入'}
                      </Badge>
                      {transaction.oshi && (
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: transaction.oshi.color || undefined,
                            color: transaction.oshi.color || undefined,
                          }}
                        >
                          {transaction.oshi.name}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${transaction.type === 'expense' ? 'text-destructive' : 'text-green-600'}`}>
                          {transaction.type === 'expense' ? '-' : '+'}
                          {formatAmount(transaction.amount)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.category} · {formatDate(transaction.date)}
                      </div>
                      {transaction.memo && (
                        <p className="text-sm text-muted-foreground">{transaction.memo}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(transaction.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingId(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>取引を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
