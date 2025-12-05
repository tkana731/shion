"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { toast } from "sonner"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "expense" | "income"
  transaction?: any // 編集時に使用
  onSuccess?: () => void
}

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

export function TransactionDialog({ open, onOpenChange, type, transaction, onSuccess }: TransactionDialogProps) {
  const [isOshiRelated, setIsOshiRelated] = useState(false)
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

      if (!user) return

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

    if (open) {
      fetchMasterData()
    }
  }, [open])

  // 編集時のデータロード
  useEffect(() => {
    if (transaction && open) {
      setIsOshiRelated(transaction.is_oshi_related || false)
      setSelectedOshi(transaction.oshi_id || "")
      setAmount(transaction.amount?.toString() || "")
      setCategory(transaction.category || "")
      setDate(transaction.date || new Date().toISOString().split('T')[0])
      setMemo(transaction.memo || "")
      // タグは別途取得が必要（リレーションテーブルから）
    } else if (open) {
      // 新規作成時はリセット
      resetForm()
    }
  }, [transaction, open])

  const resetForm = () => {
    setIsOshiRelated(false)
    setSelectedOshi("")
    setAmount("")
    setCategory("")
    setDate(new Date().toISOString().split('T')[0])
    setMemo("")
    setSelectedTags([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !category || !date) {
      toast.error("金額、カテゴリ、日付は必須です")
      return
    }

    if (isOshiRelated && !selectedOshi) {
      toast.error("推し活の場合は推しを選択してください")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("認証エラーが発生しました")
        return
      }

      const transactionData = {
        user_id: user.id,
        type,
        is_oshi_related: isOshiRelated,
        oshi_id: isOshiRelated ? selectedOshi : null,
        amount: parseInt(amount),
        category,
        date,
        memo: memo || null,
      }

      if (transaction) {
        // 更新
        const { error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transaction.id)

        if (error) throw error

        // タグの更新（既存を削除して新規追加）
        await supabase
          .from('transaction_tags')
          .delete()
          .eq('transaction_id', transaction.id)

        if (selectedTags.length > 0) {
          const tagData = selectedTags.map(tagId => ({
            transaction_id: transaction.id,
            tag_id: tagId,
          }))
          await supabase.from('transaction_tags').insert(tagData)
        }

        toast.success("取引を更新しました")
      } else {
        // 新規作成
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
      }

      onOpenChange(false)
      resetForm()
      if (onSuccess) onSuccess()
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

  const categories = type === "income" ? INCOME_CATEGORIES : (isOshiRelated ? EXPENSE_CATEGORIES : LIFE_CATEGORIES)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "取引を編集" : type === "expense" ? "支出を記録" : "収入を記録"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "expense" && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="is-oshi-related" className="text-sm font-medium">
                  推し活に関連する支出
                </Label>
                <Switch
                  id="is-oshi-related"
                  checked={isOshiRelated}
                  onCheckedChange={setIsOshiRelated}
                />
              </div>

              {isOshiRelated && (
                <div className="space-y-2">
                  <Label htmlFor="oshi">推し *</Label>
                  <Select value={selectedOshi} onValueChange={setSelectedOshi}>
                    <SelectTrigger>
                      <SelectValue placeholder="推しを選択" />
                    </SelectTrigger>
                    <SelectContent>
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
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">金額 *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">¥</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="0"
                required
              />
            </div>
          </div>

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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "処理中..." : transaction ? "更新" : "登録"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
