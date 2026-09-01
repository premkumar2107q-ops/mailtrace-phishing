import { useEffect, useState } from 'react';
import type { AnalysisResult } from '@/data/samples';
import { ShieldAlert, ShieldCheck, Shield, ShieldX } from 'lucide-react';

interface ThreatScoreProps {
  result: AnalysisResult;
}

export function ThreatScore({ result }: ThreatScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1200;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * result.score));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [result.score]);

  const isCritical = result.score >= 75;
  const isHigh = result.score >= 50;
  const isMedium = result.score >= 25;

  const color = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : isMedium ? '#38a0ff' : '#10b981';
  const Icon = isCritical ? ShieldX : isHigh ? ShieldAlert : isMedium ? Shield : ShieldCheck;

  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="label-mono text-accent-400">Threat Assessment</div>
      </div>

      {/* Semi-circular gauge */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-64 h-36">
          <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1a2235"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold" style={{ color }}>
                {displayScore}
              </span>
              <span className="font-display text-xl text-ink-400 font-medium">/ 100</span>
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full mt-2"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="font-display font-bold text-sm tracking-wider" style={{ color }}>
            {result.verdict}
          </span>
        </div>
      </div>

      {/* Why this score */}
      <div className="border-t border-ink-600/30 pt-6">
        <div className="label-mono text-ink-400 mb-4">Why this score?</div>
        {result.evidence.length === 0 ? (
          <div className="glass rounded-lg p-4 text-center">
            <ShieldCheck className="w-8 h-8 text-success-glow mx-auto mb-2" />
            <p className="text-sm text-ink-100 font-medium">
              NO OBVIOUS PHISHING INDICATORS DETECTED.
            </p>
            <p className="text-xs text-ink-400 mt-2">
              Text-based analysis cannot guarantee authenticity. Always verify through independent channels.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {result.evidence.map((ev, i) => (
              <div
                key={ev.id}
                className="flex items-center justify-between animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ink-400 w-5">
                    {String(ev.number).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-ink-100">{ev.label}</span>
                </div>
                <span className="font-mono text-sm font-semibold" style={{ color }}>
                  +{ev.weight}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-ink-600/30">
              <span className="font-display font-bold text-sm text-white tracking-wider">TOTAL</span>
              <span className="font-display text-lg font-bold" style={{ color }}>
                {result.score}
              </span>
            </div>
          </div>
        )}
        <div className="mt-4 label-mono text-ink-400">Transparent Rule-Based Risk Model</div>
        <p className="mt-2 text-xs text-ink-300 leading-relaxed">
          Each indicator contributes to the final score. The system shows the evidence
          instead of hiding the reasoning behind a single verdict.
        </p>
      </div>
    </div>
  );
}
