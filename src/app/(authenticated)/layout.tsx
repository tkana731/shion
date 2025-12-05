"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from '@/lib/supabase/client'
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import { Toaster } from "sonner"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          console.error('Auth error:', error)
          router.push('/login')
          return
        }

        setLoading(false)
      } catch (error) {
        console.error('Failed to check auth:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        読み込み中...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />

      <main className="pb-20">
        {children}
      </main>

      <BottomNav />
      <Toaster />
    </div>
  )
}
