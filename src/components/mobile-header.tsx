"use client"

import { Bell, Menu, Sparkles, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/auth/actions"

export function MobileHeader() {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 group transition-all duration-200 hover:bg-gradient-to-br hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10"
        >
          <Menu className="h-5 w-5 transition-colors duration-200 group-hover:text-primary" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Shion
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 group relative transition-all duration-200 hover:bg-gradient-to-br hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10"
          >
            <Bell className="h-5 w-5 transition-colors duration-200 group-hover:text-secondary" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full animate-pulse" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 group transition-all duration-200 hover:bg-gradient-to-br hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10"
              >
                <User className="h-5 w-5 transition-colors duration-200 group-hover:text-accent" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>アカウント</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
