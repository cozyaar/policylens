export interface PolicyFeatures {
  roomRentLimit: string;
  icuCaps: string;
  diseaseSubLimits: string;
  waitingPeriods: string;
  coPayClauses: string;
  networkHospitals: string;
  opdCoverage: string;
  maternityCoverage: string;
  addOns: string[];
  claimSettlement: string;
  sumInsuredRange: string;
  premiumRange: string;
  renewalAge: string;
  preExistingWaiting: string;
  dayCareProcedures: string;
  ambulanceCover: string;
  restoreBenefit: string;
}

export interface ScoreDimension {
  name: string;
  score: number;
  explanation: string;
}

export interface Loophole {
  title: string;
  severity: 'high' | 'medium' | 'low';
  impact: string;
  whenItMatters: string;
}

export interface ProfileFit {
  bestFor: string[];
  riskyFor: string[];
}

export interface PairingOption {
  type: string;
  reason: string;
  coverageImprovement: number;
  description: string;
}

export interface Policy {
  id: string;
  slug: string;
  name: string;
  insurer: string;
  insurerLogo: string;
  planType: string;
  overallScore: number;
  dimensions: ScoreDimension[];
  features: PolicyFeatures;
  loopholes: Loophole[];
  profileFit: ProfileFit;
  alternatives: string[];
  pairings: PairingOption[];
  tagline: string;
  highlights: string[];
  category: 'comprehensive' | 'family' | 'senior' | 'youth' | 'top-up' | 'critical-illness';
}

export const policies: Policy[] = [
  // ─── HDFC ERGO ───
  {
    id: '1', slug: 'hdfc-ergo-optima-secure',
    name: 'Optima Secure',
    insurer: 'HDFC Ergo', insurerLogo: '🏦',
    planType: 'Individual / Family Floater',
    category: 'comprehensive',
    overallScore: 91,
    tagline: 'Industry-leading 4X coverage structure with zero restrictions',
    highlights: ['4X sum insured from day one', 'No room rent limits', 'No disease sub-limits', 'Consumables covered under Protect Benefit'],
    dimensions: [
      { name: 'Coverage Strength', score: 96, explanation: '4X coverage structure: Secure (2X), Plus (3X), Restore (4X). No room rent caps, no sub-limits, consumables covered.' },
      { name: 'Claim Friendliness', score: 90, explanation: 'No proportional deductions. Wide cashless network. Pre/post hospitalization 60/180 days.' },
      { name: 'Hidden Restrictions', score: 88, explanation: 'Very few restrictions. Consumables covered via Protect Benefit. AYUSH included.' },
      { name: 'Waiting Period Risk', score: 82, explanation: '30-day initial, 2 years specific, 3 years PED. PED reducible via add-on.' },
      { name: 'Value for Money', score: 88, explanation: 'Premium pricing but justified by 4X coverage. Online and multi-year discounts available.' },
    ],
    features: {
      roomRentLimit: 'No limit (all variants)',
      icuCaps: 'No separate ICU cap',
      diseaseSubLimits: 'None',
      waitingPeriods: '30 days initial, 24 months specific, 36 months PED',
      coPayClauses: 'No co-pay',
      networkHospitals: '13,000+ hospitals',
      opdCoverage: 'Available as add-on',
      maternityCoverage: 'Available as add-on',
      addOns: ['Maternity', 'OPD', 'ABCD Chronic Care', 'Personal Accident', 'Critical Illness'],
      claimSettlement: '96% settlement ratio',
      sumInsuredRange: '₹5L – ₹2Cr',
      premiumRange: '₹8,000 – ₹55,000/year',
      renewalAge: 'Lifetime renewability',
      preExistingWaiting: '36 months (reducible via add-on)',
      dayCareProcedures: '586+ procedures covered',
      ambulanceCover: 'Road + Air ambulance covered',
      restoreBenefit: '100% automatic restore (4X total)',
    },
    loopholes: [
      { title: 'Higher Premium vs Peers', severity: 'medium', impact: 'Premiums are 20-40% higher than Care Supreme or Niva Bupa for equivalent SI. The 4X structure partially justifies this.', whenItMatters: 'Budget-conscious buyers comparing annual outflow across plans.' },
      { title: 'OPD Not Included by Default', severity: 'medium', impact: 'Outpatient visits, diagnostics, pharmacy costs need a separate rider.', whenItMatters: 'Frequent doctor visits or regular diagnostic tests.' },
      { title: 'Maternity Requires Add-on + Wait', severity: 'medium', impact: 'Maternity is not built-in. Even the add-on has a waiting period.', whenItMatters: 'Couples planning pregnancy within 2-3 years.' },
    ],
    profileFit: {
      bestFor: ['Professionals wanting zero-restriction coverage', 'Families in metro cities with expensive hospitals', 'Anyone wanting the 4X coverage safety net', 'Those who value consumables coverage'],
      riskyFor: ['Budget buyers — premium is above average', 'Those needing maternity coverage soon', 'Young healthy individuals who rarely get hospitalized'],
    },
    alternatives: ['care-supreme', 'niva-bupa-reassure'],
    pairings: [
      { type: 'OPD Plan', reason: 'Covers routine outpatient expenses', coverageImprovement: 15, description: 'Add the HDFC Ergo OPD rider to cover doctor consultations, diagnostics, and pharmacy.' },
      { type: 'Critical Illness', reason: 'Lump-sum payout on diagnosis', coverageImprovement: 20, description: 'Standalone CI plan supplements indemnity with a lump-sum on critical diagnosis.' },
    ],
  },
  // ─── CARE HEALTH ───
  {
    id: '2', slug: 'care-supreme',
    name: 'Care Supreme',
    insurer: 'Care Health', insurerLogo: '💚',
    planType: 'Individual / Family Floater',
    category: 'comprehensive',
    overallScore: 89,
    tagline: 'Best-in-class value with no room rent caps and no co-pay',
    highlights: ['No room rent capping', 'No co-payment', '3-year PED waiting (reducible)', 'Instant Cover rider available'],
    dimensions: [
      { name: 'Coverage Strength', score: 92, explanation: 'No sub-limits on room rent or ICU. Covers AYUSH, modern treatments, and 580+ day-care procedures.' },
      { name: 'Claim Friendliness', score: 88, explanation: 'Zero co-pay, wide network, pre/post hospitalization 60/180 days. Good claim experience.' },
      { name: 'Hidden Restrictions', score: 86, explanation: 'Minimal restrictions. Instant Cover rider can reduce PED wait to 30 days for select conditions.' },
      { name: 'Waiting Period Risk', score: 80, explanation: '36-month PED standard, reducible via Instant Cover. 24 months for specific diseases.' },
      { name: 'Value for Money', score: 93, explanation: 'One of the best value-for-money plans. Competitive premiums with rich features.' },
    ],
    features: {
      roomRentLimit: 'No limit', icuCaps: 'No cap', diseaseSubLimits: 'None',
      waitingPeriods: '30 days initial, 24 months specific, 36 months PED',
      coPayClauses: 'No co-pay', networkHospitals: '12,000+ hospitals',
      opdCoverage: 'Not available', maternityCoverage: 'Not available',
      addOns: ['Instant Cover', 'Air Ambulance', 'Personal Accident'],
      claimSettlement: '90% settlement ratio',
      sumInsuredRange: '₹5L – ₹6Cr', premiumRange: '₹6,000 – ₹40,000/year',
      renewalAge: 'Lifetime renewability', preExistingWaiting: '36 months (reducible)',
      dayCareProcedures: '580+ procedures', ambulanceCover: 'Road ambulance covered',
      restoreBenefit: '100% unlimited restore',
    },
    loopholes: [
      { title: 'No Maternity Coverage', severity: 'high', impact: 'Zero maternity benefit in any form — no add-on available.', whenItMatters: 'Couples planning a family.' },
      { title: 'No OPD Coverage', severity: 'medium', impact: 'Routine doctor visits and diagnostics are not covered.', whenItMatters: 'Frequent OPD users or chronic condition management.' },
      { title: 'Claim Settlement Ratio Below Top Peers', severity: 'low', impact: '90% CSR is good but lower than HDFC Ergo (96%) and Star Health (86%).', whenItMatters: 'When evaluating long-term claim reliability.' },
    ],
    profileFit: {
      bestFor: ['Value-conscious buyers wanting premium features', 'Healthy individuals/families', 'Those who want zero restrictions at low cost', 'Metro city residents'],
      riskyFor: ['Couples needing maternity coverage', 'Those wanting OPD benefits', 'Seniors (limited variants for 60+)'],
    },
    alternatives: ['hdfc-ergo-optima-secure', 'niva-bupa-reassure'],
    pairings: [
      { type: 'Super Top-Up', reason: 'Extends SI for catastrophic claims', coverageImprovement: 35, description: 'Add a super top-up with deductible matching base SI for large hospital bills.' },
      { type: 'OPD Plan', reason: 'Standalone OPD to cover outpatient gap', coverageImprovement: 15, description: 'Use a standalone OPD plan from another insurer to cover consultations.' },
    ],
  },
  // ─── NIVA BUPA ───
  {
    id: '3', slug: 'niva-bupa-reassure',
    name: 'ReAssure 2.0',
    insurer: 'Niva Bupa', insurerLogo: '🛡️',
    planType: 'Individual / Family Floater',
    category: 'comprehensive',
    overallScore: 90,
    tagline: 'Unlimited reinstatement with Lock the Clock premium freeze',
    highlights: ['ReAssure Forever — unlimited SI reinstatement', 'Lock the Clock premium freeze', 'Booster+ up to 10X SI', 'No room rent limits'],
    dimensions: [
      { name: 'Coverage Strength', score: 94, explanation: 'Unlimited reinstatement post first claim. Booster+ grows SI up to 10X. Short hospitalization from 2 hours.' },
      { name: 'Claim Friendliness', score: 89, explanation: 'No room rent capping, no co-pay. Wide network with cashless facilities.' },
      { name: 'Hidden Restrictions', score: 85, explanation: 'Lock the Clock freezes premium at entry age until first claim. Wellness discounts up to 30%.' },
      { name: 'Waiting Period Risk', score: 78, explanation: 'Standard 36-month PED. 24 months specific. No instant cover rider unlike Care Supreme.' },
      { name: 'Value for Money', score: 90, explanation: 'Lock the Clock + Booster+ make long-term value exceptional. Competitive premiums.' },
    ],
    features: {
      roomRentLimit: 'No limit', icuCaps: 'No cap', diseaseSubLimits: 'None',
      waitingPeriods: '30 days initial, 24 months specific, 36 months PED',
      coPayClauses: 'No co-pay (voluntary option available)', networkHospitals: '10,000+ hospitals',
      opdCoverage: 'Available in higher variants', maternityCoverage: 'Available as add-on',
      addOns: ['Maternity', 'Personal Accident', 'Critical Illness'],
      claimSettlement: '88% settlement ratio',
      sumInsuredRange: '₹5L – ₹1Cr', premiumRange: '₹7,000 – ₹45,000/year',
      renewalAge: 'Lifetime renewability', preExistingWaiting: '36 months',
      dayCareProcedures: '570+ procedures', ambulanceCover: 'Road + Air ambulance',
      restoreBenefit: 'ReAssure Forever — unlimited reinstatement',
    },
    loopholes: [
      { title: 'No PED Reduction Rider', severity: 'medium', impact: 'Unlike Care Supreme Instant Cover, no option to reduce PED wait below 36 months.', whenItMatters: 'People with existing conditions wanting faster coverage.' },
      { title: 'Smaller Hospital Network', severity: 'medium', impact: '10,000 hospitals vs 13,000+ for HDFC Ergo and Star Health.', whenItMatters: 'In tier-2/3 cities where network coverage may be thinner.' },
      { title: 'Lock the Clock Resets on First Claim', severity: 'low', impact: 'Premium freeze based on entry age stops after first claim. Then premiums adjust to current age.', whenItMatters: 'If you make a claim early, the premium advantage diminishes.' },
    ],
    profileFit: {
      bestFor: ['Young buyers locking in low premiums long-term', 'Health-conscious individuals earning wellness discounts', 'Families wanting unlimited reinstatement', 'Those valuing Booster+ SI growth'],
      riskyFor: ['People with PED wanting faster coverage', 'Those in smaller cities with limited network', 'Buyers who may claim early (losing Lock the Clock)'],
    },
    alternatives: ['hdfc-ergo-optima-secure', 'care-supreme'],
    pairings: [
      { type: 'Critical Illness Plan', reason: 'Lump-sum on diagnosis supplements indemnity', coverageImprovement: 20, description: 'Add CI cover for cancer, heart attack, stroke — lump-sum payout irrespective of hospitalization.' },
      { type: 'OPD Plan', reason: 'Routine outpatient expenses', coverageImprovement: 12, description: 'Standalone OPD plan covers doctor visits and diagnostics not included in base.' },
    ],
  },
  // ─── STAR HEALTH ───
  {
    id: '4', slug: 'star-comprehensive',
    name: 'Star Comprehensive',
    insurer: 'Star Health', insurerLogo: '⭐',
    planType: 'Individual / Family Floater',
    category: 'comprehensive',
    overallScore: 82,
    tagline: 'Largest hospital network in India with solid all-round coverage',
    highlights: ['14,000+ network hospitals (largest)', 'No room rent cap in ₹15L+ variants', '541+ day-care procedures', '100% automatic restore'],
    dimensions: [
      { name: 'Coverage Strength', score: 88, explanation: '541+ day-care procedures, AYUSH included. No sub-limits in ₹15L+ variants.' },
      { name: 'Claim Friendliness', score: 80, explanation: 'Largest network at 14,000+ hospitals. 86.4% CSR. Cashless widely available.' },
      { name: 'Hidden Restrictions', score: 75, explanation: 'Lower variants have room rent caps at 1% SI. Some restrictions in first 2 years.' },
      { name: 'Waiting Period Risk', score: 72, explanation: '48-month PED — industry maximum. 24 months specific. Standard 30-day initial.' },
      { name: 'Value for Money', score: 86, explanation: 'Competitive premiums. Restore benefit doubles effective SI.' },
    ],
    features: {
      roomRentLimit: 'No limit (₹15L+) / 1% SI (lower)',
      icuCaps: 'No separate cap in higher variants', diseaseSubLimits: 'None in ≥₹15L',
      waitingPeriods: '30 days initial, 24 months specific, 48 months PED',
      coPayClauses: 'No co-pay below 60', networkHospitals: '14,000+ hospitals',
      opdCoverage: 'Add-on available', maternityCoverage: 'Add-on (24-month wait)',
      addOns: ['Maternity', 'OPD', 'Personal Accident', 'Critical Illness'],
      claimSettlement: '86.4% settlement ratio',
      sumInsuredRange: '₹5L – ₹1Cr', premiumRange: '₹6,500 – ₹45,000/year',
      renewalAge: 'Lifetime renewability', preExistingWaiting: '48 months',
      dayCareProcedures: '541+ procedures', ambulanceCover: 'Up to ₹5,000',
      restoreBenefit: '100% automatic restore',
    },
    loopholes: [
      { title: '48-Month PED Waiting — Longest in Market', severity: 'high', impact: 'No coverage for pre-existing conditions for 4 full years. Most competitors offer 36 months.', whenItMatters: 'Anyone with diabetes, hypertension, thyroid, or chronic conditions.' },
      { title: 'Room Rent Cap on Lower Variants', severity: 'high', impact: 'Below ₹15L SI, room rent capped at 1% SI. Proportionally reduces ALL claim components.', whenItMatters: 'Every hospitalization at a metro hospital where rooms cost more.' },
      { title: 'No OPD by Default', severity: 'medium', impact: 'Routine doctor visits and diagnostics not covered without rider.', whenItMatters: 'Frequent OPD users.' },
    ],
    profileFit: {
      bestFor: ['Those wanting the widest hospital network', 'Families in tier-2/3 cities', 'Cost-conscious buyers with ₹15L+ SI', 'First-time buyers wanting a trusted brand'],
      riskyFor: ['People with pre-existing conditions (4-year wait)', 'Lower SI buyers (room rent caps)', 'Couples planning pregnancy soon'],
    },
    alternatives: ['hdfc-ergo-optima-secure', 'care-supreme', 'star-health-premier'],
    pairings: [
      { type: 'Super Top-Up', reason: 'Extends SI at minimal cost', coverageImprovement: 35, description: 'Add ₹25L–₹1Cr super top-up with deductible matching base SI.' },
      { type: 'OPD Plan', reason: 'Covers outpatient expenses', coverageImprovement: 15, description: 'Star Health OPD add-on or standalone OPD plan.' },
    ],
  },
  // ─── STAR HEALTH PREMIER ───
  {
    id: '5', slug: 'star-health-premier',
    name: 'Star Health Premier',
    insurer: 'Star Health', insurerLogo: '⭐',
    planType: 'Individual / Family Floater',
    category: 'comprehensive',
    overallScore: 87,
    tagline: 'Star Health\'s flagship — zero restrictions with reduced PED waiting',
    highlights: ['No room rent limits on any variant', 'No disease sub-limits', '36-month PED (reduced from 48)', 'Consumables covered'],
    dimensions: [
      { name: 'Coverage Strength', score: 95, explanation: 'Zero sub-limits, no room rent caps, consumables covered, modern treatments included.' },
      { name: 'Claim Friendliness', score: 88, explanation: 'Priority processing. No proportional deductions. 14,000+ hospital network.' },
      { name: 'Hidden Restrictions', score: 85, explanation: 'Very few restrictions. Shorter PED waiting than standard Star plans.' },
      { name: 'Waiting Period Risk', score: 78, explanation: '36-month PED (better than 48). 24 months specific. 30-day initial.' },
      { name: 'Value for Money', score: 82, explanation: 'Higher premium but justified by zero restrictions. Best value at ₹25L+ SI.' },
    ],
    features: {
      roomRentLimit: 'No limit (all variants)', icuCaps: 'No cap', diseaseSubLimits: 'None',
      waitingPeriods: '30 days initial, 24 months specific, 36 months PED',
      coPayClauses: 'No co-pay at any age', networkHospitals: '14,000+ hospitals',
      opdCoverage: 'Add-on available', maternityCoverage: 'Add-on (24-month wait)',
      addOns: ['Maternity', 'OPD', 'PA', 'CI', 'Consumables'],
      claimSettlement: '86.4% settlement ratio',
      sumInsuredRange: '₹10L – ₹1Cr', premiumRange: '₹12,000 – ₹65,000/year',
      renewalAge: 'Lifetime renewability', preExistingWaiting: '36 months',
      dayCareProcedures: '541+', ambulanceCover: 'Up to ₹10,000',
      restoreBenefit: '100% enhanced restore with unlimited resets',
    },
    loopholes: [
      { title: 'Premium 30-50% Higher Than Star Comprehensive', severity: 'medium', impact: 'Significant premium gap adds up over years.', whenItMatters: 'Budget-conscious healthy buyers.' },
      { title: 'OPD Still Not Included', severity: 'medium', impact: 'Despite being premium plan, OPD is still an optional add-on.', whenItMatters: 'Regular doctor visits and diagnostics.' },
    ],
    profileFit: {
      bestFor: ['High-earning professionals', 'Families with elderly members (no co-pay)', 'Metro city residents', 'Those wanting least claim surprises'],
      riskyFor: ['Budget-first buyers', 'Young healthy individuals', 'Those needing maternity soon'],
    },
    alternatives: ['hdfc-ergo-optima-secure', 'star-comprehensive'],
    pairings: [
      { type: 'OPD Plan', reason: 'Fills outpatient gap', coverageImprovement: 15, description: 'Add OPD rider for doctor visits and diagnostics.' },
      { type: 'Critical Illness', reason: 'Lump-sum on critical diagnosis', coverageImprovement: 20, description: 'CI rider for cancer, heart attack, stroke.' },
    ],
  },
  // ─── ICICI LOMBARD ───
  {
    id: '6', slug: 'icici-lombard-elevate',
    name: 'ICICI Elevate',
    insurer: 'ICICI Lombard', insurerLogo: '🏛️',
    planType: 'Individual / Family Floater',
    category: 'comprehensive',
    overallScore: 88,
    tagline: 'AI-powered, highly customizable plan with 29 add-ons and cashless everywhere',
    highlights: ['Cashless at ANY hospital in India', 'Infinite Care — unlimited coverage for one claim', '29 optional add-ons', 'Unlimited reset benefit'],
    dimensions: [
      { name: 'Coverage Strength', score: 93, explanation: 'Infinite Care for one claim of choice. Modern treatments, robotic surgery, immunotherapy covered.' },
      { name: 'Claim Friendliness', score: 91, explanation: 'Cashless at ANY hospital — not limited to network. Unlimited reset.' },
      { name: 'Hidden Restrictions', score: 84, explanation: 'Some add-ons needed for full coverage. Base plan has standard exclusions.' },
      { name: 'Waiting Period Risk', score: 80, explanation: '36-month PED. Jumpstart add-on can reduce waiting periods.' },
      { name: 'Value for Money', score: 85, explanation: 'Mid-range pricing. High customizability lets you pay for what you need.' },
    ],
    features: {
      roomRentLimit: 'No limit', icuCaps: 'No cap', diseaseSubLimits: 'None',
      waitingPeriods: '30 days initial, 24 months specific, 36 months PED',
      coPayClauses: 'No co-pay', networkHospitals: 'Cashless everywhere (any hospital)',
      opdCoverage: 'Available as add-on', maternityCoverage: 'Available as add-on',
      addOns: ['Maternity', 'OPD', 'CI', 'Jumpstart', 'Wellness', 'Global Cover', '+ 23 more'],
      claimSettlement: '93% settlement ratio',
      sumInsuredRange: '₹5L – ₹5Cr', premiumRange: '₹8,000 – ₹50,000/year',
      renewalAge: 'Lifetime renewability', preExistingWaiting: '36 months (reducible)',
      dayCareProcedures: '560+ procedures', ambulanceCover: 'Road + Air ambulance',
      restoreBenefit: '100% unlimited reset',
    },
    loopholes: [
      { title: 'Needs Add-ons for Full Coverage', severity: 'medium', impact: 'Base plan is good but key features (maternity, OPD, CI) require paid add-ons.', whenItMatters: 'If buying base plan only and expecting comprehensive coverage.' },
      { title: 'Complexity of 29 Add-ons', severity: 'low', impact: 'Too many options can confuse buyers. Risk of paying for unnecessary riders.', whenItMatters: 'First-time buyers without advisor guidance.' },
    ],
    profileFit: {
      bestFor: ['Tech-savvy buyers wanting customization', 'Those wanting cashless at any hospital', 'Families wanting Infinite Care safety net', 'NRI/global coverage seekers'],
      riskyFor: ['Those wanting simple, all-inclusive plans', 'Budget buyers (add-ons increase cost)', 'First-time buyers overwhelmed by options'],
    },
    alternatives: ['hdfc-ergo-optima-secure', 'niva-bupa-reassure'],
    pairings: [
      { type: 'Jumpstart Add-on', reason: 'Reduces PED waiting periods', coverageImprovement: 25, description: 'ICICI\'s Jumpstart rider reduces specific disease and PED waiting periods.' },
      { type: 'Global Cover', reason: 'Worldwide treatment coverage', coverageImprovement: 20, description: 'For those traveling internationally or wanting treatment abroad.' },
    ],
  },
  // ─── BAJAJ ALLIANZ ───
  {
    id: '7', slug: 'bajaj-allianz-health-guard',
    name: 'Health Guard (Gold)',
    insurer: 'Bajaj Allianz', insurerLogo: '🔵',
    planType: 'Individual / Family Floater',
    category: 'comprehensive',
    overallScore: 79,
    tagline: 'Solid coverage with zone-based pricing and restoration benefit',
    highlights: ['No room rent limit (Gold)', '100% restoration benefit', 'Cumulative bonus up to 100%', 'Zone-based pricing advantage'],
    dimensions: [
      { name: 'Coverage Strength', score: 82, explanation: 'Good coverage in Gold variant. No room rent limits. Standard day-care and domiciliary coverage.' },
      { name: 'Claim Friendliness', score: 76, explanation: 'Decent network. Zone-based copay if treated in higher zone. Pre/post 60/90 days.' },
      { name: 'Hidden Restrictions', score: 72, explanation: 'Zone-based copay of 20% if you pay Zone B premium but treat in Zone A. Age-based copay 56+.' },
      { name: 'Waiting Period Risk', score: 75, explanation: '48-month PED. 24 months specific diseases. Standard 30-day initial.' },
      { name: 'Value for Money', score: 84, explanation: 'Affordable premiums especially in Zone B. Good NCB accumulation.' },
    ],
    features: {
      roomRentLimit: 'No limit (Gold) / 1% SI (Silver)', icuCaps: 'No cap (Gold)', diseaseSubLimits: 'None (Gold)',
      waitingPeriods: '30 days initial, 24 months specific, 48 months PED',
      coPayClauses: '20% zone-based / 20% for 56+', networkHospitals: '9,000+ hospitals',
      opdCoverage: 'Not available', maternityCoverage: 'Not available',
      addOns: ['Personal Accident'], claimSettlement: '88% settlement ratio',
      sumInsuredRange: '₹1.5L – ₹50L', premiumRange: '₹5,000 – ₹35,000/year',
      renewalAge: 'Lifetime renewability', preExistingWaiting: '48 months',
      dayCareProcedures: '500+ procedures', ambulanceCover: 'Up to ₹3,000',
      restoreBenefit: '100% restoration benefit',
    },
    loopholes: [
      { title: '20% Zone-Based Co-pay', severity: 'high', impact: 'If you pay Zone B premiums but get treated in a Zone A city, you pay 20% of the claim.', whenItMatters: 'If you move to a metro or get emergency treatment in a metro city.' },
      { title: '48-Month PED Waiting', severity: 'high', impact: 'Maximum industry PED waiting period. No reduction rider available.', whenItMatters: 'Anyone with chronic conditions.' },
      { title: 'No Maternity or OPD', severity: 'medium', impact: 'No option for maternity or outpatient coverage even as add-on.', whenItMatters: 'Young couples or families.' },
    ],
    profileFit: {
      bestFor: ['Budget buyers in tier-2/3 cities (Zone B savings)', 'Healthy individuals wanting basic reliable cover', 'Those who won\'t need cross-zone treatment'],
      riskyFor: ['Metro residents (zone copay risk)', 'People with PED', 'Families needing maternity cover'],
    },
    alternatives: ['care-supreme', 'star-comprehensive'],
    pairings: [
      { type: 'Super Top-Up', reason: 'Max SI is only ₹50L', coverageImprovement: 40, description: 'Add super top-up for catastrophic coverage beyond ₹50L.' },
      { type: 'Standalone Maternity Plan', reason: 'No maternity option in this plan', coverageImprovement: 15, description: 'Get a separate maternity-focused plan if planning a family.' },
    ],
  },
  // ─── TATA AIG ───
  {
    id: '8', slug: 'tata-aig-medicare',
    name: 'Medicare Premier',
    insurer: 'Tata AIG', insurerLogo: '🟠',
    planType: 'Individual / Family Floater',
    category: 'comprehensive',
    overallScore: 86,
    tagline: 'Global coverage with up to ₹3Cr SI and modern treatment inclusion',
    highlights: ['Global treatment coverage', 'Up to ₹3Cr sum insured', 'Modern treatments & robotic surgery covered', 'Consumables benefit included'],
    dimensions: [
      { name: 'Coverage Strength', score: 92, explanation: 'Global cover, bariatric surgery, dental, organ donor, consumables. Very comprehensive.' },
      { name: 'Claim Friendliness', score: 85, explanation: 'Good cashless network. Second medical opinion facility. Pre/post 60/90 days.' },
      { name: 'Hidden Restrictions', score: 82, explanation: 'Global cover requires initial diagnosis in India. Some variant limitations.' },
      { name: 'Waiting Period Risk', score: 78, explanation: '36-month PED standard. 24 months specific diseases.' },
      { name: 'Value for Money', score: 86, explanation: 'Competitively priced for the feature depth. NCB up to 100%.' },
    ],
    features: {
      roomRentLimit: 'No limit', icuCaps: 'No cap', diseaseSubLimits: 'None',
      waitingPeriods: '30 days initial, 24 months specific, 36 months PED',
      coPayClauses: 'No co-pay', networkHospitals: '10,000+ hospitals',
      opdCoverage: 'Not included', maternityCoverage: 'Not included',
      addOns: ['Personal Accident', 'CI', 'Global Cover'],
      claimSettlement: '91% settlement ratio',
      sumInsuredRange: '₹10L – ₹3Cr', premiumRange: '₹10,000 – ₹60,000/year',
      renewalAge: 'Lifetime renewability', preExistingWaiting: '36 months',
      dayCareProcedures: '540+ procedures', ambulanceCover: 'Road + Air',
      restoreBenefit: '100% automatic restore',
    },
    loopholes: [
      { title: 'No Maternity or OPD', severity: 'medium', impact: 'Neither is available even as add-on.', whenItMatters: 'Families planning pregnancy or needing OPD.' },
      { title: 'Global Cover Requires India Diagnosis', severity: 'low', impact: 'Treatment abroad only covered if initial diagnosis was in India.', whenItMatters: 'If you fall ill while traveling abroad and need immediate treatment.' },
    ],
    profileFit: {
      bestFor: ['Frequent travelers wanting global cover', 'High-SI buyers wanting ₹3Cr coverage', 'Those wanting modern treatment coverage', 'Professionals seeking premium features'],
      riskyFor: ['Budget buyers', 'Those needing maternity/OPD', 'Those wanting smaller SI options'],
    },
    alternatives: ['hdfc-ergo-optima-secure', 'icici-lombard-elevate'],
    pairings: [
      { type: 'OPD Plan', reason: 'No OPD in base plan', coverageImprovement: 15, description: 'Standalone OPD plan for outpatient expenses.' },
      { type: 'Maternity Plan', reason: 'No maternity coverage', coverageImprovement: 12, description: 'Separate maternity-focused plan for pregnancy expenses.' },
    ],
  },
  // ─── ADITYA BIRLA ───
  {
    id: '9', slug: 'aditya-birla-activ-health',
    name: 'Activ Health Platinum Enhanced',
    insurer: 'Aditya Birla Health', insurerLogo: '🔴',
    planType: 'Individual / Family Floater',
    category: 'comprehensive',
    overallScore: 85,
    tagline: 'Wellness-first plan with chronic disease Day 1 coverage and HealthReturns',
    highlights: ['Chronic disease coverage from Day 1', 'HealthReturns™ — earn back 30% premium', '36-month PED', 'No room rent cap (higher SI)'],
    dimensions: [
      { name: 'Coverage Strength', score: 88, explanation: 'Chronic conditions (diabetes, BP, cholesterol, asthma) covered from Day 1. Comprehensive benefits.' },
      { name: 'Claim Friendliness', score: 84, explanation: 'Good network. Pre/post 60/180 days. 100% reload benefit.' },
      { name: 'Hidden Restrictions', score: 80, explanation: 'Room rent is room-category based in lower SI. Zone-based considerations exist.' },
      { name: 'Waiting Period Risk', score: 82, explanation: '36-month PED. But chronic conditions covered from Day 1 — unique advantage.' },
      { name: 'Value for Money', score: 88, explanation: 'HealthReturns earns back up to 30% premium. Excellent long-term value.' },
    ],
    features: {
      roomRentLimit: 'No cap (higher SI) / Room-category based (lower SI)',
      icuCaps: 'No cap', diseaseSubLimits: 'Minimal',
      waitingPeriods: '30 days initial, 24 months specific, 36 months PED',
      coPayClauses: 'No co-pay (standard)', networkHospitals: '10,500+ hospitals',
      opdCoverage: 'Included in higher variants', maternityCoverage: 'Available as add-on',
      addOns: ['Maternity', 'Personal Accident', 'CI', 'Wellness Coach'],
      claimSettlement: '85% settlement ratio',
      sumInsuredRange: '₹2L – ₹2Cr', premiumRange: '₹5,000 – ₹50,000/year',
      renewalAge: 'Lifetime renewability', preExistingWaiting: '36 months',
      dayCareProcedures: '550+ procedures', ambulanceCover: 'Road ambulance',
      restoreBenefit: '100% reload for unrelated illness',
    },
    loopholes: [
      { title: 'Lower SI Variants Have Room Restrictions', severity: 'medium', impact: 'Below ₹5L-7L, room is limited to specific category, not amount.', whenItMatters: 'Budget buyers choosing lower SI.' },
      { title: 'CSR Below Industry Leaders', severity: 'low', impact: '85% claim settlement is acceptable but lower than HDFC Ergo and ICICI.', whenItMatters: 'Long-term claim reliability assessment.' },
      { title: 'HealthReturns Requires Active Tracking', severity: 'low', impact: 'Need to consistently track steps/health metrics via app to earn premium cashback.', whenItMatters: 'If you are not consistently active or don\'t use health apps.' },
    ],
    profileFit: {
      bestFor: ['Health-conscious individuals who exercise regularly', 'People with chronic conditions (Day 1 cover)', 'Those wanting premium cashback via wellness', 'Families wanting OPD in higher variants'],
      riskyFor: ['Inactive individuals (won\'t get HealthReturns)', 'Lower SI buyers (room restrictions)', 'Those wanting simpler plans without wellness tracking'],
    },
    alternatives: ['care-supreme', 'niva-bupa-reassure'],
    pairings: [
      { type: 'Super Top-Up', reason: 'Extend coverage for catastrophic claims', coverageImprovement: 30, description: 'Top-up plan for expenses beyond base SI.' },
      { type: 'Critical Illness', reason: 'Lump-sum for critical diagnoses', coverageImprovement: 20, description: 'CI plan provides lump-sum payout irrespective of hospitalization costs.' },
    ],
  },
  // ─── STAR FAMILY HEALTH OPTIMA ───
  {
    id: '10', slug: 'star-family-health-optima',
    name: 'Family Health Optima',
    insurer: 'Star Health', insurerLogo: '⭐',
    planType: 'Family Floater',
    category: 'family',
    overallScore: 76,
    tagline: 'Budget family floater with newborn coverage from Day 1',
    highlights: ['Newborn cover from Day 1', 'In-built hospital cash', 'NCB up to 100%', 'Affordable family premiums'],
    dimensions: [
      { name: 'Coverage Strength', score: 78, explanation: 'Good family coverage. Newborn from Day 1. Hospital cash built-in. SI limited to ₹25L.' },
      { name: 'Claim Friendliness', score: 74, explanation: 'Good network but pre-auth delays reported. Cashless varies by hospital.' },
      { name: 'Hidden Restrictions', score: 68, explanation: 'Room rent capped at 1% SI ALL variants. ICU at 2% SI. Disease sub-limits.' },
      { name: 'Waiting Period Risk', score: 72, explanation: '48-month PED. 24 months specific. Maternity has extra 9-month wait on top.' },
      { name: 'Value for Money', score: 84, explanation: 'Very competitive premiums. Automatic SI boost and NCB add long-term value.' },
    ],
    features: {
      roomRentLimit: '1% of SI (all variants)', icuCaps: '2% of SI',
      diseaseSubLimits: 'Cataract ₹40,000, hernia, appendix',
      waitingPeriods: '30 days initial, 24 months specific, 48 months PED',
      coPayClauses: '20% for 60+', networkHospitals: '14,000+',
      opdCoverage: 'Not available', maternityCoverage: 'Included (24m + 9m wait)',
      addOns: ['Personal Accident'], claimSettlement: '86.4% settlement ratio',
      sumInsuredRange: '₹5L – ₹25L', premiumRange: '₹8,000 – ₹30,000/year',
      renewalAge: 'Lifetime', preExistingWaiting: '48 months',
      dayCareProcedures: '541+', ambulanceCover: '₹2,500', restoreBenefit: '100% per member',
    },
    loopholes: [
      { title: 'Room Rent Cap on ALL Variants', severity: 'high', impact: '1% SI room rent cap proportionally reduces every claim component.', whenItMatters: 'Every hospitalization in a metro city.' },
      { title: 'ICU Cap at 2% SI', severity: 'high', impact: 'ICU charges capped. Can be exhausted in 2-3 days of critical care.', whenItMatters: 'Any ICU admission in a metro hospital.' },
      { title: '20% Co-pay for 60+', severity: 'high', impact: 'Senior family members pay 20% of every claim out of pocket.', whenItMatters: 'If parents are on the same floater.' },
    ],
    profileFit: {
      bestFor: ['Young families with newborns', 'Budget families wanting floater', 'Families wanting built-in maternity', 'NCB accumulators'],
      riskyFor: ['Families with 60+ members (co-pay)', 'Metro residents (room rent caps)', 'High SI seekers (max ₹25L)', 'OPD needs'],
    },
    alternatives: ['star-comprehensive', 'care-supreme'],
    pairings: [
      { type: 'Super Top-Up', reason: 'Max SI is only ₹25L', coverageImprovement: 45, description: 'Add super top-up for large claims beyond ₹25L.' },
      { type: 'Separate Senior Plan', reason: 'Move 60+ parents off floater to avoid co-pay', coverageImprovement: 25, description: 'Dedicated senior citizen plan eliminates the 20% co-pay burden.' },
    ],
  },
  // ─── STAR YOUNG STAR ───
  {
    id: '11', slug: 'star-young-star',
    name: 'Young Star',
    insurer: 'Star Health', insurerLogo: '⭐',
    planType: 'Individual',
    category: 'youth',
    overallScore: 74,
    tagline: 'Budget-friendly starter policy for young adults with wellness perks',
    highlights: ['Wellness & fitness rewards', 'No medical check-up up to 45', 'Affordable premiums', 'Dental & vision benefits'],
    dimensions: [
      { name: 'Coverage Strength', score: 72, explanation: 'Decent for youth. Wellness benefits included. SI capped at ₹25L.' },
      { name: 'Claim Friendliness', score: 73, explanation: 'Standard process. Cashless at Star network.' },
      { name: 'Hidden Restrictions', score: 68, explanation: 'Room rent 1% SI. Disease sub-limits. Wellness rewards hard to redeem.' },
      { name: 'Waiting Period Risk', score: 70, explanation: '48-month PED. Entry only up to age 40.' },
      { name: 'Value for Money', score: 85, explanation: 'Very affordable. Good starter policy.' },
    ],
    features: {
      roomRentLimit: '1% of SI', icuCaps: '2% of SI', diseaseSubLimits: 'Cataract, hernia, appendix, piles',
      waitingPeriods: '30 days, 24 months specific, 48 months PED',
      coPayClauses: 'No co-pay', networkHospitals: '14,000+',
      opdCoverage: 'Partial — dental/vision', maternityCoverage: 'Not available',
      addOns: ['Personal Accident'], claimSettlement: '86.4%',
      sumInsuredRange: '₹5L – ₹25L', premiumRange: '₹4,500 – ₹15,000/year',
      renewalAge: 'Up to 65 (entry up to 40)', preExistingWaiting: '48 months',
      dayCareProcedures: '400+', ambulanceCover: '₹2,000', restoreBenefit: '50% restore',
    },
    loopholes: [
      { title: 'No Maternity Coverage', severity: 'high', impact: 'Zero maternity benefit. Not even as add-on.', whenItMatters: 'Planning a family.' },
      { title: 'Entry Limited to Age 40', severity: 'medium', impact: 'Cannot buy after 40. Must port or find new plan.', whenItMatters: 'Long-term coverage continuity.' },
      { title: 'Only 50% Restore', severity: 'medium', impact: 'Half the restore benefit of other Star plans.', whenItMatters: 'Multiple hospitalizations in one year.' },
    ],
    profileFit: {
      bestFor: ['Young professionals 18-35', 'Health-conscious individuals', 'Budget-first buyers', 'Singles without maternity needs'],
      riskyFor: ['Family planners', 'Nearing 40 (entry limit)', 'Those wanting comprehensive coverage'],
    },
    alternatives: ['star-comprehensive', 'care-supreme'],
    pairings: [
      { type: 'Super Top-Up', reason: 'Max SI ₹25L with room rent caps', coverageImprovement: 40, description: 'Essential addition for large claim protection.' },
      { type: 'Critical Illness', reason: 'No CI coverage in Young Star', coverageImprovement: 25, description: 'Standalone CI for cancer, heart attack, stroke.' },
    ],
  },
  // ─── STAR SENIOR CITIZENS RED CARPET ───
  {
    id: '12', slug: 'star-senior-citizens-red-carpet',
    name: 'Senior Citizens Red Carpet',
    insurer: 'Star Health', insurerLogo: '⭐',
    planType: 'Individual (Senior)',
    category: 'senior',
    overallScore: 68,
    tagline: 'One of few options for seniors — comes with significant trade-offs',
    highlights: ['Entry up to age 75', '12-month PED waiting (short)', 'No medical test up to ₹5L', 'Built-in health check-up'],
    dimensions: [
      { name: 'Coverage Strength', score: 62, explanation: 'Basic coverage. SI limited. Sub-limits on common procedures.' },
      { name: 'Claim Friendliness', score: 60, explanation: 'Higher rejection rates. Slow pre-auth. Co-pay reduces payout.' },
      { name: 'Hidden Restrictions', score: 55, explanation: '10-30% co-pay by age. Sub-limits on cataract/knee. No add-ons.' },
      { name: 'Waiting Period Risk', score: 65, explanation: '12-month PED (short). But at senior ages, 12 months uninsured is risky.' },
      { name: 'Value for Money', score: 70, explanation: 'Expensive for coverage. But few alternatives exist for seniors.' },
    ],
    features: {
      roomRentLimit: '1% of SI', icuCaps: '2% of SI', diseaseSubLimits: 'Cataract ₹50K, knee ₹2L',
      waitingPeriods: '30 days, 12 months PED, 24 months specific',
      coPayClauses: '10% (60-70), 20% (70-75), 30% (75+)', networkHospitals: '14,000+',
      opdCoverage: 'Not available', maternityCoverage: 'N/A',
      addOns: ['None'], claimSettlement: '86.4%',
      sumInsuredRange: '₹1L – ₹25L', premiumRange: '₹15,000 – ₹55,000/year',
      renewalAge: 'Lifetime', preExistingWaiting: '12 months',
      dayCareProcedures: '400+', ambulanceCover: '₹2,500', restoreBenefit: '50% restore',
    },
    loopholes: [
      { title: 'Escalating Co-Pay (up to 30%)', severity: 'high', impact: '₹5L claim at age 76 = ₹1.5L out of pocket.', whenItMatters: 'Every claim. Gets worse with age.' },
      { title: 'Low SI Options', severity: 'high', impact: 'Max ₹25L. One surgery can exhaust it.', whenItMatters: 'Major surgeries or cancer treatment.' },
      { title: 'Disease Sub-Limits', severity: 'high', impact: 'Cataract ₹50K, knee ₹2L — most common senior procedures.', whenItMatters: 'Common procedures exceed sub-limit by 2-3x.' },
    ],
    profileFit: {
      bestFor: ['Seniors 60-75 with no existing policy', 'Those needing short PED wait (12mo)', 'Basic hospitalization safety net'],
      riskyFor: ['Seniors needing frequent care (co-pay)', 'Major surgery candidates (low SI)', 'Those above 75 (30% co-pay)'],
    },
    alternatives: ['star-health-premier'],
    pairings: [
      { type: 'Super Top-Up', reason: 'Base SI very limited', coverageImprovement: 50, description: 'Senior-friendly top-up to extend SI to ₹50L+.' },
      { type: 'Personal Accident', reason: 'Fall/fracture risk for seniors', coverageImprovement: 15, description: 'PA cover for accidental injuries and disabilities.' },
    ],
  },
];

export function getPolicyBySlug(slug: string): Policy | undefined {
  return policies.find(p => p.slug === slug);
}

export function searchPolicies(query: string): Policy[] {
  const q = query.toLowerCase().trim();
  if (!q) return policies;
  return policies.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.insurer.toLowerCase().includes(q) ||
      p.slug.includes(q) ||
      p.planType.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q)
  );
}

export function getAllInsurers(): string[] {
  return [...new Set(policies.map(p => p.insurer))];
}

export function getPoliciesByInsurer(insurer: string): Policy[] {
  return policies.filter(p => p.insurer === insurer);
}

export function getPoliciesByCategory(category: Policy['category']): Policy[] {
  return policies.filter(p => p.category === category);
}
