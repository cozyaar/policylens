import { Loophole, Policy } from './policies';

export interface PersonalizationAnswers {
  medicalRisk: 'none' | 'lifestyle' | 'major';
  plannedProcedures: 'no' | 'maybe' | 'yes';
  hospitalPreference: 'any' | 'network' | 'premium_private';
  oopComfort: 'low' | 'medium' | 'high';
  budget: 'budget' | 'balanced' | 'premium';
  priority: 'lowest_cost' | 'smooth_claims' | 'max_coverage';
  ageGroup: 'young' | 'adult' | 'senior';
  familyType: 'individual' | 'couple' | 'family';
}

export interface PersonalizedScore {
  originalScore: number;
  personalizedScore: number;
  delta: number;
  dimensionDeltas: {
    name: string;
    original: number;
    adjusted: number;
    delta: number;
    reason: string;
  }[];
  personalWarnings: string[];
  personalStrengths: string[];
  personalRecommendations: string[];
  personalizedLoopholes: (Loophole & { isElevated: boolean; customWarning?: string })[];
}

const DEFAULT_WEIGHTS = {
  'Coverage Strength': 0.25,
  'Claim Friendliness': 0.20,
  'Hidden Restrictions': 0.20,
  'Waiting Period Risk': 0.15,
  'Value for Money': 0.20,
};

export function personalizeScore(
  policy: Policy,
  answers: PersonalizationAnswers
): PersonalizedScore {
  const dimensionDeltas = policy.dimensions.map(dim => {
    let adjustment = 0;
    let reason = '';

    switch (dim.name) {
      case 'Coverage Strength': {
        if (answers.plannedProcedures === 'yes') {
          if (policy.features.maternityCoverage.includes('Not')) {
            adjustment = -15;
            reason = 'You plan procedures but this policy has no maternity/procedure coverage';
          } else if (policy.features.maternityCoverage.includes('24')) {
            adjustment = -8;
            reason = 'Planned procedures face a 24-month waiting period';
          }
        }
        if (answers.medicalRisk === 'major' && policy.features.diseaseSubLimits !== 'None') {
          adjustment -= 10;
          reason += (reason ? '. ' : '') + 'Major health risk + disease sub-limits = potential underpayment';
        }
        if (answers.familyType !== 'individual' && policy.planType.toLowerCase().includes('individual')) {
          adjustment -= 15;
          reason = 'You selected Family coverage but this is an Individual plan';
        }
        break;
      }
      case 'Claim Friendliness': {
        if (answers.hospitalPreference === 'premium_private') {
          if (policy.features.roomRentLimit.includes('1%') || policy.features.roomRentLimit.includes('cap')) {
            adjustment = -12;
            reason = 'You prefer premium hospitals but room rent is capped — claims will be proportionally reduced';
          }
        }
        if (answers.priority === 'smooth_claims') {
          adjustment += 5;
          reason += (reason ? '. ' : '') + 'Claim smoothness is your priority — weighted higher';
        }
        break;
      }
      case 'Hidden Restrictions': {
        if (answers.oopComfort === 'low') {
          if (policy.features.coPayClauses.includes('20%') || policy.features.coPayClauses.includes('30%')) {
            adjustment = -15;
            reason = 'Low out-of-pocket comfort but policy has significant co-pay clauses';
          }
          if (policy.features.roomRentLimit.includes('1%')) {
            adjustment -= 8;
            reason += (reason ? '. ' : '') + 'Room rent caps will increase out-of-pocket expenses';
          }
        }
        if (answers.ageGroup === 'senior' && policy.features.coPayClauses.includes('after 60')) {
          adjustment -= 12;
          reason = 'Mandatory senior citizen co-pay triggers automatically for your age group';
        }
        if (answers.medicalRisk === 'lifestyle' && policy.features.diseaseSubLimits !== 'None') {
          adjustment -= 5;
          reason += (reason ? '. ' : '') + 'Lifestyle conditions may trigger sub-limited payouts';
        }
        break;
      }
      case 'Waiting Period Risk': {
        if (answers.medicalRisk === 'major') {
          adjustment = -12;
          reason = 'You have major pre-existing conditions — waiting period is a critical risk';
          if (policy.features.preExistingWaiting === '36 months (reduced from standard 48)') {
            adjustment = -8;
            reason += ', though this plan has a shorter 36-month wait';
          }
        } else if (answers.medicalRisk === 'lifestyle') {
          adjustment = -5;
          reason = 'Lifestyle conditions (diabetes, BP, etc.) face full waiting period before coverage';
        }
        if (answers.plannedProcedures === 'yes') {
          adjustment -= 5;
          reason += (reason ? '. ' : '') + 'Planned procedures may fall under waiting period exclusions';
        }
        break;
      }
      case 'Value for Money': {
        if (answers.budget === 'budget' && policy.features.premiumRange.includes('45,000') || policy.features.premiumRange.includes('65,000')) {
          adjustment = -10;
          reason = 'Premium plan pricing may exceed your budget comfort zone';
        } else if (answers.budget === 'premium') {
          if (policy.features.sumInsuredRange.includes('₹5L') && !policy.features.sumInsuredRange.includes('₹1Cr')) {
            adjustment -= 5;
            reason = 'You want premium coverage but this plan\'s SI range may be limiting';
          }
          adjustment += 5;
          reason += (reason ? '. ' : '') + 'Premium budget unlocks higher variant value';
        }
        if (answers.priority === 'lowest_cost') {
          if (policy.dimensions.find(d => d.name === 'Value for Money')!.score >= 85) {
            adjustment += 5;
            reason += (reason ? '. ' : '') + 'This plan scores well on value — aligns with your cost priority';
          }
        }
        break;
      }
    }

    return {
      name: dim.name,
      original: dim.score,
      adjusted: Math.max(0, Math.min(100, dim.score + adjustment)),
      delta: adjustment,
      reason: reason || 'No significant impact from your profile',
    };
  });

  const personalWarnings: string[] = [];
  const personalStrengths: string[] = [];
  const personalRecommendations: string[] = [];

  // Generate personalized recommendations (Add-ons & Alternative strategies)
  if (answers.budget === 'budget' && policy.features.roomRentLimit.includes('1%')) {
    personalRecommendations.push("Strategy: Instead of upgrading to a premium plan, consider buying a 'Super Top-Up' plan for high room-rent coverage.");
  }
  if (answers.ageGroup === 'senior') {
    personalRecommendations.push("Add-on: Seniors should absolutely look for 'Senior Citizen' specific policies like Star Senior Citizen Red Carpet which bypass PED waiting periods quicker.");
  }
  if (answers.familyType !== 'individual' && policy.planType.toLowerCase().includes('individual')) {
    personalRecommendations.push(`Alternative: Switch to a 'Family Floater' alternative like Optima Secure Family to save on combined premiums.`);
  }
  if (answers.plannedProcedures === 'yes' && policy.features.maternityCoverage.includes('Not')) {
    personalRecommendations.push("Add-on: You must purchase a Maternity Rider or look for plans like Care Joy that are specifically built for maternity.");
  }
  if (answers.medicalRisk === 'major' && parseInt(policy.features.preExistingWaiting) >= 48) {
    personalRecommendations.push("Add-on: Look for a 'Waiver of Pre-Existing Disease' rider to instantly slash your waiting period from 4 years to just 30 days.");
  }

  // Generate personalized warnings
  if (answers.medicalRisk !== 'none' && parseInt(policy.features.preExistingWaiting) >= 48) {
    personalWarnings.push('Your pre-existing conditions won\'t be covered for 4 years with this plan');
  }
  if (answers.hospitalPreference === 'premium_private' && policy.features.roomRentLimit.includes('1%')) {
    personalWarnings.push('Room rent caps will significantly reduce payouts at premium hospitals');
  }
  if (answers.oopComfort === 'low' && (policy.features.coPayClauses.includes('20%') || policy.features.coPayClauses.includes('30%'))) {
    personalWarnings.push('Co-pay clauses conflict with your low out-of-pocket tolerance');
  }
  if (answers.plannedProcedures !== 'no' && policy.features.maternityCoverage.includes('Not')) {
    personalWarnings.push('This plan has no maternity/planned procedure coverage');
  }

  // Generate personalized strengths
  if (answers.budget === 'budget' && policy.dimensions.find(d => d.name === 'Value for Money')!.score >= 85) {
    personalStrengths.push('Excellent value for your budget priorities');
  }
  if (answers.medicalRisk === 'none' && policy.features.coPayClauses.includes('No co-pay')) {
    personalStrengths.push('No co-pay combined with your healthy profile = minimal out-of-pocket risk');
  }
  if (answers.hospitalPreference !== 'premium_private' && policy.features.networkHospitals.includes('14,000+')) {
    personalStrengths.push('Wide hospital network matches your flexibility on hospital choice');
  }
  if (answers.priority === 'max_coverage' && policy.features.restoreBenefit.includes('100%')) {
    personalStrengths.push('100% restore benefit aligns with your maximum coverage priority');
  }

  // Calculate new overall score
  const weightKeys = Object.keys(DEFAULT_WEIGHTS) as (keyof typeof DEFAULT_WEIGHTS)[];
  const personalizedScore = Math.round(
    dimensionDeltas.reduce((sum, dd) => {
      const weight = DEFAULT_WEIGHTS[dd.name as keyof typeof DEFAULT_WEIGHTS] || 0.2;
      return sum + dd.adjusted * weight;
    }, 0)
  );

  // Generate personalized loopholes
  const personalizedLoopholes = policy.loopholes.map(l => {
    let isElevated = false;
    let customWarning = '';
    let currentSeverity = l.severity;

    const lowerTitle = l.title.toLowerCase();

    // Conflict 1: Room Rent Caps vs Premium Hospital Preference
    if ((lowerTitle.includes('room rent') || lowerTitle.includes('icu cap')) && answers.hospitalPreference === 'premium_private') {
      isElevated = true;
      currentSeverity = 'high';
      customWarning = 'HIGH RISK FOR YOU: You prefer premium hospitals, where room rents easily exceed this cap. This will cause proportional deductions on your entire bill.';
    }
    
    // Conflict 2: No Maternity vs Planned Procedures
    if (lowerTitle.includes('maternity') && answers.plannedProcedures === 'yes') {
      isElevated = true;
      currentSeverity = 'high';
      customWarning = 'CRITICAL GAP: You have planned medical procedures (which often includes maternity), but this policy offers zero maternity support.';
    }

    // Conflict 3: High Premium vs Budget Constraint
    if ((lowerTitle.includes('premium') || lowerTitle.includes('expensive')) && answers.budget === 'budget') {
      isElevated = true;
      currentSeverity = 'high';
      customWarning = 'BUDGET CONFLICT: You selected a budget focus, making this plan\'s higher pricing a significant long-term strain.';
    }

    // Conflict 4: High PED Waiting vs Existing Medical Risk
    if (lowerTitle.includes('ped') || lowerTitle.includes('waiting')) {
      if (answers.medicalRisk === 'major' || answers.medicalRisk === 'lifestyle') {
        isElevated = true;
        currentSeverity = 'high';
        customWarning = `MEDICAL RISK ALERt: You have a pre-existing medical risk. A long waiting period means you are fully exposed to these risks out-of-pocket for ${l.title.match(/\d+/) || 'several'} months.`;
      }
    }

    // Conflict 5: Co-Pays vs Out of Pocket Comfort
    if (lowerTitle.includes('co-pay') && answers.oopComfort === 'low') {
      isElevated = true;
      currentSeverity = 'high';
      customWarning = 'FINANCIAL RISK FOR YOU: You expressed low comfort with out-of-pocket costs, but a co-pay guarantees you will always pay a percentage of the bill.';
    }

    return {
      ...l,
      severity: isElevated ? currentSeverity : l.severity,
      isElevated,
      customWarning,
    };
  });

  return {
    originalScore: policy.overallScore,
    personalizedScore,
    delta: personalizedScore - policy.overallScore,
    dimensionDeltas,
    personalWarnings,
    personalStrengths,
    personalRecommendations,
    personalizedLoopholes,
  };
}
