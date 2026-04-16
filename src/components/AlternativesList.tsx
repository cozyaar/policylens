'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { Policy, ScoreDimension } from '@/data/policies';

function getScoreColor(s: number) {
  if (s >= 85) return 'text-green';
  if (s >= 75) return 'text-brand';
  return 'text-amber';
}

export default function AlternativesList({ basePolicyScore, basePolicyDimensions, alternativeSlugs }: { 
  basePolicyScore: number; 
  basePolicyDimensions: ScoreDimension[];
  alternativeSlugs: string[] 
}) {
  const [alts, setAlts] = useState<Policy[]>([]);

  useEffect(() => {
    if (!alternativeSlugs.length) return;
    fetch(`/api/policies/alternatives?slugs=${alternativeSlugs.join(',')}`)
      .then(res => res.json())
      .then(data => {
        const sorted = (data as Policy[]).sort((a, b) => b.overallScore - a.overallScore);
        setAlts(sorted);
      })
      .catch(console.error);
  }, [alternativeSlugs]);

  if (!alts.length) return null;

  return (
    <div className="space-y-4 fade-in">
      {alts.map(a => {
        const delta = a.overallScore - basePolicyScore;
        
        const advantages = a.dimensions.map(dim => {
           const baseDim = basePolicyDimensions.find(d => d.name === dim.name);
           return { name: dim.name, diff: dim.score - (baseDim?.score || 0) };
        }).filter(x => x.diff > 1).sort((x, y) => y.diff - x.diff);

        const topAdvantage = advantages[0];

        return (
          <div key={a.slug} className="card-base overflow-hidden flex flex-col group hover:border-brand/40 transition-colors">
            <Link href={`/policy/${a.slug}`} className="flex items-center justify-between p-5 border-b border-border/50">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-12 h-12 rounded-xl bg-bg-muted flex items-center justify-center shrink-0`}>
                  <span className={`text-lg font-black ${getScoreColor(a.overallScore)}`}>{a.overallScore}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-text mb-0.5 group-hover:text-brand transition-colors">{a.name}</h4>
                  <p className="t-caption text-text-muted">{a.insurer} · {a.planType}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                {delta > 0 && (
                  <span className="badge badge-green text-[11px] px-2 py-1"><TrendingUp className="h-3 w-3" />+{delta} OVERALL</span>
                )}
                <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
            
            <div className="px-5 py-3 bg-bg-muted/30">
               {topAdvantage ? (
                 <div className="flex items-start gap-2">
                   <CheckCircle2 className="h-3.5 w-3.5 text-green mt-0.5 shrink-0" />
                   <p className="t-caption text-text-secondary">
                     <strong className="text-text">Superior {topAdvantage.name}:</strong> 
                     {' '}{a.dimensions.find(d => d.name === topAdvantage.name)?.explanation.split('.')[0]}.
                   </p>
                 </div>
               ) : (
                 <div className="flex items-start gap-2">
                   <CheckCircle2 className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" />
                   <p className="t-caption text-text-secondary">Offers a more balanced structural coverage for a similar profile.</p>
                 </div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
