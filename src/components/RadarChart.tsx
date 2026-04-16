'use client';

import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ScoreDimension } from '@/data/policies';

const SHORT_LABELS: Record<string, string> = {
  'Coverage Strength': 'Coverage',
  'Claim Friendliness': 'Claims',
  'Hidden Restrictions': 'Restrictions',
  'Waiting Period Risk': 'Waiting',
  'Value for Money': 'Value',
};

interface Props {
  dimensions: ScoreDimension[];
  personalizedDimensions?: { name: string; adjusted: number }[];
}

export default function RadarChart({ dimensions, personalizedDimensions }: Props) {
  const data = dimensions.map(dim => {
    const p = personalizedDimensions?.find(d => d.name === dim.name);
    return {
      subject: SHORT_LABELS[dim.name] || dim.name,
      fullName: dim.name,
      baseScore: dim.score,
      explanation: dim.explanation,
      fullMark: 100,
      ...(p ? { personalizedScore: p.adjusted } : {}),
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div className="card-float p-3 max-w-[240px]">
          <p className="font-semibold text-text text-sm mb-1">{d.fullName}</p>
          <p className="t-caption text-text-secondary mb-1">Base: <span className="font-bold text-brand">{d.baseScore}</span></p>
          {d.personalizedScore !== undefined && (
            <p className="t-caption text-text-secondary">Yours: <span className="font-bold text-green">{d.personalizedScore}</span></p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[340px] bg-bg-surface rounded-2xl border border-border shadow-sm p-6 relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--border-hover)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text)', fontSize: 12, fontWeight: 700 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Radar name="Base" dataKey="baseScore" stroke="var(--brand-dark)" fill="var(--brand)" fillOpacity={0.15} strokeWidth={3} />
          {personalizedDimensions && (
             <Radar name="Personalized" dataKey="personalizedScore" stroke="var(--green)" fill="var(--green)" fillOpacity={0.15} strokeWidth={3} strokeDasharray="5 4" />
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
