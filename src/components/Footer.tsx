import { Shield, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-card mt-auto relative z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="elevation-0 p-4 mb-8 border border-amber/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber shrink-0 mt-0.5" />
            <p className="t-caption text-amber-text leading-relaxed">
              <strong>Disclaimer:</strong> PolicyLens is informational only. Scores are based on publicly available policy documents and our proprietary model. Always verify with official policy wording before making decisions. We are not affiliated with any insurance company.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-brand" strokeWidth={2.5} />
              <span className="font-bold text-text text-sm">Policy<span className="text-brand">Lens</span></span>
            </div>
            <p className="t-caption text-text-secondary">Insurance, rated honestly.</p>
          </div>
          <div>
            <h4 className="t-micro text-text-muted mb-3">Our Model</h4>
            <ul className="space-y-1.5 t-caption text-text-secondary">
              <li>Deterministic scoring</li>
              <li>5 weighted dimensions</li>
              <li>Based on official documents</li>
            </ul>
          </div>
          <div>
            <h4 className="t-micro text-text-muted mb-3">Trust</h4>
            <ul className="space-y-1.5 t-caption text-text-secondary">
              <li>We never sell insurance</li>
              <li>No data stored</li>
              <li>Independent of all insurers</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-5 text-center t-caption text-text-muted">
          © {new Date().getFullYear()} PolicyLens. All analysis is for informational purposes only.
        </div>
      </div>
    </footer>
  );
}
