"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/client'
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { Bell, Check, Calendar, TrendingUp, AlertCircle, Users, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"

interface Notification {
  id: string
  type: 'payment_reminder' | 'system' | 'achievement'
  title: string
  message: string
  read: boolean
  created_at: string
  is_global: boolean // 全体向けか個人向けか
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // 実際のデータベースから取得する場合
      // 個人向け通知
      // const { data: personalData } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .eq('is_global', false)
      //   .order('created_at', { ascending: false })

      // 全体向けお知らせ
      // const { data: globalData } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('is_global', true)
      //   .order('created_at', { ascending: false })

      // デモデータ
      const demoNotifications: Notification[] = [
        // 個人向け通知
        {
          id: '1',
          type: 'payment_reminder',
          title: '支払い期限が近づいています',
          message: 'サブスクリプションの支払い期限が3日後に迫っています。',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          is_global: false,
        },
        {
          id: '2',
          type: 'achievement',
          title: '目標達成おめでとうございます！',
          message: '今月の推し活予算を守ることができました。',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          is_global: false,
        },
        // 全体向けお知らせ
        {
          id: '3',
          type: 'system',
          title: '新機能が追加されました',
          message: 'カテゴリアイコンと詳細なレポート機能が利用可能になりました。',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          is_global: true,
        },
        {
          id: '4',
          type: 'system',
          title: 'メンテナンスのお知らせ',
          message: '2025年12月10日 2:00-4:00の間、システムメンテナンスを実施します。',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          is_global: true,
        },
      ]

      setNotifications(demoNotifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      toast.error("通知の取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // 実際の実装
      // const supabase = createClient()
      // await supabase
      //   .from('notifications')
      //   .update({ read: true })
      //   .eq('id', id)

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      )

      toast.success("既読にしました")
    } catch (error) {
      console.error('Failed to mark as read:', error)
      toast.error("既読にできませんでした")
    }
  }

  const markAllAsRead = async (isGlobal?: boolean) => {
    try {
      // 実際の実装
      // const supabase = createClient()
      // const { data: { user } } = await supabase.auth.getUser()
      // if (!user) return
      //
      // if (isGlobal !== undefined) {
      //   await supabase
      //     .from('notifications')
      //     .update({ read: true })
      //     .eq('is_global', isGlobal)
      //     .eq('read', false)
      // } else {
      //   await supabase
      //     .from('notifications')
      //     .update({ read: true })
      //     .eq('user_id', user.id)
      //     .eq('read', false)
      // }

      setNotifications(prev =>
        prev.map(notif =>
          isGlobal !== undefined
            ? notif.is_global === isGlobal ? { ...notif, read: true } : notif
            : { ...notif, read: true }
        )
      )

      toast.success("すべて既読にしました")
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error("既読にできませんでした")
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_reminder':
        return <Calendar className="h-5 w-5 text-primary" />
      case 'achievement':
        return <TrendingUp className="h-5 w-5 text-secondary" />
      case 'system':
        return <AlertCircle className="h-5 w-5 text-accent" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'payment_reminder':
        return '支払いリマインダー'
      case 'achievement':
        return '達成'
      case 'system':
        return 'システム'
      default:
        return '通知'
    }
  }

  // 個人向けと全体向けに分ける
  const personalNotifications = notifications.filter(n => !n.is_global)
  const globalNotifications = notifications.filter(n => n.is_global)

  const filteredPersonalNotifications = filter === 'unread'
    ? personalNotifications.filter(n => !n.read)
    : personalNotifications

  const filteredGlobalNotifications = filter === 'unread'
    ? globalNotifications.filter(n => !n.read)
    : globalNotifications

  const personalUnreadCount = personalNotifications.filter(n => !n.read).length
  const globalUnreadCount = globalNotifications.filter(n => !n.read).length
  const totalUnreadCount = personalUnreadCount + globalUnreadCount

  const renderNotification = (notification: Notification) => (
    <Card
      key={notification.id}
      className={`transition-all ${
        !notification.read
          ? 'border-primary/50 bg-primary/5'
          : 'hover:bg-accent/5'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getIcon(notification.type)}</div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-sm">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <Badge variant="default" className="text-xs">
                      未読
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="mt-1 text-xs">
                  {getTypeLabel(notification.type)}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>

            <div className="flex items-center justify-between gap-2 pt-2">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), {
                  addSuffix: true,
                  locale: ja,
                })}
              </span>

              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  既読
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        読み込み中...
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="お知らせ"
        description={`${totalUnreadCount}件の未読通知があります`}
      />

      {/* フィルター */}
      <div className="flex items-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          すべて
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          未読 ({totalUnreadCount})
        </Button>
      </div>

      {/* 個人向け通知 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              あなたへのお知らせ
              {personalUnreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {personalUnreadCount}
                </Badge>
              )}
            </CardTitle>
            {personalUnreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead(false)}
              >
                <Check className="h-4 w-4 mr-2" />
                すべて既読
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredPersonalNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>
                {filter === 'unread'
                  ? '未読の通知はありません'
                  : '個人向けの通知はありません'}
              </p>
            </div>
          ) : (
            filteredPersonalNotifications.map(renderNotification)
          )}
        </CardContent>
      </Card>

      {/* 全体向けお知らせ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-secondary" />
              全体のお知らせ
              {globalUnreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {globalUnreadCount}
                </Badge>
              )}
            </CardTitle>
            {globalUnreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead(true)}
              >
                <Check className="h-4 w-4 mr-2" />
                すべて既読
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredGlobalNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>
                {filter === 'unread'
                  ? '未読のお知らせはありません'
                  : '全体向けのお知らせはありません'}
              </p>
            </div>
          ) : (
            filteredGlobalNotifications.map(renderNotification)
          )}
        </CardContent>
      </Card>
    </div>
  )
}
