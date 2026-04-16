import { db } from './index';
import { policiesTable } from './schema';
import { eq, ilike, or, desc } from 'drizzle-orm';
import type { Policy } from '../data/policies';

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

/** Get all policies, sorted by score descending */
export async function getAllPolicies(): Promise<Policy[]> {
  const rows = await db
    .select()
    .from(policiesTable)
    .orderBy(desc(policiesTable.overallScore));
  return rows.map(rowToPolicy);
}

/** Get a single policy by slug */
export async function getPolicyBySlug(slug: string): Promise<Policy | undefined> {
  const rows = await db
    .select()
    .from(policiesTable)
    .where(eq(policiesTable.slug, slug))
    .limit(1);
  return rows[0] ? rowToPolicy(rows[0]) : undefined;
}

/** Search policies by name, insurer, plan type, or category */
export async function searchPolicies(query: string): Promise<Policy[]> {
  const q = `%${query.toLowerCase().trim()}%`;
  if (!query.trim()) return getAllPolicies();

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
  return rows.map(rowToPolicy);
}

/** Get all unique insurer names */
export async function getAllInsurers(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ insurer: policiesTable.insurer })
    .from(policiesTable);
  return rows.map(r => r.insurer);
}

/** Get policies by category */
export async function getPoliciesByCategory(category: string): Promise<Policy[]> {
  const rows = await db
    .select()
    .from(policiesTable)
    .where(eq(policiesTable.category, category))
    .orderBy(desc(policiesTable.overallScore));
  return rows.map(rowToPolicy);
}
