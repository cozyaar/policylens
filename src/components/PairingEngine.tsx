import { Plus } from 'lucide-react';
import { PairingOption } from '@/data/policies';

export default function PairingEngine({ pairings }: { pairings: PairingOption[] }) {
  if (!pairings.length) return null;
  return (
    <div className="space-y-3 fade-in">
      {pairings.map((p, i) => (
        <div key={i} className="card-base p-4 flex items-start gap-4">
          <div className="h-9 w-9 rounded-lg bg-brand-bg flex items-center justify-center shrink-0 mt-0.5">
            <Plus className="h-4 w-4 text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-semibold text-text text-sm">Add {p.type}</h4>
              <span className="badge badge-green text-[11px] shrink-0">+{p.coverageImprovement}%</span>
            </div>
            <p className="t-caption text-green font-semibold mb-1">{p.reason}</p>
            <p className="t-caption text-text-secondary leading-relaxed">{p.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
