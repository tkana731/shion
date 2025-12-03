# オタク向け家計簿アプリ - 要件定義書

## サービス名

**Shion（シオン / 紫苑）**

- **由来**：「oshi」の文字を並び替えた造語 + 紫苑（花の名前）
- **花言葉**：「あなたを忘れない」「遠くにある人を想う」「追憶」
- **意味**：推しへの想いを記録する家計簿
- **ドメイン**：myshion.app
- **キャッチコピー**：「推しへの想いを、記録に残そう」

## プロジェクト概要

### 目標
- 1年以内に月40万円の収益を目指す
- 個人開発者として自立するための第一弾プロダクト
- MacBook Airでの開発、PWAとしてリリース

### コンセプト
推し活と日常生活の支出を一元管理できる、オタク向け家計簿アプリ。
「推しにいくら使ったか」を可視化しつつ、一般的な家計管理も行える。

### ターゲットユーザー
- アニメ・漫画・アイドル・声優などのオタク層
- 推し活に熱心で、計画的に支出を管理したい人
- 20〜30代の社会人・学生

## 最大の差別化ポイント

### Phase 1の差別化
1. **推し別の支出管理**
   - どの推しにいくら使ったか一目で分かる
   - 推し活費用と生活費を明確に分離
   - 推しごとの色分けで視覚的に管理

2. **定期支出の自動化**
   - 毎月の固定費を自動的に表示に反映
   - ユーザー操作なしで家賃やサブスクを管理

3. **柔軟なタグ機能**
   - 支出に複数タグを付与して多角的に分析
   - カテゴリとは別の軸で集計可能

### Phase 1.5以降の差別化（最重要）
4. **未来の支払い予定管理**
   - チケット申込中（当選未定）の支出を管理
   - 予約済み・支払い待ちの状態管理
   - 今月の確定支出 + 未来の予定支出を可視化
   - **これが他の家計簿アプリにない最大の強み**

---

## Phase 1: MVP機能（開発期間3週間）

### 1. 基本的な支出・収入記録

#### 支出・収入の属性
- タイプ（支出 or 収入）
- 推し活 or 生活費（Boolean）
- 推し（推し活の場合のみ紐付け）
- 金額
- カテゴリ
  - 推し活：グッズ、イベント、配信、遠征、その他
  - 生活費：食費、家賃、光熱費、交通費、通信費、娯楽、その他
- タグ（複数付与可能）
- 日付
- メモ（任意）

#### CRUD操作
- 作成、編集、削除
- 一覧表示（月別、カテゴリ別、推し別でフィルタ）

### 2. 推し管理

- 推しの登録・編集・削除
- 推しごとに色を設定（グラフ表示用）
- 無料版：2人まで
- プレミアム版：無制限

### 3. タグ機能

- タグの作成・編集・削除
- 支出に複数タグを付与
- タグ別の集計
- 無料版：3個まで
- プレミアム版：無制限

### 4. 定期支出・収入（動的生成方式）

#### 設定項目
- 金額
- 頻度（毎月 or 毎年）
- 実行日（月の何日、または年の何月何日）
- 開始日
- 終了日（任意、NULLなら無期限）
- カテゴリ、推し、タグ

#### 動作仕様
- 定期設定だけをDBに保存
- 支出一覧を表示する際に、該当月の定期支出を動的に生成して表示
- 特定の月だけ金額を変更したい場合は、実レコードを作成して上書き
- 無料版：5件まで
- プレミアム版：無制限

### 5. 集計とレポート

#### 集計機能
- 推し別集計（今月/全期間）
- カテゴリ別集計
- タグ別集計
- 推し活費用 vs 生活費の比率
- 月別推移グラフ

#### 月次レポート
- 当月の総支出・総収入
- 推し別ランキング
- 前月との比較
- プレミアム版：レポートを画像でダウンロード

#### 無料版の制限
- 直近1年のデータのみ閲覧可能
- 基本的な集計のみ

#### プレミアム版の機能
- 全期間のデータ閲覧
- 詳細な分析グラフ
- タグ別の詳細集計

### 6. 認証

- メール/パスワードでのサインアップ・ログイン
- Googleアカウントでのログイン（Supabase Auth）

### 7. 課金

#### 料金プラン
- **無料版（0円）**
  - 直近1年のデータ閲覧
  - 推しは2人まで
  - タグは3個まで
  - 定期支出・収入は5件まで
  - 基本的な集計のみ

- **プレミアム版（月額280円）**
  - 全期間のデータ閲覧
  - 推し・タグ・定期支出すべて無制限
  - 詳細な分析グラフ
  - 月次レポートのダウンロード（画像）
  - （Phase 1.5で追加）未来の支払い予定機能

#### 決済
- Stripe連携
- サブスクリプション管理
- 手数料：3.6%（App Store/Google Playの30%と比較して圧倒的に有利）

---

## Phase 1.5: 差別化機能（リリース後2〜3週間）

### 未来の支払い予定管理

#### ステータス管理
- **予定**：チケット申込中、当選未定
- **確定**：当選済み、支払い待ち
- **完了**：支払い済み、実績として記録
- **キャンセル**：落選、予定変更

#### データ項目
- ステータス
- 予定日 or 支払期限
- 予定金額
- 実際の金額（完了時）
- その他は通常の支出と同じ属性

#### 表示機能
- カレンダービューで未来の予定を可視化
- 今月の確定支出 + 未来の予定支出を合算表示
- 「今月チケット当たったらいくらになるか」が分かる

---

## Phase 2以降（3〜6ヶ月後）

### プレミアムプラス（月額480円）の追加

#### 追加機能
- ソーシャル機能（推しが同じ人同士での支出比較）
- 支出ランキング（自分が上位何%か）
- より高度な分析・予測機能
- 季節イベントアラート（誕生日、記念日、定期イベント）
- 予算設定機能

### その他の検討事項
- サブスク専用の管理画面
- AI による支出傾向の分析
- 遠征機能との統合（Phase 1で考えていた旅程表機能）

---

## 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Recharts**（グラフ表示）

### バックエンド / データベース
- **Supabase**
  - PostgreSQL
  - Auth（メール/パスワード、Google OAuth）
  - Realtime（オプション）
  - 無料枠：月50,000リクエスト

### 決済
- **Stripe**
  - サブスクリプション管理
  - 手数料：3.6%

### ホスティング
- **Vercel**
  - Next.jsとの完璧な統合
  - 自動デプロイ
  - 無料枠で開始可能

### PWA化
- **next-pwa**
  - ホーム画面追加
  - オフライン対応
  - プッシュ通知（定期支出のリマインダー）

### 初期費用
- ドメイン：年間1,500円程度（.comや.app）
- その他：無料枠内で運用可能
- **合計：ほぼ0円でスタート可能**

---

## データベース設計

### テーブル一覧

#### oshi（推し）
```sql
CREATE TABLE oshi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);
```

#### tags（タグ）
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);
```

#### transactions（支出・収入の実レコード）
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL, -- 'expense' or 'income'
  is_oshi_related BOOLEAN DEFAULT false, -- 推し活 or 生活費
  oshi_id UUID REFERENCES oshi,
  amount INTEGER NOT NULL, -- 円単位で保存
  category TEXT NOT NULL,
  memo TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  -- 定期設定を上書きした実レコードの場合、元の定期設定IDを保持
  recurring_override_id UUID REFERENCES recurring_transactions
);
```

#### transaction_tags（支出・収入とタグの関連）
```sql
CREATE TABLE transaction_tags (
  transaction_id UUID REFERENCES transactions ON DELETE CASCADE,
  tag_id UUID REFERENCES tags ON DELETE CASCADE,
  PRIMARY KEY (transaction_id, tag_id)
);
```

#### recurring_transactions（定期支出・収入の設定）
```sql
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL, -- 'expense' or 'income'
  is_oshi_related BOOLEAN DEFAULT false,
  oshi_id UUID REFERENCES oshi,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL,
  memo TEXT,
  frequency TEXT NOT NULL, -- 'monthly' or 'yearly'
  day_of_month INTEGER, -- 1-31（monthly用）
  month INTEGER, -- 1-12（yearly用）
  day_of_year INTEGER, -- 1-365（yearly用、月日の組み合わせ）
  start_date DATE NOT NULL,
  end_date DATE, -- NULLなら無期限
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### recurring_transaction_tags（定期設定とタグの関連）
```sql
CREATE TABLE recurring_transaction_tags (
  recurring_transaction_id UUID REFERENCES recurring_transactions ON DELETE CASCADE,
  tag_id UUID REFERENCES tags ON DELETE CASCADE,
  PRIMARY KEY (recurring_transaction_id, tag_id)
);
```

#### subscriptions（サブスクリプション状況）
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL, -- 'free', 'premium', (将来)'premium_plus'
  status TEXT, -- 'active', 'canceled', 'past_due'
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS) を設定

セキュリティのため、各テーブルにRLSを設定

```sql
-- RLSを有効化
ALTER TABLE oshi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transaction_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ポリシー作成（oshi テーブル）
CREATE POLICY "Users can view their own oshi"
  ON oshi FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own oshi"
  ON oshi FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own oshi"
  ON oshi FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own oshi"
  ON oshi FOR DELETE
  USING (auth.uid() = user_id);

-- ポリシー作成（tags テーブル）
CREATE POLICY "Users can view their own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
  ON tags FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON tags FOR DELETE
  USING (auth.uid() = user_id);

-- ポリシー作成（transactions テーブル）
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ポリシー作成（transaction_tags テーブル）
CREATE POLICY "Users can view their own transaction_tags"
  ON transaction_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = transaction_tags.transaction_id
      AND transactions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own transaction_tags"
  ON transaction_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = transaction_tags.transaction_id
      AND transactions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own transaction_tags"
  ON transaction_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM transactions
      WHERE transactions.id = transaction_tags.transaction_id
      AND transactions.user_id = auth.uid()
    )
  );

-- ポリシー作成（recurring_transactions テーブル）
CREATE POLICY "Users can view their own recurring_transactions"
  ON recurring_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recurring_transactions"
  ON recurring_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring_transactions"
  ON recurring_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring_transactions"
  ON recurring_transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ポリシー作成（recurring_transaction_tags テーブル）
CREATE POLICY "Users can view their own recurring_transaction_tags"
  ON recurring_transaction_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recurring_transactions
      WHERE recurring_transactions.id = recurring_transaction_tags.recurring_transaction_id
      AND recurring_transactions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own recurring_transaction_tags"
  ON recurring_transaction_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recurring_transactions
      WHERE recurring_transactions.id = recurring_transaction_tags.recurring_transaction_id
      AND recurring_transactions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own recurring_transaction_tags"
  ON recurring_transaction_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM recurring_transactions
      WHERE recurring_transactions.id = recurring_transaction_tags.recurring_transaction_id
      AND recurring_transactions.user_id = auth.uid()
    )
  );

-- ポリシー作成（subscriptions テーブル）
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- ポリシー作成（scheduled_transactions テーブル）
CREATE POLICY "Users can view their own scheduled_transactions"
  ON scheduled_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled_transactions"
  ON scheduled_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled_transactions"
  ON scheduled_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled_transactions"
  ON scheduled_transactions FOR DELETE
  USING (auth.uid() = user_id);
```

### Phase 1.5で追加するテーブル

#### scheduled_transactions（未来の支払い予定）
```sql
CREATE TABLE scheduled_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL, -- 'expense' or 'income'
  is_oshi_related BOOLEAN DEFAULT false,
  oshi_id UUID REFERENCES oshi,
  estimated_amount INTEGER NOT NULL, -- 予定金額
  actual_amount INTEGER, -- 実際の金額（完了時）
  category TEXT NOT NULL,
  memo TEXT,
  scheduled_date DATE NOT NULL, -- 予定日 or 支払期限
  status TEXT NOT NULL, -- 'scheduled', 'confirmed', 'completed', 'cancelled'
  completed_transaction_id UUID REFERENCES transactions, -- 完了時に作成される実レコードID
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 開発スケジュール

### Week 1: 基礎機能
- **Day 1-2**: プロジェクトセットアップ、Supabaseセットアップ、認証実装
- **Day 3-4**: 支出・収入の登録・編集・削除（CRUD）
- **Day 5-6**: 推し管理、タグ管理
- **Day 7**: 定期支出・収入の設定機能

### Week 2: 表示と集計
- **Day 8-9**: 支出一覧（定期分の動的生成含む）
- **Day 10-11**: 集計機能（推し別、カテゴリ別、タグ別）
- **Day 12-13**: 月次レポート、グラフ表示
- **Day 14**: 無料版の制限実装

### Week 3: 課金とローンチ準備
- **Day 15-17**: Stripe連携、課金フロー
- **Day 18-19**: UI/UX改善、バグ修正、PWA設定
- **Day 20**: LP（ランディングページ）作成
- **Day 21**: ベータテスト、最終調整、リリース

---

## マーケティング戦略

### 開発中（並行作業）
- X（Twitter）で毎日の開発進捗を投稿
- スクリーンショットを積極的に公開
- 「#個人開発」「#推し活」「#家計簿」タグを活用
- 「こういう機能があったら使いたい？」とアンケート実施
- クローズドβテスター10人程度を募集（無料でフィードバック）

### リリース時
- X（Twitter）で正式リリース告知
- note/Zennで「オタク向け家計簿を作った話」記事執筆
- オタク系コミュニティ（Discord、Reddit）で紹介
- Product Hunt への掲載

### リリース後
- ユーザーの声を積極的に収集
- 要望の多い機能を優先的に実装
- 成功事例（「推し活費用を可視化したら計画的に使えるようになった」など）をシェア

---

## 収益シミュレーション

### 目標
1年以内に月40万円の収益

### 必要なユーザー数
- 月額280円の場合：1,429人の有料ユーザー
- 無料→有料の転換率を5%と仮定すると、28,580人の総ユーザー数が必要

### 段階的な目標
- **3ヶ月目**: 100人の有料ユーザー（月2.8万円）
- **6ヶ月目**: 500人の有料ユーザー（月14万円）
- **9ヶ月目**: 1,000人の有料ユーザー（月28万円）
- **12ヶ月目**: 1,500人の有料ユーザー（月42万円）← 目標達成

### リスクとリアリティ
- 1年で月40万円は挑戦的だが、不可能ではない
- 差別化機能（未来の支払い予定管理）が刺されば達成可能
- Phase 2でプレミアムプラス（480円）を追加すれば、より早く達成可能
- 最悪のケース：2〜3年かけて達成するプランBも準備

---

## 次のステップ

1. **Supabaseアカウント作成**
2. **Next.jsプロジェクト初期化**
3. **基本的なUIコンポーネント作成**
4. **認証機能の実装**
5. **データベーステーブルの作成**

Claude Codeでの開発を開始してください！
