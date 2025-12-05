# コンポーネントガイド

このドキュメントでは、プロジェクトで使用する共通コンポーネントの使い方を説明します。

## PageHeader

ページのタイトルと説明を表示する統一された見出しコンポーネントです。

### パス
```
src/components/page-header.tsx
```

### プロパティ

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `title` | `string` | ✅ | ページのタイトル |
| `description` | `string` | ❌ | ページの説明文（オプション） |

### 基本的な使い方

```tsx
import { PageHeader } from "@/components/page-header"

export default function MyPage() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="ページタイトル"
        description="ページの説明文"
      />

      {/* ページコンテンツ */}
    </div>
  )
}
```

### 説明文なしの場合

```tsx
<PageHeader title="シンプルなタイトル" />
```

### 動的なタイトル

```tsx
const [type, setType] = useState<'expense' | 'income'>('expense')

<PageHeader
  title={type === 'expense' ? '支出を記録' : '収入を記録'}
  description="新しい取引を追加します"
/>
```

## ページレイアウトのベストプラクティス

新しいページを作成する際は、以下の構造を推奨します：

### 基本構造

```tsx
export default function NewPage() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* ページヘッダー */}
      <PageHeader
        title="ページタイトル"
        description="説明文"
      />

      {/* メインコンテンツ */}
      <Card>
        <CardHeader>
          <CardTitle>セクションタイトル</CardTitle>
        </CardHeader>
        <CardContent>
          {/* コンテンツ */}
        </CardContent>
      </Card>
    </div>
  )
}
```

### クラス名の説明

- `p-4`: 全体のパディング（16px）
- `space-y-6`: 子要素間の縦方向のスペース（24px）
- `max-w-2xl`: 最大幅（672px）
- `mx-auto`: 水平方向の中央揃え

### 注意事項

- ✅ フッターナビゲーションがあるため、戻るボタンは不要
- ✅ ページタイトルは常に左寄せ
- ✅ 統一されたレイアウトを使用
- ❌ 独自のヘッダースタイルを作成しない

## ボタンのホバースタイル

フッターメニューと統一されたホバースタイルを使用する場合：

```tsx
<Button
  variant="outline"
  className="w-full transition-all duration-200 hover:bg-gradient-to-br hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10 hover:text-primary hover:border-primary/20 group"
>
  <Plus className="h-4 w-4 mr-2 transition-colors duration-200" />
  <span className="transition-colors duration-200">ボタンテキスト</span>
</Button>
```

### ホバースタイルの説明

- `transition-all duration-200`: スムーズなアニメーション（200ms）
- `hover:bg-gradient-to-br`: グラデーション背景
- `hover:from-primary/10 hover:via-secondary/10 hover:to-accent/10`: プライマリー、セカンダリー、アクセントカラーのグラデーション（透明度10%）
- `hover:text-primary`: ホバー時にテキストがプライマリーカラーに
- `hover:border-primary/20`: ボーダーもプライマリーカラーに（透明度20%）
- `group`: グループホバー効果を有効化

## 実装例

### 設定ページ

```tsx
// src/app/(authenticated)/settings/page.tsx
import { PageHeader } from "@/components/page-header"

export default function SettingsPage() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <PageHeader title="設定" description="推しを管理できます" />

      <Card>
        {/* コンテンツ */}
      </Card>
    </div>
  )
}
```

### 取引追加ページ

```tsx
// src/app/(authenticated)/transactions/new/page.tsx
import { PageHeader } from "@/components/page-header"

export default function NewTransactionPage() {
  const [type, setType] = useState<'expense' | 'income'>('expense')

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title={type === 'expense' ? '支出を記録' : '収入を記録'}
        description="新しい取引を追加します"
      />

      {/* フォーム */}
    </div>
  )
}
```

### 取引編集ページ

```tsx
// src/app/(authenticated)/transactions/[id]/edit/page.tsx
import { PageHeader } from "@/components/page-header"

export default function EditTransactionPage() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="取引を編集"
        description="既存の取引を更新します"
      />

      {/* フォーム */}
    </div>
  )
}
```

## CategorySelect

カテゴリを選択するためのアイコン付きセレクトコンポーネントです。

### パス
```
src/components/category-select.tsx
```

### プロパティ

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| `value` | `string` | ✅ | - | 現在選択されているカテゴリ |
| `onValueChange` | `(value: string) => void` | ✅ | - | カテゴリ変更時のコールバック |
| `categories` | `readonly string[]` | ✅ | - | 選択可能なカテゴリの配列 |
| `label` | `string` | ❌ | `"カテゴリ"` | ラベルテキスト |
| `placeholder` | `string` | ❌ | `"カテゴリを選択"` | プレースホルダー |
| `required` | `boolean` | ❌ | `true` | 必須フィールドかどうか |
| `id` | `string` | ❌ | `"category"` | input要素のID |

### 基本的な使い方

```tsx
import { CategorySelect } from "@/components/category-select"
import { EXPENSE_CATEGORIES, LIFE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories"

export default function TransactionForm() {
  const [category, setCategory] = useState("")
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [selectedOshi, setSelectedOshi] = useState("")

  // カテゴリリストを動的に決定
  const categories = type === "income"
    ? INCOME_CATEGORIES
    : (selectedOshi ? EXPENSE_CATEGORIES : LIFE_CATEGORIES)

  return (
    <form>
      <CategorySelect
        value={category}
        onValueChange={setCategory}
        categories={categories}
      />
    </form>
  )
}
```

### カスタムラベルとプレースホルダー

```tsx
<CategorySelect
  value={category}
  onValueChange={setCategory}
  categories={EXPENSE_CATEGORIES}
  label="支出カテゴリ"
  placeholder="カテゴリを選んでください"
  required={false}
/>
```

### 機能

- カテゴリアイコンの自動表示
- 選択時のアイコンプレビュー
- ダークモード対応
- アクセシビリティサポート

## カテゴリユーティリティ

カテゴリの定義とアイコン・色の管理を一元化したユーティリティライブラリです。

### パス
```
src/lib/categories.ts
```

### カテゴリ定義

```tsx
import {
  EXPENSE_CATEGORIES,  // 推し活カテゴリ
  LIFE_CATEGORIES,     // 生活費カテゴリ
  INCOME_CATEGORIES    // 収入カテゴリ
} from "@/lib/categories"

// カテゴリリスト
EXPENSE_CATEGORIES // ["グッズ", "イベント", "配信", "遠征", "その他推し活"]
LIFE_CATEGORIES    // ["食費", "家賃", "光熱費", "交通費", "通信費", "娯楽", "その他生活費"]
INCOME_CATEGORIES  // ["給与", "副業", "その他収入"]
```

### ヘルパー関数

#### getCategoryIcon

カテゴリに対応するLucideアイコンコンポーネントを取得します。

```tsx
import { getCategoryIcon } from "@/lib/categories"

const CategoryIcon = getCategoryIcon("グッズ")  // ShoppingBag アイコン
const Icon = getCategoryIcon("食費")           // UtensilsCrossed アイコン

// 使用例
<CategoryIcon className="h-4 w-4" />
```

#### getCategoryColor

カテゴリに対応する色クラス（背景色とテキスト色）を取得します。

```tsx
import { getCategoryColor } from "@/lib/categories"

const colorClass = getCategoryColor("グッズ")
// "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"

// 使用例
<Badge className={`${colorClass} flex items-center gap-1`}>
  <CategoryIcon className="h-3 w-3" />
  グッズ
</Badge>
```

#### getCategoryConfig

カテゴリの完全な設定オブジェクトを取得します。

```tsx
import { getCategoryConfig } from "@/lib/categories"

const config = getCategoryConfig("イベント")
// {
//   name: "イベント",
//   icon: CalendarDays,
//   color: "text-violet-700 dark:text-violet-300",
//   bgColor: "bg-violet-100",
//   darkBgColor: "dark:bg-violet-950"
// }

// 使用例
const config = getCategoryConfig(category)
const CategoryIcon = config?.icon

<div className={`p-2 ${config?.bgColor} ${config?.darkBgColor}`}>
  <CategoryIcon className={`h-4 w-4 ${config?.color}`} />
  <span>{category}</span>
</div>
```

### 実装例

#### トランザクション一覧

```tsx
import { getCategoryIcon, getCategoryColor } from "@/lib/categories"

function TransactionList({ transactions }) {
  return (
    <div className="space-y-2">
      {transactions.map(transaction => {
        const CategoryIcon = getCategoryIcon(transaction.category)
        const categoryColor = getCategoryColor(transaction.category)

        return (
          <div key={transaction.id}>
            <Badge className={categoryColor}>
              <CategoryIcon className="h-3 w-3 mr-1" />
              {transaction.category}
            </Badge>
          </div>
        )
      })}
    </div>
  )
}
```

#### レポート画面

```tsx
import { getCategoryIcon, getCategoryConfig } from "@/lib/categories"

function CategoryReport({ categoryTotals }) {
  return (
    <div className="space-y-4">
      {categoryTotals.map(cat => {
        const CategoryIcon = getCategoryIcon(cat.category)
        const config = getCategoryConfig(cat.category)

        return (
          <div key={cat.category} className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${config?.bgColor} ${config?.darkBgColor}`}>
              <CategoryIcon className={`h-4 w-4 ${config?.color}`} />
            </div>
            <span>{cat.category}</span>
            <span>{formatAmount(cat.amount)}</span>
          </div>
        )
      })}
    </div>
  )
}
```

### カテゴリアイコン一覧

| カテゴリ | アイコン | 色 |
|---------|---------|-----|
| グッズ | ShoppingBag | amber（黄褐色） |
| イベント | CalendarDays | violet（紫） |
| 配信 | Tv | pink（ピンク） |
| 遠征 | Plane | sky（空色） |
| その他推し活 | Sparkles | fuchsia（紫紅色） |
| 食費 | UtensilsCrossed | orange（オレンジ） |
| 家賃 | Home | blue（青） |
| 光熱費 | Zap | yellow（黄） |
| 交通費 | Train | green（緑） |
| 通信費 | Smartphone | indigo（藍色） |
| 娯楽 | Sparkles | purple（紫） |
| その他生活費 | Package | slate（灰色） |
| 給与 | Wallet | emerald（エメラルド） |
| 副業 | Briefcase | teal（青緑） |
| その他収入 | Wallet | cyan（シアン） |

## 今後の拡張

新しい共通コンポーネントを追加する際は、このドキュメントを更新してください。

### 追加を検討すべきコンポーネント

- `EmptyState`: データがない時の表示
- `LoadingSpinner`: ローディング状態の表示
- `ErrorMessage`: エラーメッセージの表示
- `ConfirmDialog`: 確認ダイアログ（削除確認など）
