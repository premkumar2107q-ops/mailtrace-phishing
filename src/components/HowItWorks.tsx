import { Search, ScanSearch, FileSearch, Gauge, ShieldAlert } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'CAPTURE',
    desc: 'Analyze the email content.',
    icon: Search,
  },
  {
    num: '02',
    title: 'INVESTIGATE',
    desc: 'Find suspicious indicators.',
    icon: ScanSearch,
  },
  {
    num: '03',
    title: 'EXPLAIN',
    desc: 'Show exactly why they matter.',
    icon: FileSearch,
  },
  {
    num: '04',
    title: 'SCORE',
    desc: 'Calculate transparent risk.',
    icon: Gauge,
  },
  {
    num: '05',
    title: 'ACT',
    desc: 'Recommend what the user should do.',
    icon: ShieldAlert,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="label-mono text-accent-400 mb-3">How It Works</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            From suspicious to clear
          </h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            Every investigation follows the same transparent process.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-ink-500/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative group animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 rounded-full glass group-hover:border-accent-500/40 transition-all duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-accent-400 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-ink-800 border border-ink-500/50 flex items-center justify-center">
                        <span className="font-mono text-[0.625rem] font-bold text-accent-300">
                          {step.num}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-sm tracking-wider text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-ink-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
