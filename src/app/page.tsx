import { getAllPolicies } from '@/db/queries';
import HomePageClient from './HomePageClient';

// Ensure the page is dynamically rendered if we want real-time DB data
// export const dynamic = 'force-dynamic';
// For now, we'll let Next.js cache it statically until we add a revalidation strategy.

export default async function Home() {
  const policies = await getAllPolicies();
  
  return <HomePageClient policies={policies} />;
}
