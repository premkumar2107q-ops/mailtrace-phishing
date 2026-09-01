import { ScanSearch, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-ink-700/40 py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <ScanSearch className="w-5 h-5 text-accent-400" />
            <span className="font-display font-bold text-white tracking-wider">
              MAILTRACE
            </span>
          </div>

          <p className="text-xs text-ink-400 text-center max-w-md">
            Educational security analysis &middot; No suspicious links are opened &middot;
            All examples are fictional
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-ink-400 hover:text-white transition-colors focus-ring rounded-md p-1"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-ink-700/30 text-center">
          <p className="font-display text-lg text-ink-200">
            Don't just detect. <span className="text-gradient font-semibold">Show the evidence.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
