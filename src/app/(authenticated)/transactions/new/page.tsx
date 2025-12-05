"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Minus, Plus } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"

// カテゴリの定義
const EXPENSE_CATEGORIES = ["グッズ", "イベント", "配信", "遠征", "その他推し活"]
const LIFE_CATEGORIES = ["食費", "家賃", "光熱費", "交通費", "通信費", "娯楽", "その他生活費"]
const INCOME_CATEGORIES = ["給与", "副業", "その他収入"]

interface Oshi {
  id: string
  name: string
  color: string | null
}

interface Tag {
  id: string
  name: string
  color: string | null
}

function TransactionFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type') as 'expense' | 'income' | null
  const [type, setType] = useState<'expense' | 'income'>(typeParam || 'expense')

  const [selectedOshi, setSelectedOshi] = useState<string>("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [memo, setMemo] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // マスターデータ
  const [oshiList, setOshiList] = useState<Oshi[]>([])
  const [tagList, setTagList] = useState<Tag[]>([])

  // マスターデータの取得
  useEffect(() => {
    const fetchMasterData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // 推しを取得
      const { data: oshiData } = await supabase
        .from('oshi')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (oshiData) setOshiList(oshiData)

      // タグを取得
      const { data: tagData } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (tagData) setTagList(tagData)
    }

    fetchMasterData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !category || !date) {
      toast.error("金額、カテゴリ、日付は必須です")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("認証エラーが発生しました")
        router.push('/login')
        return
      }

      const transactionData = {
        user_id: user.id,
        type,
        is_oshi_related: selectedOshi ? true : false,
        oshi_id: selectedOshi || null,
        amount: parseInt(amount),
        category,
        date,
        memo: memo || null,
      }

      const { data: newTransaction, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single()

      if (error) throw error

      // タグの追加
      if (selectedTags.length > 0 && newTransaction) {
        const tagData = selectedTags.map(tagId => ({
          transaction_id: newTransaction.id,
          tag_id: tagId,
        }))
        await supabase.from('transaction_tags').insert(tagData)
      }

      toast.success("取引を登録しました")
      router.push('/dashboard')
    } catch (error) {
      console.error('Transaction error:', error)
      toast.error("エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const categories = type === "income" ? INCOME_CATEGORIES : (selectedOshi ? EXPENSE_CATEGORIES : LIFE_CATEGORIES)

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* Page Title */}
      <PageHeader
        title={type === 'expense' ? '支出を記録' : '収入を記録'}
        description="新しい取引を追加します"
      />

      {/* Type Toggle */}
      <div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === 'expense' ? 'default' : 'outline'}
            className={`flex-1 ${type === 'expense' ? 'bg-primary' : ''}`}
            onClick={() => setType('expense')}
          >
            <Minus className="h-4 w-4 mr-2" />
            支出
          </Button>
          <Button
            type="button"
            variant={type === 'income' ? 'default' : 'outline'}
            className={`flex-1 ${type === 'income' ? 'bg-secondary' : ''}`}
            onClick={() => setType('income')}
          >
            <Plus className="h-4 w-4 mr-2" />
            収入
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">金額 *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">¥</span>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8 text-2xl h-14"
              placeholder="0"
              required
            />
          </div>
        </div>

        {type === "expense" && (
          <div className="space-y-2">
            <Label htmlFor="oshi">推し</Label>
            <Select
              value={selectedOshi || "none"}
              onValueChange={(value) => setSelectedOshi(value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="推しを選択（任意）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">選択しない</SelectItem>
                {oshiList.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    推しが登録されていません
                  </div>
                ) : (
                  oshiList.map(oshi => (
                    <SelectItem key={oshi.id} value={oshi.id}>
                      {oshi.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="category">カテゴリ *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">日付 *</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {tagList.length > 0 && (
          <div className="space-y-2">
            <Label>タグ</Label>
            <div className="flex flex-wrap gap-2">
              {tagList.map(tag => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                  {selectedTags.includes(tag.id) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="memo">メモ</Label>
          <Textarea
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモを入力（任意）"
            rows={3}
          />
        </div>

        <div className="fixed bottom-20 left-0 right-0 p-4 bg-card/80 backdrop-blur-xl border-t border-border/50 z-40">
          <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
            {loading ? "処理中..." : "登録"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function NewTransactionPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">読み込み中...</div>}>
      <TransactionFormContent />
    </Suspense>
  )
}
