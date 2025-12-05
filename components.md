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

## 今後の拡張

新しい共通コンポーネントを追加する際は、このドキュメントを更新してください。

### 追加を検討すべきコンポーネント

- `EmptyState`: データがない時の表示
- `LoadingSpinner`: ローディング状態の表示
- `ErrorMessage`: エラーメッセージの表示
- `ConfirmDialog`: 確認ダイアログ（削除確認など）
