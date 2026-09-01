import { useEffect, useState } from 'react';
import { ScanSearch, Menu, X } from 'lucide-react';

interface NavbarProps {
  onStartInvestigation: () => void;
  onNavigate: (section: string) => void;
}

export function Navbar({ onStartInvestigation, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Investigate', target: 'investigate' },
    { label: 'How It Works', target: 'how-it-works' },
    { label: 'Samples', target: 'samples' },
  ];

  const handleNav = (target: string) => {
    onNavigate(target);
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNav('hero')}
            className="flex items-center gap-2.5 focus-ring rounded-md"
            aria-label="MAILTRACE home"
          >
            <div className="relative">
              <ScanSearch className="w-6 h-6 text-accent-400" strokeWidth={2} />
              <div className="absolute inset-0 bg-accent-400/20 rounded-full blur-md" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-white">
              MAILTRACE
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.target}
                onClick={() => handleNav(item.target)}
                className="text-sm font-medium text-ink-200 hover:text-white transition-colors focus-ring rounded-md px-1"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={onStartInvestigation}
              className="btn-primary text-xs"
            >
              Start Investigation
            </button>
          </div>

          <button
            className="md:hidden text-ink-200 hover:text-white focus-ring rounded-md p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass-strong border-t border-ink-600/30 py-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.target}
                  onClick={() => handleNav(item.target)}
                  className="text-left text-sm font-medium text-ink-200 hover:text-white transition-colors px-2 py-2"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onStartInvestigation();
                  setMobileOpen(false);
                }}
                className="btn-primary text-xs justify-center mt-2"
              >
                Start Investigation
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
