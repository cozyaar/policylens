import { GoogleGenAI } from '@google/genai';
import type { Policy, PolicyFeatures, ScoreDimension, Loophole, ProfileFit, PairingOption } from '../data/policies';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const ANALYSIS_PROMPT = `You are PolicyLens — an expert Indian health insurance policy analyst. 

Given the name and details of an Indian health insurance policy, you must produce a COMPLETE structured analysis. You MUST research and use your knowledge of this specific policy to fill in accurate data.

IMPORTANT RULES:
- Use Google Search to find the official policy wording, brochures from the insurer, and trusted aggregators (PolicyBazaar, Ditto, etc.).
- NEVER hallucinate limits. If you cannot find the actual co-pay or sub-limit, explicitly write "Data unavailable" rather than making it up.
- Be factually accurate about the policy features based on the verified documents you find.
- Score deterministically: same policy = same score
- Use the Indian market context (₹, Indian insurers, IRDAI regulations)
- Return ONLY valid JSON, no markdown, no explanation

Return this exact JSON structure:
{
  "name": "Policy short name",
  "insurer": "Insurer company name",
  "insurerLogo": "single emoji representing the insurer",
  "planType": "Individual / Family Floater / etc",
  "category": "comprehensive | family | senior | youth | top-up | critical-illness",
  "overallScore": <0-100 weighted score>,
  "tagline": "one-line value proposition",
  "highlights": ["4-6 key selling points as strings"],
  "dimensions": [
    { "name": "Coverage Strength", "score": <0-100>, "explanation": "2-3 sentence justification" },
    { "name": "Claim Friendliness", "score": <0-100>, "explanation": "2-3 sentence justification" },
    { "name": "Hidden Restrictions", "score": <0-100>, "explanation": "2-3 sentence justification" },
    { "name": "Waiting Period Risk", "score": <0-100>, "explanation": "2-3 sentence justification" },
    { "name": "Value for Money", "score": <0-100>, "explanation": "2-3 sentence justification" }
  ],
  "features": {
    "roomRentLimit": "string",
    "icuCaps": "string",
    "diseaseSubLimits": "string",
    "waitingPeriods": "string",
    "coPayClauses": "string",
    "networkHospitals": "string",
    "opdCoverage": "string",
    "maternityCoverage": "string",
    "addOns": ["array of available add-ons"],
    "claimSettlement": "XX% settlement ratio",
    "sumInsuredRange": "₹XL – ₹XCr",
    "premiumRange": "₹X,000 – ₹XX,000/year",
    "renewalAge": "string",
    "preExistingWaiting": "string",
    "dayCareProcedures": "string",
    "ambulanceCover": "string",
    "restoreBenefit": "string"
  },
  "loopholes": [
    { "title": "short title", "severity": "high|medium|low", "impact": "2-3 sentence explanation", "whenItMatters": "1 sentence scenario" }
  ],
  "profileFit": {
    "bestFor": ["3-4 user profiles this suit"],
    "riskyFor": ["3-4 user profiles where this is risky"]
  },
  "alternatives": [],
  "pairings": [
    { "type": "Super Top-Up | OPD Plan | Critical Illness | etc", "reason": "why this pairing helps", "coverageImprovement": <10-50>, "description": "1-2 sentence explanation" }
  ]
}

SCORING WEIGHTS for overallScore calculation:
- Coverage Strength: 25%
- Claim Friendliness: 20%
- Hidden Restrictions: 20%
- Waiting Period Risk: 15%
- Value for Money: 20%

overallScore = round(Coverage*0.25 + Claims*0.20 + Restrictions*0.20 + Waiting*0.15 + Value*0.20)

Aim for 3-5 loopholes ranked by severity. Be honest and critical — this is a trust product.`;

export async function analyzePolicy(policyQuery: string): Promise<Policy> {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${ANALYSIS_PROMPT}\n\nAnalyze this Indian health insurance policy using Google Search to find accurate, up-to-date policy documents and brochures:\n"${policyQuery}"\n\nReturn EXACTLY and ONLY the JSON object. No markdown formatting around the JSON.`,
    config: {
      temperature: 0.1,
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || '';
  
  // Parse the JSON response securely (handling markdown fences or search citations)
  let parsed;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object found in response');
    parsed = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Failed to parse Gemini output:", text);
    throw new Error('AI returned an invalid data format.');
  }

  // Generate a slug from the name
  const slug = `${parsed.insurer}-${parsed.name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Validate and calculate the weighted score
  const dims = parsed.dimensions as ScoreDimension[];
  const calculatedScore = Math.round(
    (dims.find(d => d.name === 'Coverage Strength')?.score || 0) * 0.25 +
    (dims.find(d => d.name === 'Claim Friendliness')?.score || 0) * 0.20 +
    (dims.find(d => d.name === 'Hidden Restrictions')?.score || 0) * 0.20 +
    (dims.find(d => d.name === 'Waiting Period Risk')?.score || 0) * 0.15 +
    (dims.find(d => d.name === 'Value for Money')?.score || 0) * 0.20
  );

  const policy: Policy = {
    id: Date.now().toString(),
    slug,
    name: parsed.name,
    insurer: parsed.insurer,
    insurerLogo: parsed.insurerLogo || '🏥',
    planType: parsed.planType,
    category: parsed.category || 'comprehensive',
    overallScore: calculatedScore,
    tagline: parsed.tagline,
    highlights: parsed.highlights || [],
    dimensions: dims,
    features: parsed.features as PolicyFeatures,
    loopholes: parsed.loopholes as Loophole[],
    profileFit: parsed.profileFit as ProfileFit,
    alternatives: parsed.alternatives || [],
    pairings: parsed.pairings as PairingOption[],
  };

  return policy;
}
