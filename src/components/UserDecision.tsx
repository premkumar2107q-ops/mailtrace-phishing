import { useState } from 'react';
import type { AnalysisResult } from '@/data/samples';
import { Flag, CheckCircle2, ShieldQuestion, EyeOff, ArrowRight } from 'lucide-react';

interface UserDecisionProps {
  result: AnalysisResult;
  onGenerateReport: () => void;
}

export function UserDecision({ result, onGenerateReport }: UserDecisionProps) {
  const [decision, setDecision] = useState<string | null>(null);

  const isHighRisk = result.score >= 50;

  const primary = {
    label: 'REPORT EMAIL',
    icon: Flag,
    action: 'report',
    dominant: true,
  };

  const secondary = [
    { label: 'VERIFY SENDER', icon: ShieldQuestion, action: 'verify' },
    { label: 'IGNORE', icon: EyeOff, action: 'ignore' },
    { label: 'PROCEED ANYWAY', icon: ArrowRight, action: 'proceed' },
  ];

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8">
      <div className="label-mono text-accent-400 mb-6">What Should You Do?</div>

      {!decision ? (
        <div className="space-y-4">
          <div className="glass rounded-lg p-4 mb-4">
            <div className="label-mono text-ink-400 mb-1">Recommended Action</div>
            <p className="text-sm text-ink-100">{result.recommendedAction}</p>
          </div>

          <button
            onClick={() => setDecision('report')}
            className="btn-primary w-full justify-center text-base group"
          >
            <Flag className="w-4 h-4" />
            Report Email
          </button>

          <div className="grid grid-cols-3 gap-3">
            {secondary.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.action}
                  onClick={() => setDecision(opt.action)}
                  className="btn-ghost justify-center text-xs"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 animate-scale-in">
          {decision === 'report' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success-glow" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">THREAT INTERRUPTED</h3>
              <p className="text-sm text-ink-300 max-w-sm mx-auto mb-6">
                Recommended action: report the message to your security team.
              </p>
              <button onClick={onGenerateReport} className="btn-primary text-base group">
                Generate Incident Report
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </>
          ) : (
            <div className="py-4">
              <div className="w-16 h-16 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-4">
                <ShieldQuestion className="w-8 h-8 text-warning" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                {decision === 'verify' && 'VERIFY THROUGH INDEPENDENT CHANNEL'}
                {decision === 'ignore' && 'EMAIL IGNORED'}
                {decision === 'proceed' && 'CAUTION: RISK NOT MITIGATED'}
              </h3>
              <p className="text-sm text-ink-300 max-w-sm mx-auto mb-6">
                {decision === 'verify' && 'Contact the organization directly using a known, trusted method. Do not use any links from this email.'}
                {decision === 'ignore' && 'The email has been dismissed. If this was a phishing attempt, reporting it would help protect others.'}
                {decision === 'proceed' && 'You chose to proceed despite the risk. Be aware that clicking links in suspicious emails can compromise your account.'}
              </p>
              <button onClick={() => setDecision(null)} className="btn-ghost text-xs">
                Back to Options
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
