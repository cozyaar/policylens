import { CheckCircle2, XCircle } from 'lucide-react';
import { ProfileFit as ProfileFitType } from '@/data/policies';

export default function ProfileFit({ profile }: { profile: ProfileFitType }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 fade-in">
      <div className="card-base p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-green-bg flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-green" />
          </div>
          <h3 className="t-h3 text-text">Best Suited For</h3>
        </div>
        <ul className="space-y-2.5">
          {profile.bestFor.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 t-body text-text-secondary">
              <span className="text-green text-[10px] mt-1.5">●</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-base p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-red-bg flex items-center justify-center">
            <XCircle className="h-4 w-4 text-red" />
          </div>
          <h3 className="t-h3 text-text">Risky For</h3>
        </div>
        <ul className="space-y-2.5">
          {profile.riskyFor.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 t-body text-text-secondary">
              <span className="text-red text-[10px] mt-1.5">●</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
