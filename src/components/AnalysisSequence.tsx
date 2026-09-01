import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  'IDENTIFYING SENDER',
  'ANALYZING DOMAIN',
  'INSPECTING URL',
  'ANALYZING LANGUAGE',
  'CHECKING INDICATORS',
  'CALCULATING RISK',
];

interface AnalysisSequenceProps {
  onComplete: () => void;
}

export function AnalysisSequence({ onComplete }: AnalysisSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      const t = setTimeout(onComplete, 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCurrentStep((s) => s + 1), 550);
    return () => clearTimeout(t);
  }, [currentStep, onComplete]);

  return (
    <div className="glass-strong rounded-2xl p-8 overflow-hidden relative">
      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent animate-scan-line"
        />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-accent-400 animate-spin" />
          </div>
          <div>
            <div className="label-mono text-accent-400">Investigation in progress</div>
            <div className="font-display font-bold text-white text-sm">Running forensic analysis</div>
          </div>
        </div>

        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  i <= currentStep ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-success-glow" />
                  ) : active ? (
                    <Loader2 className="w-5 h-5 text-accent-400 animate-spin" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-ink-500" />
                  )}
                </div>
                <span className="font-mono text-xs tracking-wider">
                  <span className="text-ink-400">{String(i + 1).padStart(2, '0')} </span>
                  <span className={done ? 'text-ink-200' : active ? 'text-accent-300' : 'text-ink-400'}>
                    {step}
                  </span>
                </span>
                {active && (
                  <div className="flex-1 h-px bg-ink-600/30 overflow-hidden">
                    <div className="h-full w-full animate-shimmer" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
