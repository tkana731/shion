import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Supabase接続設定
const connectionString = process.env.DATABASE_URL!;

// PostgreSQLクライアント
export const client = postgres(connectionString);

// Drizzleクライアント
export const db = drizzle(client, { schema });
