import type { Evidence } from '@/data/samples';
import { Search, Info } from 'lucide-react';

interface EvidencePanelProps {
  evidence: Evidence | null;
}

const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  'look-alike-domain': { text: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/40' },
  'suspicious-url': { text: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/40' },
  'urgency-language': { text: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-500/40' },
  'suspicious-keywords': { text: 'text-yellow-300', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' },
  'sender-anomaly': { text: 'text-fuchsia-300', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/40' },
  'credential-request': { text: 'text-rose-300', bg: 'bg-rose-500/10', border: 'border-rose-500/40' },
  'attachment': { text: 'text-purple-300', bg: 'bg-purple-500/10', border: 'border-purple-500/40' },
  'legitimate': { text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' },
};

export function EvidencePanel({ evidence }: EvidencePanelProps) {
  if (!evidence) {
    return (
      <div className="glass-strong rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center min-h-[200px]">
        <div className="w-12 h-12 rounded-full bg-ink-700/40 flex items-center justify-center mb-3">
          <Search className="w-5 h-5 text-ink-400" />
        </div>
        <p className="text-sm text-ink-300 max-w-xs">
          Click on any highlighted evidence in the email to see the detailed investigation here.
        </p>
      </div>
    );
  }

  const colors = CATEGORY_COLORS[evidence.category] ?? CATEGORY_COLORS['suspicious-url'];

  return (
    <div className="glass-strong rounded-2xl p-6 h-full animate-slide-in-right">
      <div className="flex items-center gap-2 mb-4">
        <span className={`evidence-marker ${colors.bg} ${colors.text} ${colors.border}`}>
          {String(evidence.number).padStart(2, '0')}
        </span>
        <span className={`font-display font-bold text-sm tracking-wider ${colors.text}`}>
          {evidence.label}
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <div className="label-mono text-ink-400 mb-2">Matched Text</div>
          <div className={`glass rounded-lg p-3 font-mono text-sm break-all ${colors.text}`}>
            {evidence.matchedText}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5 text-accent-400" />
            <div className="label-mono text-accent-400">Why This Matters</div>
          </div>
          <p className="text-sm text-ink-100 leading-relaxed">{evidence.whyItMatters}</p>
        </div>

        <div>
          <div className="label-mono text-ink-400 mb-2">Analysis</div>
          <p className="text-sm text-ink-200 leading-relaxed">{evidence.explanation}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-ink-600/30">
          <span className="label-mono text-ink-400">Risk Contribution</span>
          <span className={`font-mono text-lg font-bold ${colors.text}`}>
            +{evidence.weight}
          </span>
        </div>
      </div>
    </div>
  );
}
