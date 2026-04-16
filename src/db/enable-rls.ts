import { config } from 'dotenv';
config({ path: '.env.local' });
import postgres from 'postgres';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is missing');
  }
  const sql = postgres(connectionString);

  console.log('Enabling RLS on policies table...');
  await sql`ALTER TABLE "policies" ENABLE ROW LEVEL SECURITY;`;
  
  console.log('Creating policies for public read access only...');
  await sql`DROP POLICY IF EXISTS "Public Read Access" on "policies";`;
  await sql`CREATE POLICY "Public Read Access" ON "policies" FOR SELECT USING (true);`;
  
  console.log('Success! RLS is enabled and public can only read.');
  process.exit(0);
}

main().catch(console.error);
