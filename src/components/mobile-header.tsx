"use client"

import { Bell, Menu, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Shion
          </h1>
        </div>

        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full animate-pulse" />
        </Button>
      </div>
    </header>
  )
}
