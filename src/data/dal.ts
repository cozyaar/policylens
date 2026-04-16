/**
 * Data Access Layer (DAL) for PolicyLens
 *
 * This module provides the interface between components and the data source.
 * Currently backed by static data in policies.ts.
 * Designed to be swapped to PostgreSQL + Drizzle ORM without changing component code.
 *
 * Migration path:
 *   Static (current) → API Routes → PostgreSQL + Drizzle
 *
 * When migrating, only this file needs to change.
 * All components import from here, not directly from policies.ts.
 */

import {
  Policy,
  policies,
  getPolicyBySlug as staticGetBySlug,
  searchPolicies as staticSearch,
  getAllInsurers as staticGetInsurers,
  getPoliciesByInsurer as staticByInsurer,
  getPoliciesByCategory as staticByCategory,
} from './policies';

export type { Policy, PolicyFeatures, ScoreDimension, Loophole, ProfileFit, PairingOption } from './policies';
export type { PersonalizationAnswers, PersonalizedScore } from './scoring';
export { personalizeScore } from './scoring';

// ─── READ OPERATIONS ───

/** Get all policies, optionally sorted */
export function getAllPolicies(sort: 'score' | 'name' | 'insurer' = 'score'): Policy[] {
  const all = [...policies];
  switch (sort) {
    case 'score': return all.sort((a, b) => b.overallScore - a.overallScore);
    case 'name': return all.sort((a, b) => a.name.localeCompare(b.name));
    case 'insurer': return all.sort((a, b) => a.insurer.localeCompare(b.insurer));
    default: return all;
  }
}

/** Get single policy by slug */
export function getPolicy(slug: string): Policy | undefined {
  return staticGetBySlug(slug);
}

/** Search policies with fuzzy matching */
export function search(query: string): Policy[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllPolicies();

  // Enhanced search: score relevance
  type Scored = { policy: Policy; relevance: number };
  const scored: Scored[] = [];

  for (const p of policies) {
    let relevance = 0;
    const name = p.name.toLowerCase();
    const insurer = p.insurer.toLowerCase();

    // Exact match boosts
    if (name === q) relevance += 100;
    else if (name.startsWith(q)) relevance += 80;
    else if (name.includes(q)) relevance += 60;

    if (insurer === q) relevance += 90;
    else if (insurer.startsWith(q)) relevance += 70;
    else if (insurer.includes(q)) relevance += 50;

    if (p.slug.includes(q)) relevance += 40;
    if (p.planType.toLowerCase().includes(q)) relevance += 30;
    if (p.category.toLowerCase().includes(q)) relevance += 30;
    if (p.tagline.toLowerCase().includes(q)) relevance += 20;

    // Fuzzy: check individual words
    const words = q.split(/\s+/);
    for (const w of words) {
      if (w.length < 2) continue;
      if (name.includes(w)) relevance += 15;
      if (insurer.includes(w)) relevance += 15;
    }

    if (relevance > 0) scored.push({ policy: p, relevance });
  }

  return scored
    .sort((a, b) => b.relevance - a.relevance || b.policy.overallScore - a.policy.overallScore)
    .map(s => s.policy);
}

/** Get all unique insurer names */
export function getInsurers(): string[] {
  return staticGetInsurers();
}

/** Get policies by insurer */
export function getPoliciesByInsurer(insurer: string): Policy[] {
  return staticByInsurer(insurer);
}

/** Get policies by category */
export function getPoliciesByCategory(category: Policy['category']): Policy[] {
  return staticByCategory(category);
}

/** Get categories with counts */
export function getCategoryCounts(): { category: Policy['category']; count: number; label: string }[] {
  const labels: Record<Policy['category'], string> = {
    'comprehensive': 'Comprehensive',
    'family': 'Family',
    'senior': 'Senior Citizen',
    'youth': 'Youth',
    'top-up': 'Top-Up',
    'critical-illness': 'Critical Illness',
  };

  const counts = new Map<Policy['category'], number>();
  for (const p of policies) {
    counts.set(p.category, (counts.get(p.category) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count, label: labels[category] || category }))
    .sort((a, b) => b.count - a.count);
}

/** Get policy comparison data for side-by-side */
export function comparePolicies(slugs: string[]): Policy[] {
  return slugs.map(s => staticGetBySlug(s)).filter((p): p is Policy => !!p);
}

// ─── STATS ───

export function getStats() {
  return {
    totalPolicies: policies.length,
    totalInsurers: getInsurers().length,
    avgScore: Math.round(policies.reduce((s, p) => s + p.overallScore, 0) / policies.length),
    scoreRange: {
      min: Math.min(...policies.map(p => p.overallScore)),
      max: Math.max(...policies.map(p => p.overallScore)),
    },
  };
}
