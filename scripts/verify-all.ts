import { getAllPolicies, getPolicyBySlug, searchPolicies, getAllInsurers, getPoliciesByCategory, savePolicy } from '../src/db/queries';
import { personalizeScore, PersonalizationAnswers } from '../src/data/scoring';
import type { Policy } from '../src/data/policies';

async function main() {
  console.log('--- 1. Testing getAllPolicies ---');
  const all = await getAllPolicies();
  console.log(`Total policies found: ${all.length}`);
  if (all.length < 12) {
    throw new Error(`Expected at least 12 policies, found ${all.length}`);
  }
  console.log('Top policies:', all.slice(0, 3).map(p => `${p.name} (${p.overallScore})`).join(', '));

  console.log('\n--- 2. Testing getPolicyBySlug ---');
  const care = await getPolicyBySlug('care-supreme');
  if (!care || care.name !== 'Care Supreme') {
    throw new Error('Failed to find care-supreme');
  }
  console.log(`Found: ${care.name} by ${care.insurer}, score: ${care.overallScore}`);

  console.log('\n--- 3. Testing searchPolicies ---');
  const search1 = await searchPolicies('Optima');
  console.log(`Search 'Optima' returned ${search1.length} policies:`, search1.map(p => p.name).join(', '));
  if (!search1.some(p => p.name.includes('Optima'))) {
    throw new Error('Search for Optima failed');
  }

  const emptySearch = await searchPolicies('');
  if (emptySearch.length !== all.length) {
    throw new Error(`Empty search expected ${all.length}, got ${emptySearch.length}`);
  }
  console.log(`Empty search returned all ${emptySearch.length} policies.`);

  console.log('\n--- 4. Testing getAllInsurers ---');
  const insurers = await getAllInsurers();
  console.log(`Found ${insurers.length} insurers:`, insurers.join(', '));
  if (insurers.length < 5) {
    throw new Error('Insurers list too small');
  }

  console.log('\n--- 5. Testing getPoliciesByCategory ---');
  const familyPlans = await getPoliciesByCategory('family');
  console.log(`Found ${familyPlans.length} family plans:`, familyPlans.map(p => p.name).join(', '));
  if (familyPlans.length === 0) {
    throw new Error('Expected at least 1 family plan');
  }

  console.log('\n--- 6. Testing personalizeScore ---');
  const answers: PersonalizationAnswers = {
    medicalRisk: 'major',
    plannedProcedures: 'yes',
    hospitalPreference: 'premium_private',
    oopComfort: 'low',
    budget: 'balanced',
    priority: 'smooth_claims',
    ageGroup: 'adult',
    familyType: 'family',
  };
  const personalized = personalizeScore(care, answers);
  console.log(`Base score: ${personalized.originalScore} -> Personalized score: ${personalized.personalizedScore}`);
  console.log(`Warnings generated: ${personalized.personalWarnings.length}`);
  console.log(`Recommendations: ${personalized.personalRecommendations.length}`);
  if (isNaN(personalized.personalizedScore)) {
    throw new Error('Personalized score is NaN');
  }

  console.log('\n--- 7. Testing dynamic policy saving (savePolicy) ---');
  const testPolicy: Policy = {
    ...care,
    id: 'test-dyn-1',
    slug: 'test-dynamic-policy',
    name: 'Dynamic Test Health Plan',
    overallScore: 95,
  };
  await savePolicy(testPolicy);
  const fetched = await getPolicyBySlug('test-dynamic-policy');
  if (!fetched || fetched.name !== 'Dynamic Test Health Plan') {
    throw new Error('Dynamic policy retrieval failed');
  }
  console.log(`Successfully saved and retrieved dynamic policy: ${fetched.name}`);

  console.log('\n✅ ALL 7 VERIFICATION SUITES PASSED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

