import { db } from './index';
import { policiesTable } from './schema';
import { eq, ilike, or, desc } from 'drizzle-orm';
import type { Policy } from '../data/policies';
import {
  policies as staticPolicies,
  getPolicyBySlug as staticGetBySlug,
} from '../data/policies';

/**
 * In-memory store for newly ingested policies during the application runtime.
 * Ensures dynamically analyzed policies are immediately accessible even if
 * a remote database is not configured.
 */
const dynamicPoliciesMap = new Map<string, Policy>();

/**
 * Saves or updates a policy in the runtime store and the database (if connected).
 */
export async function savePolicy(policy: Policy): Promise<Policy> {
  dynamicPoliciesMap.set(policy.slug, policy);

  if (db) {
    try {
      await db.insert(policiesTable).values({
        id: policy.id,
        slug: policy.slug,
        name: policy.name,
        insurer: policy.insurer,
        insurerLogo: policy.insurerLogo,
        planType: String(policy.planType),
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
        target: policiesTable.slug,
        set: {
          name: policy.name,
          overallScore: policy.overallScore,
          dimensions: policy.dimensions,
          features: policy.features,
          loopholes: policy.loopholes,
          profileFit: policy.profileFit,
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      console.warn('[DB] Failed to persist policy to database, retained in memory:', err);
    }
  }

  return policy;
}

/**
 * Converts a DB row back to the Policy interface used by components.
 */
function rowToPolicy(row: typeof policiesTable.$inferSelect): Policy {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    insurer: row.insurer,
    insurerLogo: row.insurerLogo,
    planType: row.planType,
    category: row.category as Policy['category'],
    overallScore: row.overallScore,
    tagline: row.tagline,
    highlights: row.highlights,
    dimensions: row.dimensions,
    features: row.features,
    loopholes: row.loopholes,
    profileFit: row.profileFit,
    alternatives: row.alternatives,
    pairings: row.pairings,
  };
}

/**
 * Automatically seeds the database if it's connected but contains zero policies.
 */
let autoSeedAttempted = false;
async function autoSeedIfEmpty() {
  if (!db || autoSeedAttempted) return;
  autoSeedAttempted = true;
  try {
    const existing = await db.select({ id: policiesTable.id }).from(policiesTable).limit(1);
    if (existing.length === 0) {
      console.log('[DB] Connected database is empty. Auto-seeding 6 default policies...');
      for (const p of staticPolicies) {
        await db.insert(policiesTable).values({
          id: p.id,
          slug: p.slug,
          name: p.name,
          insurer: p.insurer,
          insurerLogo: p.insurerLogo,
          planType: p.planType,
          category: p.category,
          overallScore: p.overallScore,
          tagline: p.tagline,
          highlights: p.highlights,
          dimensions: p.dimensions,
          features: p.features,
          loopholes: p.loopholes,
          profileFit: p.profileFit,
          alternatives: p.alternatives,
          pairings: p.pairings,
        }).onConflictDoNothing();
      }
      console.log('[DB] Auto-seed complete.');
    }
  } catch (err) {
    console.warn('[DB] Auto-seed skipped:', err);
  }
}

/** Get all policies, sorted by score descending */
export async function getAllPolicies(): Promise<Policy[]> {
  if (db) {
    try {
      const rows = await db
        .select()
        .from(policiesTable)
        .orderBy(desc(policiesTable.overallScore));

      if (rows.length > 0) {
        const dbPolicies = rows.map(rowToPolicy);
        // Include any newly ingested in-memory policies not yet in DB
        const dbSlugs = new Set(dbPolicies.map(p => p.slug));
        const additional = Array.from(dynamicPoliciesMap.values()).filter(p => !dbSlugs.has(p.slug));
        return [...dbPolicies, ...additional].sort((a, b) => b.overallScore - a.overallScore);
      } else {
        // DB returned 0 rows, trigger background seed and fall back to static policies
        autoSeedIfEmpty().catch(() => {});
      }
    } catch (error) {
      console.warn('[DB] Failed to query policies from database, falling back to static data:', error);
    }
  }

  // Fallback: merge static policies with any dynamic in-memory policies
  const combined = new Map<string, Policy>();
  for (const p of staticPolicies) {
    combined.set(p.slug, p);
  }
  for (const [slug, p] of dynamicPoliciesMap.entries()) {
    combined.set(slug, p);
  }

  return Array.from(combined.values()).sort((a, b) => b.overallScore - a.overallScore);
}

/** Get a single policy by slug */
export async function getPolicyBySlug(slug: string): Promise<Policy | undefined> {
  // First check dynamic policies
  if (dynamicPoliciesMap.has(slug)) {
    return dynamicPoliciesMap.get(slug);
  }

  if (db) {
    try {
      const rows = await db
        .select()
        .from(policiesTable)
        .where(eq(policiesTable.slug, slug))
        .limit(1);

      if (rows[0]) {
        return rowToPolicy(rows[0]);
      }
    } catch (error) {
      console.warn(`[DB] Failed to fetch policy '${slug}' from database, checking static fallback:`, error);
    }
  }

  return staticGetBySlug(slug);
}

/** Search policies by name, insurer, plan type, or category */
export async function searchPolicies(query: string): Promise<Policy[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return getAllPolicies();
  }

  if (db) {
    try {
      const q = `%${trimmed.toLowerCase()}%`;
      const rows = await db
        .select()
        .from(policiesTable)
        .where(
          or(
            ilike(policiesTable.name, q),
            ilike(policiesTable.insurer, q),
            ilike(policiesTable.planType, q),
            ilike(policiesTable.category, q),
            ilike(policiesTable.tagline, q),
          )
        )
        .orderBy(desc(policiesTable.overallScore));

      if (rows.length > 0) {
        return rows.map(rowToPolicy);
      }
    } catch (error) {
      console.warn('[DB] Database search failed, falling back to local search engine:', error);
    }
  }

  // Use the advanced relevance/fuzzy search engine from DAL
  const allCurrent = await getAllPolicies();
  const q = trimmed.toLowerCase();

  return allCurrent
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.insurer.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.planType.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.highlights.some(h => h.toLowerCase().includes(q))
    )
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName === q) return -1;
      if (bName === q) return 1;
      if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
      if (!aName.startsWith(q) && bName.startsWith(q)) return 1;
      return b.overallScore - a.overallScore;
    });
}

/** Get all unique insurer names */
export async function getAllInsurers(): Promise<string[]> {
  if (db) {
    try {
      const rows = await db
        .selectDistinct({ insurer: policiesTable.insurer })
        .from(policiesTable);
      if (rows.length > 0) {
        return rows.map(r => r.insurer);
      }
    } catch (error) {
      console.warn('[DB] Failed to fetch insurers from DB, falling back to static data:', error);
    }
  }

  const all = await getAllPolicies();
  return Array.from(new Set(all.map(p => p.insurer)));
}

/** Get policies by category */
export async function getPoliciesByCategory(category: string): Promise<Policy[]> {
  if (db) {
    try {
      const rows = await db
        .select()
        .from(policiesTable)
        .where(eq(policiesTable.category, category))
        .orderBy(desc(policiesTable.overallScore));
      if (rows.length > 0) {
        return rows.map(rowToPolicy);
      }
    } catch (error) {
      console.warn('[DB] Failed to fetch policies by category from DB, falling back:', error);
    }
  }

  const all = await getAllPolicies();
  return all.filter(p => p.category === category);
}
