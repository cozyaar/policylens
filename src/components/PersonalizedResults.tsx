import { PersonalizedScore } from '@/data/scoring';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PersonalizedResults({ results }: { results: PersonalizedScore }) {
  const better = results.delta >= 0;
  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className={`card-base p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 ${better ? 'border-l-green' : 'border-l-red'}`}>
        <div>
          <h3 className="t-h3 text-text mb-1">Your Personalized Score</h3>
          <p className="t-caption text-text-secondary">Recalculated based on your medical risk, budget, and hospital preferences.</p>
        </div>
        <div className="flex items-center gap-5 shrink-0">
          <div className="text-right">
            <p className="t-micro text-text-muted mb-0.5">Base</p>
            <p className="text-xl font-bold text-text-muted">{results.originalScore}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-right">
            <p className="t-micro text-green mb-0.5">Your Score</p>
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-black ${better ? 'text-green' : 'text-red'}`}>{results.personalizedScore}</span>
              <span className={`badge text-[11px] ${better ? 'badge-green' : 'badge-red'}`}>
                {better ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(results.delta)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings + Strengths */}
      <div className="grid md:grid-cols-2 gap-4">
        {results.personalWarnings.length > 0 && (
          <div className="card-base p-5">
            <h4 className="flex items-center gap-2 mb-3 t-caption font-bold text-red">
              <AlertTriangle className="h-4 w-4" /> WARNINGS
            </h4>
            <ul className="space-y-2">
              {results.personalWarnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 t-caption text-text-secondary">
                  <span className="text-red text-[10px] mt-1">●</span>{w}
                </li>
              ))}
            </ul>
          </div>
        )}
        {results.personalStrengths.length > 0 && (
          <div className="card-base p-5">
            <h4 className="flex items-center gap-2 mb-3 t-caption font-bold text-green">
              <CheckCircle2 className="h-4 w-4" /> ALIGNMENTS
            </h4>
            <ul className="space-y-2">
              {results.personalStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 t-caption text-text-secondary">
                  <span className="text-green text-[10px] mt-1">●</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {results.personalRecommendations && results.personalRecommendations.length > 0 && (
        <div className="card-base p-5 border-l-4 border-l-brand relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 bg-brand/10 rounded-full blur-2xl" />
          <h4 className="flex items-center gap-2 mb-4 t-body font-bold text-brand">
            <TrendingUp className="h-5 w-5" /> STRATEGIC RECOMMENDATIONS
          </h4>
          <ul className="space-y-3">
            {results.personalRecommendations.map((rec, i) => (
              <li key={i} className="flex flex-col sm:flex-row sm:items-start gap-2 t-caption text-text-secondary leading-relaxed bg-bg-muted/50 p-3 rounded-lg">
                <span className="font-bold text-brand shrink-0 sm:w-24">{rec.split(':')[0]}:</span>
                <span>{rec.split(':')[1] || rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dimension deltas */}
      {results.dimensionDeltas.filter(d => d.delta !== 0).length > 0 && (
        <div>
          <h4 className="t-micro text-text-muted mb-3 border-b border-border pb-2">Why Your Score Changed (Weighted Math)</h4>
          <div className="space-y-3">
            {results.dimensionDeltas.filter(d => d.delta !== 0).map((d, i) => {
              const weight = {
                'Coverage Strength': 25,
                'Claim Friendliness': 20,
                'Hidden Restrictions': 20,
                'Waiting Period Risk': 15,
                'Value for Money': 20,
              }[d.name] || 20;
              const finalImpact = d.delta * (weight / 100);

              return (
                <div key={i} className="card-base p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text text-sm">{d.name}</span>
                      <span className="t-micro text-text-muted bg-bg-muted px-2 py-0.5 rounded">Weight: {weight}%</span>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden sm:block">
                        <span className="t-micro text-text-muted block mb-0.5">Raw Change</span>
                        <span className={`badge text-[11px] ${d.delta > 0 ? 'badge-green' : 'badge-red'}`}>
                          {d.delta > 0 ? '+' : ''}{d.delta}
                        </span>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-border" />
                      <div>
                        <span className="t-micro text-text-secondary font-bold block mb-0.5">Final Impact</span>
                        <span className={`text-[15px] font-black ${finalImpact > 0 ? 'text-green' : 'text-red'}`}>
                          {finalImpact > 0 ? '+' : ''}{finalImpact.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="t-caption text-text-muted leading-relaxed mt-1">{d.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
