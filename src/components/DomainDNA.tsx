import { useEffect, useState } from 'react';
import type { DomainAnalysis } from '@/data/samples';
import { Dna } from 'lucide-react';

interface DomainDNAProps {
  analysis: DomainAnalysis | null;
}

function findSubstitutions(expected: string, observed: string) {
  const subs: { index: number; expectedChar: string; observedChar: string }[] = [];
  const minLen = Math.min(expected.length, observed.length);
  for (let i = 0; i < minLen; i++) {
    if (expected[i] !== observed[i]) {
      subs.push({ index: i, expectedChar: expected[i], observedChar: observed[i] });
    }
  }
  return subs;
}

export function DomainDNA({ analysis }: DomainDNAProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!analysis) {
    return (
      <div className="glass-strong rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Dna className="w-4 h-4 text-accent-400" />
          <div className="label-mono text-accent-400">Domain DNA</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="label-mono text-ink-400 mb-2">Observed Domain</div>
          <div className="font-mono text-lg text-ink-100 break-all">{analysis === null ? 'No sender domain detected' : ''}</div>
        </div>
      </div>
    );
  }

  const expected = analysis.expectedDomain ?? '';
  const observed = analysis.observedDomain;
  const isMatch = !analysis.isLookalike && expected === observed;
  const subs = analysis.isLookalike && expected
    ? findSubstitutions(expected, observed)
    : [];

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Dna className="w-4 h-4 text-accent-400" />
        <div className="label-mono text-accent-400">Domain DNA</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Expected */}
        <div>
          <div className="label-mono text-ink-400 mb-3">
            {analysis.isLookalike ? 'Expected' : 'Reference'}
          </div>
          <div className="glass rounded-lg p-4 font-mono text-lg break-all">
            {analysis.isLookalike && expected ? (
              expected.split('').map((ch, i) => {
                const isSub = subs.some((s) => s.index === i);
                return (
                  <span
                    key={i}
                    className={`inline-block transition-all duration-300 ${
                      revealed ? 'opacity-100' : 'opacity-0'
                    } ${isSub ? 'text-success-glow font-bold' : 'text-ink-100'}`}
                    style={{ transitionDelay: `${i * 40}ms` }}
                  >
                    {ch}
                  </span>
                );
              })
            ) : (
              <span className="text-ink-300">{observed}</span>
            )}
          </div>
        </div>

        {/* Observed */}
        <div>
          <div className="label-mono text-ink-400 mb-3">Observed</div>
          <div className="glass rounded-lg p-4 font-mono text-lg break-all">
            {observed.split('').map((ch, i) => {
              const sub = subs.find((s) => s.index === i);
              return (
                <span
                  key={i}
                  className={`inline-block transition-all duration-300 ${
                    revealed ? 'opacity-100' : 'opacity-0'
                  } ${sub ? 'text-danger-glow font-bold' : 'text-ink-100'}`}
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Substitution highlights */}
      {analysis.isLookalike && subs.length > 0 && (
        <div
          className="space-y-2 animate-fade-in-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          <div className="label-mono text-ink-400">Character Substitutions</div>
          {subs.map((sub, i) => (
            <div
              key={i}
              className="flex items-center gap-3 glass rounded-lg px-4 py-2.5 animate-fade-in-up"
              style={{ animationDelay: `${0.6 + i * 0.1}s`, animationFillMode: 'both' }}
            >
              <span className="font-mono text-success-glow font-bold text-lg">{sub.expectedChar}</span>
              <span className="text-ink-400">→</span>
              <span className="font-mono text-danger-glow font-bold text-lg">{sub.observedChar}</span>
              <span className="text-xs text-ink-300 ml-2">
                Position {sub.index + 1}: "{sub.expectedChar}" replaced with "{sub.observedChar}"
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-3 px-1">
            <span className="w-2 h-2 rounded-full bg-danger-glow" />
            <span className="font-display font-bold text-sm text-danger-glow tracking-wider">
              POSSIBLE BRAND IMPERSONATION
            </span>
          </div>
        </div>
      )}

      {!analysis.isLookalike && (
        <div className="flex items-center gap-2 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-success-glow" />
          <span className="font-display font-bold text-sm text-success-glow tracking-wider">
            NO KNOWN BRAND IMPERSONATION DETECTED
          </span>
        </div>
      )}
    </div>
  );
}
