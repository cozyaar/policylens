import { getPolicyBySlug, getAllPolicies } from '@/db/queries';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PolicyPageClient from './PolicyPageClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const policy = await getPolicyBySlug(resolvedParams.slug);
  if (!policy) return { title: 'Policy Not Found — PolicyLens' };
  return {
    title: `${policy.name} (${policy.insurer}) — PolicyLens Score ${policy.overallScore}/100`,
    description: policy.tagline || `In-depth analysis, hidden loopholes, and deterministic rating for ${policy.name} by ${policy.insurer}.`,
  };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const policy = await getPolicyBySlug(resolvedParams.slug);

  if (!policy) {
    notFound();
  }

  return <PolicyPageClient policy={policy} />;
}

// Generate static params for existing slugs at build time
export async function generateStaticParams() {
  const policies = await getAllPolicies();
  return policies.map((policy) => ({
    slug: policy.slug,
  }));
}
