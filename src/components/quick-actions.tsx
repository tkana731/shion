"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Minus, Plus, CalendarDays, Clock } from "lucide-react"

const actions = [
  {
    id: 1,
    label: "支出を記録",
    icon: Minus,
    variant: "default" as const,
    className: "bg-primary hover:bg-primary/90 text-primary-foreground",
    href: "/transactions/new?type=expense",
  },
  {
    id: 2,
    label: "収入を記録",
    icon: Plus,
    variant: "default" as const,
    className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
    href: "/transactions/new?type=income",
  },
  {
    id: 3,
    label: "未確定の支出・収入",
    icon: Clock,
    variant: "outline" as const,
    className: "border-accent/30 hover:bg-accent/10 hover:text-accent",
    href: "/scheduled",
  },
  {
    id: 4,
    label: "カレンダー",
    icon: CalendarDays,
    variant: "outline" as const,
    className: "",
    href: "/calendar",
  },
]

export function QuickActions() {
  const router = useRouter()

  const handleActionClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Button
            key={action.id}
            variant={action.variant}
            size="lg"
            className={`h-auto flex-col gap-2 py-4 ${action.className}`}
            onClick={() => handleActionClick(action.href)}
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
