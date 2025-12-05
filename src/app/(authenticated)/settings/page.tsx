"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit2, X, Check } from "lucide-react"
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

interface Oshi {
  id: string
  name: string
  color: string | null
}

const PRESET_COLORS = [
  "#FF69B4", // ピンク
  "#9333EA", // 紫
  "#3B82F6", // 青
  "#10B981", // 緑
  "#F59E0B", // オレンジ
  "#EF4444", // 赤
  "#8B5CF6", // バイオレット
  "#EC4899", // ローズ
]

export default function SettingsPage() {
  const router = useRouter()
  const [oshiList, setOshiList] = useState<Oshi[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // 新規追加用
  const [newOshiName, setNewOshiName] = useState("")
  const [newOshiColor, setNewOshiColor] = useState(PRESET_COLORS[0])
  const [isAdding, setIsAdding] = useState(false)

  // 編集用
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("")

  useEffect(() => {
    fetchOshi()
  }, [])

  const fetchOshi = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('oshi')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching oshi:', error)
      toast.error("推しの読み込みに失敗しました")
      return
    }

    setOshiList(data || [])
  }

  const handleAddOshi = async () => {
    if (!newOshiName.trim()) {
      toast.error("推しの名前を入力してください")
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

      const { error } = await supabase
        .from('oshi')
        .insert({
          user_id: user.id,
          name: newOshiName,
          color: newOshiColor,
        })

      if (error) throw error

      toast.success("推しを追加しました")
      setNewOshiName("")
      setNewOshiColor(PRESET_COLORS[0])
      setIsAdding(false)
      fetchOshi()
    } catch (error) {
      console.error('Error adding oshi:', error)
      toast.error("推しの追加に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleStartEdit = (oshi: Oshi) => {
    setEditingId(oshi.id)
    setEditName(oshi.name)
    setEditColor(oshi.color || PRESET_COLORS[0])
  }

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      toast.error("推しの名前を入力してください")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('oshi')
        .update({
          name: editName,
          color: editColor,
        })
        .eq('id', id)

      if (error) throw error

      toast.success("推しを更新しました")
      setEditingId(null)
      fetchOshi()
    } catch (error) {
      console.error('Error updating oshi:', error)
      toast.error("推しの更新に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('oshi')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success("推しを削除しました")
      setDeletingId(null)
      fetchOshi()
    } catch (error) {
      console.error('Error deleting oshi:', error)
      toast.error("推しの削除に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <PageHeader title="設定" description="推しを管理できます" />

      <Card>
        <CardHeader>
          <CardTitle>推し管理</CardTitle>
          <CardDescription>
            推しを追加・編集・削除できます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 推しリスト */}
          {oshiList.length === 0 && !isAdding && (
            <div className="text-center py-8 text-muted-foreground">
              推しが登録されていません
            </div>
          )}

          {oshiList.map((oshi) => (
            <div key={oshi.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              {editingId === oshi.id ? (
                <>
                  <div className="flex-1 space-y-3">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="推しの名前"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setEditColor(color)}
                          className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                          style={{
                            backgroundColor: color,
                            borderColor: editColor === color ? '#000' : 'transparent'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveEdit(oshi.id)}
                      disabled={loading}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: oshi.color || '#9333EA' }}
                  />
                  <span className="flex-1 font-medium">{oshi.name}</span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleStartEdit(oshi)}
                      disabled={loading}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingId(oshi.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* 新規追加フォーム */}
          {isAdding ? (
            <div className="p-3 rounded-lg border bg-card space-y-3">
              <div className="space-y-2">
                <Label htmlFor="new-oshi-name">推しの名前</Label>
                <Input
                  id="new-oshi-name"
                  value={newOshiName}
                  onChange={(e) => setNewOshiName(e.target.value)}
                  placeholder="例: 推しの名前"
                />
              </div>

              <div className="space-y-2">
                <Label>カラー</Label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewOshiColor(color)}
                      className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: newOshiColor === color ? '#000' : 'transparent'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddOshi}
                  disabled={loading}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  追加
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setNewOshiName("")
                    setNewOshiColor(PRESET_COLORS[0])
                  }}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full transition-all duration-200 hover:bg-gradient-to-br hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10 hover:text-primary hover:border-primary/20 group"
              onClick={() => setIsAdding(true)}
              disabled={editingId !== null}
            >
              <Plus className="h-4 w-4 mr-2 transition-colors duration-200" />
              <span className="transition-colors duration-200">推しを追加</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>推しを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。この推しに紐づいた取引データも影響を受ける可能性があります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              disabled={loading}
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
