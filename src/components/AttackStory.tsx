import { useEffect, useState } from 'react';
import { Play, ChevronDown, AlertTriangle } from 'lucide-react';

interface AttackStoryProps {
  onGenerateReport: () => void;
}

const STEPS = [
  {
    title: 'SUSPICIOUS EMAIL',
    desc: 'The victim receives an email that appears to be from a trusted brand, using urgency to prompt immediate action.',
    icon: '📧',
  },
  {
    title: 'FAKE LOGIN PAGE',
    desc: 'The link leads to a website that closely mimics the real login page, designed to capture credentials.',
    icon: '🌐',
  },
  {
    title: 'CREDENTIAL REQUEST',
    desc: 'The victim is asked to enter their username and password, believing they are verifying their account.',
    icon: '🔑',
  },
  {
    title: 'POTENTIAL CREDENTIAL THEFT',
    desc: 'The entered credentials are transmitted to the attacker instead of the legitimate service.',
    icon: '⚠️',
  },
  {
    title: 'ACCOUNT COMPROMISE RISK',
    desc: 'The attacker can now access the victim\'s account, potentially leading to data theft or financial loss.',
    icon: '🔓',
  },
];

export function AttackStory({ onGenerateReport }: AttackStoryProps) {
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (!active) return;
    if (currentStep >= STEPS.length) return;
    const t = setTimeout(() => setCurrentStep(s => s + 1), 800);
    return () => clearTimeout(t);
  }, [active, currentStep]);

  const handleStart = () => {
    setActive(true);
    setCurrentStep(0);
  };

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <div className="label-mono text-warning">Attack Story</div>
      </div>
      <div className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse-soft" />
        <span className="text-xs font-mono text-warning tracking-wide">SIMULATED EDUCATIONAL SCENARIO</span>
      </div>

      {!active ? (
        <div className="text-center py-8">
          <p className="text-ink-200 mb-6 max-w-md mx-auto">
            See how this phishing email could lead to account compromise. This is a simulated, educational walkthrough.
          </p>
          <button onClick={handleStart} className="btn-primary text-base group">
            <Play className="w-4 h-4" />
            Show the Attack Story
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          {STEPS.map((step, i) => {
            const isRevealed = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div key={i}>
                <div
                  className={`flex items-start gap-4 transition-all duration-500 ${
                    isRevealed || isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 h-0 overflow-hidden'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 transition-all duration-300 ${
                      isActive ? 'bg-danger/20 border-2 border-danger-glow scale-110' : 'glass'
                    }`}>
                      {step.icon}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`w-px h-12 transition-all duration-500 ${isRevealed ? 'bg-danger/40' : 'bg-ink-600/30'}`} />
                    )}
                  </div>
                  <div className="flex-1 pt-2 pb-2">
                    <div className="font-display font-bold text-sm tracking-wider text-white mb-1">
                      {step.title}
                    </div>
                    <p className="text-sm text-ink-300 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {currentStep >= STEPS.length && (
            <div className="mt-6 animate-fade-in-up">
              <div className="glass rounded-lg p-4 border-l-2 border-danger">
                <p className="text-sm text-ink-100 leading-relaxed">
                  This is why spotting the evidence early matters. Reporting the email
                  stops the attack before it reaches this stage.
                </p>
              </div>
              <button onClick={onGenerateReport} className="btn-primary text-base mt-4 group w-full justify-center">
                Generate Incident Report
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
