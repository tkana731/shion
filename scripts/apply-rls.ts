import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

// .env.localから環境変数を読み込む
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');

for (const line of envLines) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=');
      process.env[key] = value;
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in .env.local');
  process.exit(1);
}

// RLSファイルからポリシー情報を抽出
interface PolicyInfo {
  table: string;
  name: string;
  sql: string;
}

function parseRLSFile(content: string): { enableRLS: string[], policies: PolicyInfo[] } {
  const enableRLS: string[] = [];
  const policies: PolicyInfo[] = [];

  // ALTER TABLE ... ENABLE ROW LEVEL SECURITY を抽出
  const enableMatches = content.matchAll(/ALTER TABLE (\w+) ENABLE ROW LEVEL SECURITY;/g);
  for (const match of enableMatches) {
    enableRLS.push(match[1]);
  }

  // CREATE POLICY を抽出
  const policyPattern = /CREATE POLICY "([^"]+)"\s+ON (\w+)\s+FOR\s+(\w+)[\s\S]*?;/g;
  const matches = content.matchAll(policyPattern);

  for (const match of matches) {
    policies.push({
      name: match[1],
      table: match[2],
      sql: match[0],
    });
  }

  return { enableRLS, policies };
}

async function applyRLS() {
  console.log('🔐 Applying Row Level Security policies...\n');

  const sql = postgres(DATABASE_URL!);

  try {
    // RLSファイルを読み込む
    const rlsSQL = readFileSync(join(process.cwd(), 'drizzle', 'rls.sql'), 'utf-8');
    const { enableRLS, policies } = parseRLSFile(rlsSQL);

    let enabledCount = 0;
    let createdCount = 0;
    let skippedCount = 0;

    // RLSを有効化（既に有効な場合はエラーにならない）
    for (const table of enableRLS) {
      try {
        await sql.unsafe(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
        console.log(`✓ Enabled RLS on table: ${table}`);
        enabledCount++;
      } catch (error: any) {
        // 既に有効な場合はスキップ
        if (error.code !== '42P16') { // 42P16: duplicate_object
          throw error;
        }
      }
    }

    console.log('');

    // 既存のポリシーを確認
    const existingPolicies = await sql<{ schemaname: string; tablename: string; policyname: string }[]>`
      SELECT schemaname, tablename, policyname
      FROM pg_policies
      WHERE schemaname = 'public'
    `;

    const existingPolicySet = new Set(
      existingPolicies.map(p => `${p.tablename}:${p.policyname}`)
    );

    // ポリシーを作成（存在しないものだけ）
    for (const policy of policies) {
      const key = `${policy.table}:${policy.name}`;

      if (existingPolicySet.has(key)) {
        console.log(`⊘ Policy already exists: "${policy.name}" on ${policy.table}`);
        skippedCount++;
      } else {
        try {
          await sql.unsafe(policy.sql);
          console.log(`✓ Created policy: "${policy.name}" on ${policy.table}`);
          createdCount++;
        } catch (error) {
          console.error(`✗ Failed to create policy: "${policy.name}" on ${policy.table}`);
          throw error;
        }
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  - RLS enabled: ${enabledCount} tables`);
    console.log(`  - Policies created: ${createdCount}`);
    console.log(`  - Policies skipped (already exist): ${skippedCount}`);
    console.log('\n✅ RLS policies applied successfully!');
  } catch (error) {
    console.error('\n❌ Failed to apply RLS policies:');
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyRLS();
