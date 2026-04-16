'use client';

import { ShieldAlert, Scale, SlidersHorizontal, ArrowRight, Search, ShieldCheck, BarChart3, FileSearch } from 'lucide-react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import { FullPageStoryAnimation, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollAnimation';
import type { Policy } from '@/data/policies';

function getScoreColor(s: number) {
  if (s >= 85) return 'text-green';
  if (s >= 75) return 'text-brand';
  if (s >= 65) return 'text-amber';
  return 'text-red';
}

function getDimFill(s: number) {
  if (s >= 85) return 'bg-green';
  if (s >= 75) return 'bg-brand';
  if (s >= 65) return 'bg-amber';
  return 'bg-red';
}

export default function HomePageClient({ policies }: { policies: Policy[] }) {
  const insurers = [...new Set(policies.map(p => p.insurer))];
  const sorted = [...policies].sort((a, b) => b.overallScore - a.overallScore);

  return (
    <>
      <Navbar />
      <main className="flex-1 relative z-10">
        <FullPageStoryAnimation />
        
        {/* ── HERO ── */}
        <section className="relative min-h-[85vh] flex items-center justify-center">
          <div className="relative z-10 px-4 sm:px-6 pt-12 pb-24 max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-surface border border-border-subtle text-brand-text t-caption font-semibold mb-6 shadow-sm">
                <Scale className="h-3.5 w-3.5" /> Independent · Deterministic · No Insurance Sold
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="t-display text-text mb-5">
                Insurance,<br />
                <span className="text-brand">rated honestly.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="t-body-lg text-text-secondary max-w-lg mx-auto mb-10 leading-relaxed">
                We structurally analyze Indian health insurance policies — exposing loopholes,
                scoring transparently across 5 dimensions, and personalizing for your exact profile.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <SearchBar variant="hero" />
              <p className="t-caption text-text-muted mt-4">
                {policies.length} policies · {insurers.length} insurers · Updated for 2025-26
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── HOW IT WORKS (Story steps) ── */}
        <section id="how-it-works" className="px-4 sm:px-6 py-20 max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="t-micro text-brand mb-2 block">How PolicyLens Works</span>
              <h2 className="t-h1 text-text">From policy document to<br />
                <span className="text-brand">personal decision.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-10 relative">
            {/* Vertical connector line */}
            <div className="absolute left-4 top-6 bottom-6 w-px bg-border hidden md:block" />

            {[
              {
                step: '1',
                icon: FileSearch,
                color: 'text-amber',
                bg: 'bg-amber-bg',
                borderColor: 'border-amber',
                title: 'We read the fine print',
                desc: 'Every policy document is structurally analyzed — room rent limits, co-pay clauses, disease sub-limits, waiting periods, and hidden exclusions that agents won\'t mention.',
              },
              {
                step: '2',
                icon: BarChart3,
                color: 'text-brand',
                bg: 'bg-brand-bg',
                borderColor: 'border-brand',
                title: 'Deterministic scoring',
                desc: 'Each policy is rated 0–100 across 5 weighted dimensions: Coverage Strength (25%), Claim Friendliness (20%), Hidden Restrictions (20%), Waiting Period Risk (15%), and Value for Money (20%). Same policy → same score. Always.',
              },
              {
                step: '3',
                icon: SlidersHorizontal,
                color: 'text-green',
                bg: 'bg-green-bg',
                borderColor: 'border-green',
                title: 'Personalized to you',
                desc: 'Answer 6 questions about your medical history, budget, and hospital preference. We recalculate every dimension for your specific risk profile — no guessing, no AI randomness.',
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className={`card-base p-6 md:ml-12 border-l-4 ${item.borderColor}`}>
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <span className="t-micro text-text-muted mb-1 block">Step {item.step}</span>
                      <h3 className="t-h2 text-text mb-2">{item.title}</h3>
                      <p className="t-body text-text-secondary leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <ScrollReveal>
          <section className="px-4 sm:px-6 pb-16 max-w-4xl mx-auto">
            <div className="card-base p-6 flex flex-col md:flex-row items-center justify-around gap-6 text-center">
              {[
                { value: `${policies.length}`, label: 'Policies Analyzed' },
                { value: `${insurers.length}`, label: 'Indian Insurers' },
                { value: '5', label: 'Scoring Dimensions' },
                { value: '0%', label: 'AI in Scoring' },
              ].map((stat, i) => (
                <div key={i}>
                  <span className="text-2xl font-black text-brand">{stat.value}</span>
                  <p className="t-caption text-text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ── TOP POLICIES ── */}
        <section id="top-policies" className="px-4 sm:px-6 pb-20 max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="t-micro text-brand mb-1 block">Policy Database</span>
                <h2 className="t-h1 text-text">Top Rated Policies</h2>
                <p className="t-caption text-text-secondary mt-1">Our highest-scoring plans from Indian insurers, analyzed independently</p>
              </div>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.slice(0, 6).map(p => {
              return (
                <StaggerItem key={p.id}>
                  <Link href={`/policy/${p.slug}`} className="block h-full">
                    <div className="card h-full flex flex-col group">
                      {/* Score header */}
                      <div className="flex items-center justify-between p-4 pb-0">
                        <div className="w-12 h-12 rounded-xl bg-bg-muted flex items-center justify-center">
                          <span className={`text-xl font-black ${getScoreColor(p.overallScore)}`}>{p.overallScore}</span>
                        </div>
                        <span className="t-micro text-text-muted">{p.insurer}</span>
                      </div>

                      {/* Name */}
                      <div className="px-4 pt-3 pb-2">
                        <h3 className="t-h3 text-text group-hover:text-brand transition-colors">{p.name}</h3>
                        <p className="t-caption text-text-muted mt-0.5">{p.planType}</p>
                      </div>

                      {/* Feature chips */}
                      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                        {p.features.roomRentLimit.includes('No limit') && <span className="badge badge-green">No Room Cap</span>}
                        {p.features.coPayClauses.includes('No co-pay') && <span className="badge badge-green">No Co-pay</span>}
                        {p.features.preExistingWaiting.includes('48') && <span className="badge badge-red">48mo PED</span>}
                        {p.features.preExistingWaiting.includes('12') && <span className="badge badge-green">12mo PED</span>}
                        <span className="badge badge-muted">{p.features.sumInsuredRange}</span>
                      </div>

                      {/* Mini dimensions / SWOT Breakdown */}
                      <div className="mx-4 mb-4 p-4 bg-bg-surface border border-border shadow-sm rounded-xl space-y-2.5 relative z-10">
                        {p.dimensions.slice().sort((a, b) => b.score - a.score).map(d => (
                          <div key={d.name} className="flex items-center gap-2">
                            <span className="w-[72px] truncate text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                              {d.name.replace('Coverage Strength', 'COVERAGE').replace('Claim Friendliness', 'CLAIMS').replace('Hidden Restrictions', 'RULES').replace('Waiting Period Risk', 'WAITING').replace('Value for Money', 'VALUE')}
                            </span>
                            <div className="flex-1 h-1.5 rounded-full bg-border-subtle overflow-hidden relative">
                              <div className={`absolute top-0 left-0 h-full rounded-full ${getDimFill(d.score)}`} style={{ width: `${d.score}%` }} />
                            </div>
                            <span className="text-[11px] font-black text-text w-5 text-right">{d.score}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="mt-auto px-4 py-3 border-t border-border flex items-center justify-between t-caption font-semibold text-brand">
                        View Analysis
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
