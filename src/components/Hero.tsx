import { ArrowRight, FlaskConical, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onStartInvestigation: () => void;
  onTrySample: () => void;
}

const HERO_BG =
  'https://images.pexels.com/photos/5380595/pexels-photo-5380595.jpeg?auto=compress&cs=tinysrgb&w=1920';

export function Hero({ onStartInvestigation, onTrySample }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          filter: 'blur(4px) brightness(0.35)',
          transform: 'scale(1.05)',
        }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/70 to-ink-950" aria-hidden="true" />
      {/* Grid + radial glow */}
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 radial-glow" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-success-glow animate-pulse-soft" />
          <span className="label-mono text-ink-200">Phishing Investigation Platform</span>
        </div>

        <h1
          className="font-display font-bold text-6xl md:text-8xl lg:text-9xl tracking-tight text-white mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          MAILTRACE
        </h1>

        <p
          className="font-display text-xl md:text-3xl lg:text-4xl font-medium text-ink-100 mb-4 leading-tight animate-fade-in-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          Before you click,
          <br />
          <span className="text-gradient">know what you're looking at.</span>
        </p>

        <p
          className="text-base md:text-lg text-ink-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          An interactive phishing investigation platform that turns suspicious
          emails into evidence you can understand.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          <button
            onClick={onStartInvestigation}
            className="btn-primary text-base group"
          >
            Start Investigation
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={onTrySample}
            className="btn-ghost text-base group"
          >
            <FlaskConical className="w-4 h-4" />
            Try a Sample
          </button>
        </div>

        <div
          className="flex items-center justify-center gap-2 text-ink-400 animate-fade-in-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-xs font-mono tracking-wide">
            Educational security analysis &middot; No suspicious links are opened
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float-subtle">
        <div className="w-6 h-10 rounded-full border-2 border-ink-500/50 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-accent-400/60" />
        </div>
      </div>
    </section>
  );
}
