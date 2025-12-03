import { pgTable, text, uuid, timestamp, boolean, integer, date, primaryKey, pgSchema } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Supabase Authスキーマの定義
export const authSchema = pgSchema('auth');

// auth.usersテーブルの参照
export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

// oshi（推し）テーブル
export const oshi = pgTable('oshi', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow(),
});

// tags（タグ）テーブル
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow(),
});

// transactions（支出・収入の実レコード）テーブル
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  type: text('type', { enum: ['expense', 'income'] }).notNull(),
  isOshiRelated: boolean('is_oshi_related').default(false),
  oshiId: uuid('oshi_id').references(() => oshi.id),
  amount: integer('amount').notNull(),
  category: text('category').notNull(),
  memo: text('memo'),
  date: date('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  recurringOverrideId: uuid('recurring_override_id').references(() => recurringTransactions.id),
});

// transaction_tags（支出・収入とタグの関連）テーブル
export const transactionTags = pgTable('transaction_tags', {
  transactionId: uuid('transaction_id').notNull().references(() => transactions.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.transactionId, table.tagId] }),
}));

// recurring_transactions（定期支出・収入の設定）テーブル
export const recurringTransactions = pgTable('recurring_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  type: text('type', { enum: ['expense', 'income'] }).notNull(),
  isOshiRelated: boolean('is_oshi_related').default(false),
  oshiId: uuid('oshi_id').references(() => oshi.id),
  amount: integer('amount').notNull(),
  category: text('category').notNull(),
  memo: text('memo'),
  frequency: text('frequency', { enum: ['monthly', 'yearly'] }).notNull(),
  dayOfMonth: integer('day_of_month'),
  month: integer('month'),
  dayOfYear: integer('day_of_year'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// recurring_transaction_tags（定期設定とタグの関連）テーブル
export const recurringTransactionTags = pgTable('recurring_transaction_tags', {
  recurringTransactionId: uuid('recurring_transaction_id').notNull().references(() => recurringTransactions.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.recurringTransactionId, table.tagId] }),
}));

// subscriptions（サブスクリプション状況）テーブル
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  plan: text('plan', { enum: ['free', 'premium', 'premium_plus'] }).notNull(),
  status: text('status', { enum: ['active', 'canceled', 'past_due'] }),
  currentPeriodEnd: timestamp('current_period_end'),
  createdAt: timestamp('created_at').defaultNow(),
});

// scheduled_transactions（未来の支払い予定）テーブル - Phase 1.5用
export const scheduledTransactions = pgTable('scheduled_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => authUsers.id),
  type: text('type', { enum: ['expense', 'income'] }).notNull(),
  isOshiRelated: boolean('is_oshi_related').default(false),
  oshiId: uuid('oshi_id').references(() => oshi.id),
  estimatedAmount: integer('estimated_amount').notNull(),
  actualAmount: integer('actual_amount'),
  category: text('category').notNull(),
  memo: text('memo'),
  scheduledDate: date('scheduled_date').notNull(),
  status: text('status', { enum: ['scheduled', 'confirmed', 'completed', 'cancelled'] }).notNull(),
  completedTransactionId: uuid('completed_transaction_id').references(() => transactions.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// リレーション定義（オプション - Drizzleのクエリビルダーで使用）
export const oshiRelations = relations(oshi, ({ one, many }) => ({
  user: one(authUsers, {
    fields: [oshi.userId],
    references: [authUsers.id],
  }),
  transactions: many(transactions),
  recurringTransactions: many(recurringTransactions),
  scheduledTransactions: many(scheduledTransactions),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(authUsers, {
    fields: [tags.userId],
    references: [authUsers.id],
  }),
  transactionTags: many(transactionTags),
  recurringTransactionTags: many(recurringTransactionTags),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  user: one(authUsers, {
    fields: [transactions.userId],
    references: [authUsers.id],
  }),
  oshi: one(oshi, {
    fields: [transactions.oshiId],
    references: [oshi.id],
  }),
  recurringOverride: one(recurringTransactions, {
    fields: [transactions.recurringOverrideId],
    references: [recurringTransactions.id],
  }),
  transactionTags: many(transactionTags),
}));

export const transactionTagsRelations = relations(transactionTags, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transactionTags.transactionId],
    references: [transactions.id],
  }),
  tag: one(tags, {
    fields: [transactionTags.tagId],
    references: [tags.id],
  }),
}));

export const recurringTransactionsRelations = relations(recurringTransactions, ({ one, many }) => ({
  user: one(authUsers, {
    fields: [recurringTransactions.userId],
    references: [authUsers.id],
  }),
  oshi: one(oshi, {
    fields: [recurringTransactions.oshiId],
    references: [oshi.id],
  }),
  recurringTransactionTags: many(recurringTransactionTags),
  overrides: many(transactions),
}));

export const recurringTransactionTagsRelations = relations(recurringTransactionTags, ({ one }) => ({
  recurringTransaction: one(recurringTransactions, {
    fields: [recurringTransactionTags.recurringTransactionId],
    references: [recurringTransactions.id],
  }),
  tag: one(tags, {
    fields: [recurringTransactionTags.tagId],
    references: [tags.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(authUsers, {
    fields: [subscriptions.userId],
    references: [authUsers.id],
  }),
}));

export const scheduledTransactionsRelations = relations(scheduledTransactions, ({ one }) => ({
  user: one(authUsers, {
    fields: [scheduledTransactions.userId],
    references: [authUsers.id],
  }),
  oshi: one(oshi, {
    fields: [scheduledTransactions.oshiId],
    references: [oshi.id],
  }),
  completedTransaction: one(transactions, {
    fields: [scheduledTransactions.completedTransactionId],
    references: [transactions.id],
  }),
}));

// TypeScript型のエクスポート
export type Oshi = typeof oshi.$inferSelect;
export type NewOshi = typeof oshi.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type RecurringTransaction = typeof recurringTransactions.$inferSelect;
export type NewRecurringTransaction = typeof recurringTransactions.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type ScheduledTransaction = typeof scheduledTransactions.$inferSelect;
export type NewScheduledTransaction = typeof scheduledTransactions.$inferInsert;
