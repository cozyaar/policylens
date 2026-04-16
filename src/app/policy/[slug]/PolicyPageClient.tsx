'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import type { Policy, Loophole } from '@/data/policies';
import type { PersonalizationAnswers, PersonalizedScore } from '@/data/scoring';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PolicyScoreCard from '@/components/PolicyScoreCard';
import RadarChart from '@/components/RadarChart';
import ProfileFit from '@/components/ProfileFit';
import LoopholesList from '@/components/LoopholesList';
import AlternativesList from '@/components/AlternativesList';
import PersonalizationModal from '@/components/PersonalizationModal';
import PersonalizedResults from '@/components/PersonalizedResults';
import PairingEngine from '@/components/PairingEngine';
import ChatbotWidget from '@/components/ChatbotWidget';

import { ArrowLeft, SlidersHorizontal, RefreshCw, ShieldAlert, GitCompare, Layers, BarChart3, FileText, ExternalLink, Download } from 'lucide-react';
import Link from 'next/link';

type Tab = 'dimensions' | 'features' | 'loopholes' | 'alternatives';

const tabVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export default function PolicyPageClient({ policy }: { policy: Policy }) {
  const [client, setClient] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [personalized, setPersonalized] = useState<PersonalizedScore | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dimensions');

  useEffect(() => { setClient(true); }, []);

  if (!policy) return null;

  const handleDone = async (answers: PersonalizationAnswers) => {
    try {
      const res = await fetch('/api/policies/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: policy.slug, answers }),
      });
      if (!res.ok) throw new Error('Personalization failed');
      const r: PersonalizedScore = await res.json();
      setPersonalized(r);
      setTimeout(() => document.getElementById('personalized')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      console.error('Personalization error:', err);
    }
  };

  const featureRows = [
    ['Sum Insured', policy.features.sumInsuredRange],
    ['Room Rent', policy.features.roomRentLimit],
    ['Co-Pay', policy.features.coPayClauses],
    ['PED Waiting', policy.features.preExistingWaiting],
    ['Network Hospitals', policy.features.networkHospitals],
    ['Restore Benefit', policy.features.restoreBenefit],
    ['Day-Care', policy.features.dayCareProcedures],
    ['Claim Settlement', policy.features.claimSettlement],
    ['OPD', policy.features.opdCoverage],
    ['Maternity', policy.features.maternityCoverage],
    ['Ambulance', policy.features.ambulanceCover],
    ['Premium Range', policy.features.premiumRange],
    ['Renewal', policy.features.renewalAge],
  ];

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: 'dimensions', label: 'Dimensions', icon: BarChart3 },
    { id: 'features', label: 'Features', icon: FileText, count: featureRows.length },
    { id: 'loopholes', label: 'Loopholes', icon: ShieldAlert, count: policy.loopholes.length },
    { id: 'alternatives', label: 'Alternatives', icon: GitCompare, count: policy.alternatives.length },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-16">
        <div className="px-4 sm:px-6 max-w-5xl mx-auto pt-6">

          {/* ── ZONE 1: SUMMARY ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-6"
          >
            <Link href="/" className="inline-flex items-center gap-1.5 t-caption font-medium text-text-secondary hover:text-text mb-4 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> All Policies
            </Link>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <span className="t-micro text-text-muted block mb-2">{policy.insurer} · {policy.planType}</span>
                <h1 className="t-h1 text-text">{policy.name}</h1>
              </div>
              {client && !personalized && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setModalOpen(true)}
                  className="btn-primary flex items-center gap-2 shrink-0 mt-1"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Personalize
                </motion.button>
              )}
              {client && personalized && (
                <button onClick={() => { setPersonalized(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="btn-outline flex items-center gap-2 shrink-0 mt-1">
                  <RefreshCw className="h-3.5 w-3.5" /> Reset
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-5 border-b border-border pb-5">
               <a 
                 href={`https://www.google.com/search?q=${encodeURIComponent(policy.insurer + ' ' + policy.name + ' official policy wording pdf')}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand/80 transition-colors bg-brand/10 px-3 py-1.5 rounded-md"
               >
                 <Download className="h-4 w-4" /> Download Official Policy Wording & Brochure
               </a>
            </div>

            {/* Highlight chips */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {policy.highlights.map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  className="badge badge-brand"
                >✓ {h}</motion.span>
              ))}
            </div>

            <PolicyScoreCard
              score={personalized ? personalized.personalizedScore : policy.overallScore}
              dimensions={policy.dimensions}
              tagline={policy.tagline}
            />
          </motion.div>

          {/* ── Personalized Results ── */}
          <AnimatePresence>
            {personalized && (
              <motion.section
                id="personalized"
                className="scroll-mt-20 mb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="t-h2 text-text flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="h-5 w-5 text-green" /> Your Personal Analysis
                </h2>
                <PersonalizedResults results={personalized} />
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── ZONE 2: TABS ── */}
          <div className="mb-8">
            <div className="tab-bar mb-6 overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab.id}
                  className={`tab-item flex items-center gap-1.5 whitespace-nowrap ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}>
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-bg-muted text-text-muted font-bold">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {activeTab === 'dimensions' && (
                  <div className="grid lg:grid-cols-2 gap-5">
                    <div className="card-base p-5 flex flex-col justify-center">
                      <h3 className="t-micro text-text-muted text-center mb-2">Structural Balance</h3>
                      <RadarChart dimensions={policy.dimensions} personalizedDimensions={personalized?.dimensionDeltas} />
                      {personalized && (
                        <div className="text-center mt-2 flex items-center justify-center gap-3">
                          <span className="flex items-center gap-1.5 t-caption text-text-muted">
                            <span className="inline-block w-3 h-0.5 bg-brand rounded" /> Base
                          </span>
                          <span className="flex items-center gap-1.5 t-caption text-text-muted">
                            <span className="inline-block w-3 h-0.5 bg-green rounded border-dashed" /> Personalized
                          </span>
                        </div>
                      )}
                    </div>
                    <ProfileFit profile={policy.profileFit} />
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="card-base overflow-hidden">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Feature</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {featureRows.map(([label, val], i) => (
                          <tr key={i}>
                            <td className="t-caption font-semibold text-text-secondary whitespace-nowrap">{label}</td>
                            <td>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'loopholes' && (
                  <div className="space-y-8">
                    <LoopholesList loopholes={(personalized?.personalizedLoopholes as Loophole[]) || policy.loopholes} isPersonalized={!!personalized} />
                    {policy.pairings.length > 0 && (
                      <div>
                        <h3 className="t-h2 text-text flex items-center gap-2 mb-4">
                          <Layers className="h-5 w-5 text-brand" /> Fix the Gaps
                        </h3>
                        <PairingEngine pairings={policy.pairings} />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'alternatives' && (
                  <div>
                    <p className="t-body text-text-secondary mb-4">Policies with better or equivalent coverage based on our model.</p>
                    {policy.alternatives && policy.alternatives.length > 0 ? (
                      <AlternativesList
                        basePolicyScore={personalized ? personalized.personalizedScore : policy.overallScore}
                        basePolicyDimensions={personalized ? personalized.dimensionDeltas.map(d => ({ name: d.name, score: d.adjusted, explanation: d.reason })) : policy.dimensions}
                        alternativeSlugs={policy.alternatives}
                      />
                    ) : (
                      <div className="card-base p-8 text-center text-text-muted flex flex-col items-center">
                        <GitCompare className="h-10 w-10 mb-3 opacity-30" />
                        <p className="t-body">No strictly superior alternatives found in our current database.</p>
                        <p className="t-caption mt-1">This policy already scores highly among its peers.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </main>
      <Footer />
      {client && <PersonalizationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onComplete={handleDone} />}
      <ChatbotWidget currentPolicy={policy} personalized={personalized} />
    </>
  );
}
