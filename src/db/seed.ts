import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { policies } from '../data/policies';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding policies into the database...');
  
  try {
    for (const policy of policies) {
      await db.insert(schema.policiesTable).values({
        id: policy.id,
        slug: policy.slug,
        name: policy.name,
        insurer: policy.insurer,
        insurerLogo: policy.insurerLogo,
        planType: policy.planType,
        category: policy.category,
        overallScore: policy.overallScore,
        tagline: policy.tagline,
        highlights: policy.highlights,
        dimensions: policy.dimensions,
        features: policy.features,
        loopholes: policy.loopholes,
        profileFit: policy.profileFit,
        alternatives: policy.alternatives,
        pairings: policy.pairings,
      }).onConflictDoUpdate({
        target: schema.policiesTable.slug,
        set: {
          name: policy.name,
          insurer: policy.insurer,
          insurerLogo: policy.insurerLogo,
          planType: policy.planType,
          category: policy.category,
          overallScore: policy.overallScore,
          tagline: policy.tagline,
          highlights: policy.highlights,
          dimensions: policy.dimensions,
          features: policy.features,
          loopholes: policy.loopholes,
          profileFit: policy.profileFit,
          alternatives: policy.alternatives,
          pairings: policy.pairings,
          updatedAt: new Date(),
        }
      });
      console.log(`Upserted: ${policy.name}`);
    }
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.end();
  }
}

seed();
