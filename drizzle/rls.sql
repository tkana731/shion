-- Row Level Security (RLS) 設定
-- このファイルは現在のRLS状態の完全な定義です
-- npm run db:rls で適用すると、既存のポリシーはスキップされ、新しいポリシーのみが追加されます
-- 何度実行しても安全（冪等性）です

-- RLSを有効化
ALTER TABLE oshi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transaction_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_transactions ENABLE ROW LEVEL SECURITY;

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
