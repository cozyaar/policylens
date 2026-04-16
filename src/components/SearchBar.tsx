'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, X, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Policy } from '@/data/policies';

function getScoreColor(s: number) {
  if (s >= 85) return 'text-green';
  if (s >= 75) return 'text-brand';
  return 'text-amber';
}

export default function SearchBar({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<Policy[]>([]);
  const [isIngesting, setIsIngesting] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/policies/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (active) setResults(data);
      } catch (e) {
        console.error(e);
      }
    };
    
    // Very simple debounce
    const timer = setTimeout(fetchResults, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelect = (slug: string) => {
    setQuery(''); setFocused(false);
    router.push(`/policy/${slug}`);
  };

  const handleIngest = async () => {
    if (!query) return;
    setIsIngesting(true);
    try {
      const res = await fetch('/api/policies/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.trace || data.error || 'Ingestion failed');
      handleSelect(data.slug);
    } catch (e: any) {
      console.error(e);
      alert(`AI Analysis failed: ${e.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  const isHero = variant === 'hero';

  return (
    <>
      {/* Search Mode Backdrop */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-bg/60 backdrop-blur-sm z-40"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className={`relative w-full max-w-lg mx-auto transition-all ${focused ? 'z-50' : 'z-20'}`} ref={ref}>
        <div className={`relative flex items-center bg-bg-surface border rounded-xl transition-all duration-200 ${
          focused
            ? 'border-brand shadow-lg ring-1 ring-brand/10'
            : 'border-border hover:border-border-hover shadow-sm'
        }`}>
          <Search className={`absolute left-3.5 h-[16px] w-[16px] transition-colors duration-150 ${focused ? 'text-brand' : 'text-text-muted'}`} />
          <input
            type="text" value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search any Indian health insurance policy..."
            className="w-full bg-transparent border-none pl-10 pr-10 py-3 text-[14px] text-text placeholder:text-text-muted focus:outline-none rounded-xl"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery('')}
                className="absolute right-2 p-1.5 rounded-lg hover:bg-bg-muted text-text-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-full left-0 right-0 mt-3 card-float overflow-hidden z-50 shadow-2xl border border-border"
            >
              <div className="px-3 py-2 border-b border-border bg-bg-muted rounded-t-xl">
                <p className="t-micro text-text-muted">
                  {query ? `${results.length} result${results.length !== 1 ? 's' : ''}` : `All ${results.length} Policies`}
                </p>
              </div>
              <ul className="max-h-[380px] overflow-y-auto search-results bg-bg-surface">
                {results.length > 0 ? results.map((policy) => (
                  <li key={policy.id}>
                    <button
                      onClick={() => handleSelect(policy.slug)}
                      className="w-full text-left px-4 py-3 hover:bg-bg-card-hover transition-colors flex items-center justify-between gap-3 border-b border-border-subtle last:border-0"
                    >
                      <div className="min-w-0">
                        <h4 className="font-semibold text-text text-sm">{policy.name}</h4>
                        <p className="t-caption text-text-muted">{policy.insurer} · {policy.planType}</p>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className={`text-sm font-bold ${getScoreColor(policy.overallScore)}`}>
                          {policy.overallScore}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                      </div>
                    </button>
                  </li>
                )) : query.length > 2 ? (
                  <li className="px-4 py-6 flex flex-col items-center justify-center text-center bg-bg-surface">
                    <div className="h-10 w-10 rounded-full bg-brand-bg flex items-center justify-center mb-3">
                      <Search className="h-5 w-5 text-brand" />
                    </div>
                    <p className="text-text font-medium mb-1">Policy not found in our database</p>
                    <p className="t-caption text-text-muted mb-4 max-w-[240px]">
                      Our AI can instantly research and analyze "{query}" for you.
                    </p>
                    <button 
                      onClick={handleIngest}
                      disabled={isIngesting}
                      className="btn-primary flex items-center gap-2 w-full justify-center max-w-[200px]"
                    >
                      {isIngesting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                      ) : (
                        <><Sparkles className="h-4 w-4" /> Analyze with AI</>
                      )}
                    </button>
                  </li>
                ) : (
                  <li className="px-4 py-8 text-center text-text-muted text-sm bg-bg-surface">
                    Type to search for an Indian health insurance policy...
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
