import { AlertTriangle, User } from 'lucide-react';
import { Loophole } from '@/data/policies';

type ExtendedLoophole = Loophole & {
  isElevated?: boolean;
  customWarning?: string;
};

export default function LoopholesList({ loopholes, isPersonalized }: { loopholes: ExtendedLoophole[], isPersonalized?: boolean }) {
  return (
    <div className="space-y-4 fade-in">
      {loopholes.map((l, i) => (
        <div key={i} className={`card-base overflow-hidden border-2 transition-all ${l.isElevated ? 'border-red shadow-sm' : 'border-transparent'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-5 py-3 border-b ${l.isElevated ? 'bg-red/5 border-red/10' : 'bg-bg-muted border-border'}`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${l.severity === 'high' ? 'text-red' : l.severity === 'medium' ? 'text-amber' : 'text-green'}`} />
              <span className={`t-micro ${l.isElevated ? 'text-red font-bold' : 'text-text-muted'}`}>
                {l.isElevated ? `Personalized Risk #${i + 1}` : `Loophole #${i + 1}`}
              </span>
            </div>
            <span className={`badge text-[11px] ${l.severity === 'high' ? 'severity-high' : l.severity === 'medium' ? 'severity-medium' : 'severity-low'}`}>
              {l.severity.toUpperCase()}
            </span>
          </div>
          {/* Content */}
          <div className="p-5 space-y-4">
            <h4 className="t-h3 text-text">{l.title}</h4>
            
            {/* Personalized Conflict Block */}
            {l.isElevated && l.customWarning && (
              <div className="bg-red/10 border border-red/20 rounded-lg p-3 flex items-start gap-3">
                <User className="h-5 w-5 text-red shrink-0 mt-0.5" />
                <div>
                  <span className="t-micro text-red font-bold block mb-1">WHY THIS MATTERS FOR YOU</span>
                  <p className="t-caption text-red-100 leading-relaxed font-medium">{l.customWarning}</p>
                </div>
              </div>
            )}

            <div>
              <span className="t-micro text-text-muted block mb-1">Standard Impact</span>
              <p className="t-body text-text-secondary leading-relaxed">{l.impact}</p>
            </div>
            {!l.isElevated && (
              <div className="inset-panel">
                <span className="t-micro text-text-muted block mb-1">When This Matters</span>
                <p className="t-caption text-text-secondary leading-relaxed">{l.whenItMatters}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
