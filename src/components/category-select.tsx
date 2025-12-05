"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getCategoryIcon,
  getCategoryConfig,
} from "@/lib/categories"

interface CategorySelectProps {
  value: string
  onValueChange: (value: string) => void
  categories: readonly string[]
  label?: string
  placeholder?: string
  required?: boolean
  id?: string
}

export function CategorySelect({
  value,
  onValueChange,
  categories,
  label = "カテゴリ",
  placeholder = "カテゴリを選択",
  required = true,
  id = "category",
}: CategorySelectProps) {
  const selectedConfig = getCategoryConfig(value)
  const SelectedIcon = selectedConfig?.icon

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && "*"}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder}>
            {value && (
              <div className="flex items-center gap-2">
                {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
                <span>{value}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => {
            const config = getCategoryConfig(cat)
            const Icon = config?.icon || getCategoryIcon(cat)

            return (
              <SelectItem key={cat} value={cat}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{cat}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
