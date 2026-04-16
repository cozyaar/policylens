import { config } from 'dotenv';
config({ path: '.env.local' });
import { analyzePolicy } from './src/lib/ingestion';
import { db } from './src/db/index';
import { policiesTable } from './src/db/schema';

async function testAnalysis() {
  console.log("Starting analysis...");
  try {
    const data = await analyzePolicy("Care Supreme Health Insurance");
    console.log("SUCCESS! Policy analyzed.");
    
    console.log("Attempting DB save...");
    await db.insert(policiesTable).values(data).onConflictDoUpdate({
      target: policiesTable.slug,
      set: data
    });
    console.log("DB save succeeded!");
    process.exit(0);
  } catch(e: any) {
    console.error("ERROR:");
    console.error(e);
    process.exit(1);
  }
}

testAnalysis();
