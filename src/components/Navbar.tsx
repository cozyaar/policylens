'use client';

import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-border-subtle" style={{ background: 'rgba(244,244,239,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand" strokeWidth={2.5} />
            <span className="text-[15px] font-bold tracking-tight text-text">
              Policy<span className="text-brand">Lens</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            <Link href="/" className="btn-ghost">Home</Link>
            <Link href="/#how-it-works" className="btn-ghost">How It Works</Link>
            <Link href="/#all-policies" className="btn-ghost">All Policies</Link>
          </div>

          <button className="md:hidden p-2 text-text-secondary rounded-lg hover:bg-bg-muted transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border overflow-hidden"
            style={{ background: 'rgba(244,244,239,0.95)' }}
          >
            <div className="px-4 py-2 space-y-1">
              <Link href="/" className="block py-2 px-3 text-sm font-medium text-text-secondary rounded-lg hover:bg-bg-muted" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/#how-it-works" className="block py-2 px-3 text-sm font-medium text-text-secondary rounded-lg hover:bg-bg-muted" onClick={() => setMobileOpen(false)}>How It Works</Link>
              <Link href="/#all-policies" className="block py-2 px-3 text-sm font-medium text-text-secondary rounded-lg hover:bg-bg-muted" onClick={() => setMobileOpen(false)}>All Policies</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
