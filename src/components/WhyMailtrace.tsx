import { Eye, FileText, Scale } from 'lucide-react';

export function WhyMailtrace() {
  return (
    <section className="relative py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="label-mono text-accent-400 mb-3">Why MAILTRACE?</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Traditional detectors can stop at a verdict.
            <br />
            <span className="text-gradient">MAILTRACE exposes the evidence behind the verdict.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Eye,
              title: 'Evidence-First',
              desc: 'Suspicious elements are highlighted directly inside the email, not hidden in a separate report.',
            },
            {
              icon: Scale,
              title: 'Transparent Scoring',
              desc: 'Every point in the risk score is traceable to a specific indicator with a clear explanation.',
            },
            {
              icon: FileText,
              title: 'Actionable Reports',
              desc: 'Generate a professional incident report you can share with your security team.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="glass rounded-xl p-6 hover:border-accent-500/30 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
