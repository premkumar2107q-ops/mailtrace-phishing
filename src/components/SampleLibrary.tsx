import { ShieldCheck, AlertTriangle, Mail, Building2, Truck, GraduationCap } from 'lucide-react';
import { EMAIL_SAMPLES, type EmailSample } from '@/data/samples';

interface SampleLibraryProps {
  onSelectSample: (sample: EmailSample) => void;
}

const SAMPLE_ICONS: Record<string, typeof Mail> = {
  'bank-alert': Building2,
  delivery: Truck,
  university: GraduationCap,
  legitimate: ShieldCheck,
};

export function SampleLibrary({ onSelectSample }: SampleLibraryProps) {
  return (
    <section id="samples" className="relative py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="label-mono text-accent-400 mb-3">Investigate a Sample</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Choose a case to investigate
          </h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            Each sample is a realistic email. Run the full investigation and see the evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EMAIL_SAMPLES.map((sample, i) => {
            const Icon = SAMPLE_ICONS[sample.id] ?? Mail;
            const isLegit = sample.category === 'legitimate';
            return (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="group glass rounded-xl p-5 text-left hover:border-accent-500/40 hover:bg-ink-800/60 transition-all duration-300 focus-ring animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
                aria-label={`Investigate ${sample.name}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                      isLegit ? 'bg-success/10' : 'bg-danger/10'
                    }`}
                  >
                    {isLegit ? (
                      <ShieldCheck className="w-5 h-5 text-success-glow" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-danger-glow" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-ink-400" />
                      <span className="label-mono text-ink-400">
                        {isLegit ? 'Legitimate' : 'Phishing'}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white text-base mb-1 group-hover:text-accent-200 transition-colors">
                      {sample.name}
                    </h3>
                    <p className="text-xs text-ink-300 truncate font-mono">
                      {sample.from}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
