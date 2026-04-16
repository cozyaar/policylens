import { getPolicyBySlug, getAllPolicies } from '@/db/queries';
import { notFound } from 'next/navigation';
import PolicyPageClient from './PolicyPageClient';

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
