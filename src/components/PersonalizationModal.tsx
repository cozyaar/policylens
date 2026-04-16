'use client';

import { useState } from 'react';
import { PersonalizationAnswers } from '@/data/scoring';
import { X, ChevronRight, ChevronLeft, SlidersHorizontal, Check } from 'lucide-react';

const QUESTIONS = [
  { id: 'ageGroup', title: 'Age Group', question: 'What is the age of the oldest person covered?', options: [
    { value: 'young', label: 'Under 35', desc: 'Generally low risk, lower premiums' },
    { value: 'adult', label: '36 to 55', desc: 'Moderate risk, looking for stable coverage' },
    { value: 'senior', label: 'Above 55', desc: 'Higher risk, senior citizen focused' },
  ]},
  { id: 'familyType', title: 'Family Status', question: 'Who all are you covering?', options: [
    { value: 'individual', label: 'Just Myself', desc: 'Individual policy' },
    { value: 'couple', label: 'Me and my Spouse', desc: 'Family floater for two' },
    { value: 'family', label: 'Family with kids', desc: 'Floater for entire family (kids+spouse)' },
  ]},
  { id: 'medicalRisk', title: 'Medical Risk', question: 'Do you have any existing medical conditions?', options: [
    { value: 'none', label: 'None', desc: 'Generally healthy' },
    { value: 'lifestyle', label: 'Lifestyle', desc: 'Diabetes, BP, Thyroid, etc.' },
    { value: 'major', label: 'Major', desc: 'Heart conditions, past surgeries, chronic' },
  ]},
  { id: 'plannedProcedures', title: 'Future Needs', question: 'Planning any major procedures in the next 2-3 years?', options: [
    { value: 'no', label: 'No', desc: 'Not expecting anything' },
    { value: 'maybe', label: 'Maybe', desc: 'Possible maternity or elective surgery' },
    { value: 'yes', label: 'Yes', desc: 'Definitely planning a procedure' },
  ]},
  { id: 'hospitalPreference', title: 'Hospital', question: 'What type of hospital do you prefer?', options: [
    { value: 'any', label: 'Any Network Hospital', desc: 'Standard private hospitals' },
    { value: 'network', label: 'Top Tier Network', desc: 'Good corporate hospitals' },
    { value: 'premium_private', label: 'Premium / Luxury', desc: 'Single private A/C rooms, premium hospitals' },
  ]},
  { id: 'oopComfort', title: 'Out-Of-Pocket', question: 'How comfortable paying a portion of the bill yourself?', options: [
    { value: 'low', label: 'Low', desc: 'Want everything covered, zero surprises' },
    { value: 'medium', label: 'Medium', desc: 'Okay with small co-pays' },
    { value: 'high', label: 'High', desc: 'Just want major risks covered' },
  ]},
  { id: 'budget', title: 'Budget', question: 'What is your comfortable annual premium level?', options: [
    { value: 'budget', label: 'Budget-focused', desc: 'Lowest viable cost' },
    { value: 'balanced', label: 'Balanced', desc: 'Willing to pay for value' },
    { value: 'premium', label: 'Premium', desc: 'Cost is secondary to quality' },
  ]},
  { id: 'priority', title: 'Priority', question: 'What is your main priority for this policy?', options: [
    { value: 'lowest_cost', label: 'Keep Costs Low', desc: 'Minimize premium outflow' },
    { value: 'smooth_claims', label: 'Smooth Claims', desc: 'Zero hassle during hospitalization' },
    { value: 'max_coverage', label: 'Maximum Coverage', desc: 'Highest possible coverage' },
  ]},
];

const STEP_LABELS = ['Age', 'Family', 'Medical', 'Future', 'Hospital', 'Out-of-Pocket', 'Budget', 'Priority', 'Review'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: PersonalizationAnswers) => void;
}

export default function PersonalizationModal({ isOpen, onClose, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PersonalizationAnswers>>({});

  if (!isOpen) return null;

  const isReview = step === QUESTIONS.length;
  const q = !isReview ? QUESTIONS[step] : null;
  const selected = q ? answers[q.id as keyof PersonalizationAnswers] : undefined;
  const allAnswered = QUESTIONS.every(q => answers[q.id as keyof PersonalizationAnswers]);

  const handleSelect = (val: string) => {
    setAnswers(prev => ({ ...prev, [q!.id]: val }));
  };

  const handleComplete = () => {
    onComplete({
      ageGroup: (answers.ageGroup as any) || 'young',
      familyType: (answers.familyType as any) || 'individual',
      medicalRisk: (answers.medicalRisk as any) || 'none',
      plannedProcedures: (answers.plannedProcedures as any) || 'no',
      hospitalPreference: (answers.hospitalPreference as any) || 'any',
      oopComfort: (answers.oopComfort as any) || 'medium',
      budget: (answers.budget as any) || 'balanced',
      priority: (answers.priority as any) || 'smooth_claims',
    });
    setStep(0);
    setAnswers({});
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="slide-panel">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="h-5 w-5 text-brand" />
            <div>
              <h3 className="t-h3 text-text">Personalize Analysis</h3>
              <p className="t-caption text-text-muted">No data stored beyond session</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-muted text-text-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-5 py-3 border-b border-border bg-bg-muted shrink-0 overflow-x-auto">
          <div className="flex gap-0.5 min-w-max">
            {STEP_LABELS.map((label, i) => (
              <button key={label} onClick={() => i <= step && setStep(i)}
                className={`px-2.5 py-1 t-caption rounded-md transition-colors whitespace-nowrap ${
                  i === step ? 'bg-brand text-white font-bold' :
                  i < step ? 'text-brand font-semibold cursor-pointer hover:bg-brand-bg' :
                  'text-text-muted'
                }`}>
                {i < step ? <Check className="h-3 w-3 inline mr-1" /> : null}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isReview && q ? (
            <>
              <div className="mb-1 t-micro text-brand">{q.title} <span className="text-text-muted">({step + 1}/{QUESTIONS.length})</span></div>
              <h2 className="t-h2 text-text mb-6">{q.question}</h2>
              <div className="space-y-3">
                {q.options.map(opt => (
                  <button key={opt.value} onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected === opt.value ? 'border-brand bg-brand-bg' : 'border-border hover:border-border-hover hover:bg-bg-card-hover'
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-text text-sm">{opt.label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === opt.value ? 'border-brand bg-brand' : 'border-text-muted'}`}>
                        {selected === opt.value && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    <p className="t-caption text-text-muted mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="t-h2 text-text mb-2">Review Your Profile</h2>
              <p className="t-body text-text-secondary mb-6">Confirm your answers before we recalculate the score.</p>
              <div className="space-y-2">
                {QUESTIONS.map((q, i) => {
                  const val = answers[q.id as keyof PersonalizationAnswers];
                  const opt = q.options.find(o => o.value === val);
                  return (
                    <button key={q.id} onClick={() => setStep(i)}
                      className="w-full text-left card-base p-3 flex items-center justify-between hover:bg-bg-card-hover transition-colors">
                      <div>
                        <span className="t-micro text-text-muted">{q.title}</span>
                        <p className="font-semibold text-text text-sm">{opt?.label || 'Not answered'}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-text-muted" />
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-bg-muted flex items-center justify-between shrink-0">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="btn-ghost flex items-center gap-1 disabled:opacity-30 text-sm">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {isReview ? (
            <button onClick={handleComplete} disabled={!allAnswered} className="btn-primary flex items-center gap-1 disabled:opacity-40">
              Analyze Profile <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => setStep(s => s + 1)} disabled={!selected}
              className="btn-primary flex items-center gap-1 disabled:opacity-40">
              {step === QUESTIONS.length - 1 ? 'Review' : 'Next'} <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
