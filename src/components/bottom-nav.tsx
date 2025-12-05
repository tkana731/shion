"use client"

import { Home, BarChart3, PenLine, Receipt, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "ホーム", active: true },
  { icon: BarChart3, label: "レポート", active: false },
  { icon: PenLine, label: "追加", active: false, isMain: true },
  { icon: Receipt, label: "履歴", active: false },
  { icon: Settings, label: "設定", active: false },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border/50 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center justify-center gap-1 h-14 px-3 rounded-2xl",
                item.isMain
                  ? "bg-gradient-to-br from-primary via-secondary to-accent text-white hover:shadow-xl hover:shadow-primary/20 hover:scale-110 -mt-6 h-14 w-14 shadow-lg transition-all duration-200 group"
                  : item.active
                  ? "text-primary bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 cursor-default hover:bg-gradient-to-br hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10 hover:text-primary"
                  : "text-muted-foreground hover:bg-gradient-to-br hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10 transition-all duration-200 group"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  item.isMain && "h-6 w-6",
                  !item.active && !item.isMain && "transition-colors duration-200 group-hover:text-primary"
                )}
              />
              {!item.isMain && (
                <span className={cn(
                  "text-xs font-medium",
                  !item.active && "transition-colors duration-200 group-hover:text-secondary"
                )}>
                  {item.label}
                </span>
              )}
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
