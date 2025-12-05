import {
  ShoppingBag,
  UtensilsCrossed,
  CalendarDays,
  Wallet,
  Home,
  Zap,
  Train,
  Smartphone,
  Sparkles,
  Package,
  Tv,
  Plane,
  Briefcase,
  type LucideIcon,
} from "lucide-react"

export interface CategoryConfig {
  name: string
  icon: LucideIcon
  color: string
  bgColor: string
  darkBgColor: string
}

// カテゴリグループの定義
export const EXPENSE_CATEGORIES = ["グッズ", "イベント", "配信", "遠征", "その他推し活"] as const
export const LIFE_CATEGORIES = ["食費", "家賃", "光熱費", "交通費", "通信費", "娯楽", "その他生活費"] as const
export const INCOME_CATEGORIES = ["給与", "副業", "その他収入"] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]
export type LifeCategory = typeof LIFE_CATEGORIES[number]
export type IncomeCategory = typeof INCOME_CATEGORIES[number]
export type CategoryName = ExpenseCategory | LifeCategory | IncomeCategory

// カテゴリアイコンと色のマッピング
export const categoryConfig: Record<CategoryName, CategoryConfig> = {
  // 推し活カテゴリ
  "グッズ": {
    name: "グッズ",
    icon: ShoppingBag,
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-100",
    darkBgColor: "dark:bg-amber-950",
  },
  "イベント": {
    name: "イベント",
    icon: CalendarDays,
    color: "text-violet-700 dark:text-violet-300",
    bgColor: "bg-violet-100",
    darkBgColor: "dark:bg-violet-950",
  },
  "配信": {
    name: "配信",
    icon: Tv,
    color: "text-pink-700 dark:text-pink-300",
    bgColor: "bg-pink-100",
    darkBgColor: "dark:bg-pink-950",
  },
  "遠征": {
    name: "遠征",
    icon: Plane,
    color: "text-sky-700 dark:text-sky-300",
    bgColor: "bg-sky-100",
    darkBgColor: "dark:bg-sky-950",
  },
  "その他推し活": {
    name: "その他推し活",
    icon: Sparkles,
    color: "text-fuchsia-700 dark:text-fuchsia-300",
    bgColor: "bg-fuchsia-100",
    darkBgColor: "dark:bg-fuchsia-950",
  },

  // 生活費カテゴリ
  "食費": {
    name: "食費",
    icon: UtensilsCrossed,
    color: "text-orange-700 dark:text-orange-300",
    bgColor: "bg-orange-100",
    darkBgColor: "dark:bg-orange-950",
  },
  "家賃": {
    name: "家賃",
    icon: Home,
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-100",
    darkBgColor: "dark:bg-blue-950",
  },
  "光熱費": {
    name: "光熱費",
    icon: Zap,
    color: "text-yellow-700 dark:text-yellow-300",
    bgColor: "bg-yellow-100",
    darkBgColor: "dark:bg-yellow-950",
  },
  "交通費": {
    name: "交通費",
    icon: Train,
    color: "text-green-700 dark:text-green-300",
    bgColor: "bg-green-100",
    darkBgColor: "dark:bg-green-950",
  },
  "通信費": {
    name: "通信費",
    icon: Smartphone,
    color: "text-indigo-700 dark:text-indigo-300",
    bgColor: "bg-indigo-100",
    darkBgColor: "dark:bg-indigo-950",
  },
  "娯楽": {
    name: "娯楽",
    icon: Sparkles,
    color: "text-purple-700 dark:text-purple-300",
    bgColor: "bg-purple-100",
    darkBgColor: "dark:bg-purple-950",
  },
  "その他生活費": {
    name: "その他生活費",
    icon: Package,
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100",
    darkBgColor: "dark:bg-slate-950",
  },

  // 収入カテゴリ
  "給与": {
    name: "給与",
    icon: Wallet,
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-100",
    darkBgColor: "dark:bg-emerald-950",
  },
  "副業": {
    name: "副業",
    icon: Briefcase,
    color: "text-teal-700 dark:text-teal-300",
    bgColor: "bg-teal-100",
    darkBgColor: "dark:bg-teal-950",
  },
  "その他収入": {
    name: "その他収入",
    icon: Wallet,
    color: "text-cyan-700 dark:text-cyan-300",
    bgColor: "bg-cyan-100",
    darkBgColor: "dark:bg-cyan-950",
  },
}

// ヘルパー関数：カテゴリアイコンを取得
export function getCategoryIcon(category: string): LucideIcon {
  return categoryConfig[category as CategoryName]?.icon || Package
}

// ヘルパー関数：カテゴリ色を取得
export function getCategoryColor(category: string): string {
  const config = categoryConfig[category as CategoryName]
  if (!config) {
    return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300"
  }
  return `${config.bgColor} ${config.color} ${config.darkBgColor}`
}

// ヘルパー関数：カテゴリ設定を取得
export function getCategoryConfig(category: string): CategoryConfig | null {
  return categoryConfig[category as CategoryName] || null
}
