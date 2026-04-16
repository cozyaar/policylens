'use client';

import { ScoreDimension } from '@/data/policies';
import { useEffect, useState } from 'react';

interface Props {
  score: number;
  dimensions: ScoreDimension[];
  tagline: string;
}

const WEIGHTS: Record<string, number> = {
  'Coverage Strength': 25,
  'Claim Friendliness': 20,
  'Hidden Restrictions': 20,
  'Waiting Period Risk': 15,
  'Value for Money': 20,
};

function getScoreInfo(s: number) {
  if (s >= 85) return { text: 'text-green', fill: 'bg-green', label: 'Excellent', bg: 'bg-green-bg' };
  if (s >= 75) return { text: 'text-brand', fill: 'bg-brand', label: 'Good', bg: 'bg-brand-bg' };
  if (s >= 65) return { text: 'text-amber', fill: 'bg-amber', label: 'Average', bg: 'bg-amber-bg' };
  return { text: 'text-red', fill: 'bg-red', label: 'Below Avg', bg: 'bg-red-bg' };
}

export default function PolicyScoreCard({ score, dimensions, tagline }: Props) {
  const [animScore, setAnimScore] = useState(0);
  const sc = getScoreInfo(score);

  useEffect(() => {
    let cur = 0;
    const steps = 40;
    const t = setInterval(() => {
      cur++;
      setAnimScore(Math.round((score / steps) * cur));
      if (cur >= steps) { clearInterval(t); setAnimScore(score); }
    }, 25);
    return () => clearInterval(t);
  }, [score]);

  return (
    <div className="card-base overflow-hidden fade-in">
      {/* Score header */}
      <div className="flex items-center gap-5 p-5 border-b border-border">
        <div className={`w-20 h-20 rounded-xl ${sc.bg} flex flex-col items-center justify-center shrink-0`}>
          <span className={`text-3xl font-black ${sc.text} leading-none`}>{animScore}</span>
          <span className="t-micro text-text-muted mt-0.5" style={{ fontSize: '9px' }}>/100</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`badge text-[11px] ${score >= 85 ? 'badge-green' : score >= 75 ? 'badge-brand' : score >= 65 ? 'badge-amber' : 'badge-red'}`}>
              {sc.label}
            </span>
          </div>
          <p className="t-body text-text-secondary leading-relaxed">{tagline}</p>
        </div>
      </div>

      {/* Dimension breakdown */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="t-micro text-text-muted">Score Breakdown</span>
          <span className="t-micro text-text-muted">Weight</span>
        </div>
        {dimensions.map((dim, i) => {
          const dimSc = getScoreInfo(dim.score);
          const weight = WEIGHTS[dim.name] || 20;
          return (
            <div key={dim.name} className="group">
              <div className="flex items-center gap-3">
                <span className="w-[140px] shrink-0 t-caption font-semibold text-text-secondary truncate">{dim.name}</span>
                <div className="flex-1 progress-bar">
                  <div className={`progress-bar-fill ${dimSc.fill}`}
                    style={{ width: `${dim.score}%`, transitionDelay: `${i * 60}ms` }} />
                </div>
                <span className={`w-7 text-right t-caption font-bold ${dimSc.text}`}>{dim.score}</span>
                <span className="w-8 text-right t-caption text-text-muted">{weight}%</span>
              </div>
              {/* Explanation always visible below */}
              <div className="mt-1.5 mb-3 ml-[152px]">
                <p className="t-caption text-text-muted leading-relaxed">{dim.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
