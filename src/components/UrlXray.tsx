import { useEffect, useState } from 'react';
import type { UrlAnalysis } from '@/data/samples';
import { Link2, Globe, Route, Lock } from 'lucide-react';

interface UrlXrayProps {
  analysis: UrlAnalysis | null;
}

export function UrlXray({ analysis }: UrlXrayProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!analysis) {
    return (
      <div className="glass-strong rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Link2 className="w-4 h-4 text-accent-400" />
          <div className="label-mono text-accent-400">URL X-Ray</div>
        </div>
        <div className="glass rounded-lg p-6 text-center">
          <p className="text-sm text-ink-300">No URLs detected in the email body.</p>
        </div>
      </div>
    );
  }

  const { url, protocol, domain, path, query, isHttp, isIp, isShortened } = analysis;

  const components = [
    {
      label: 'PROTOCOL',
      value: protocol,
      icon: isHttp ? Lock : Link2,
      danger: isHttp,
      explanation: isHttp
        ? 'Unencrypted HTTP. Legitimate services typically use HTTPS. Data sent over HTTP can be intercepted.'
        : 'HTTPS with encryption. While the protocol is secure, the domain itself may still be suspicious.',
    },
    {
      label: 'DOMAIN',
      value: domain,
      icon: Globe,
      danger: analysis.flags.includes('Domain mismatch with sender') || isIp,
      explanation: isIp
        ? 'This URL uses a raw IP address instead of a domain name. Legitimate services almost never ask you to visit an IP address directly.'
        : analysis.flags.includes('Domain mismatch with sender')
        ? 'This domain does not match the sender domain. It may be designed to look similar at a glance.'
        : 'This domain matches the sender domain. Verify it is a domain you trust.',
    },
    {
      label: 'PATH',
      value: path || '/',
      icon: Route,
      danger: false,
      explanation:
        'The path on the server. Phishing pages often use paths like /verify, /login, or /confirm to appear legitimate.',
    },
    ...(query
      ? [
          {
            label: 'QUERY',
            value: query,
            icon: Route,
            danger: false,
            explanation:
              'Query parameters. These can contain tracking IDs or session tokens used by attackers.',
          },
        ]
      : []),
  ];

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Link2 className="w-4 h-4 text-accent-400" />
        <div className="label-mono text-accent-400">URL X-Ray</div>
      </div>

      {/* Full URL display */}
      <div className="glass rounded-lg p-4 mb-6 font-mono text-sm break-all">
        {protocol && (
          <span className={isHttp ? 'text-danger-glow font-bold' : 'text-success-glow'}>{protocol}</span>
        )}
        {domain && (
          <span className={isIp || analysis.flags.includes('Domain mismatch with sender') ? 'text-danger-glow font-bold' : 'text-ink-100'}>
            {domain}
          </span>
        )}
        {path && <span className="text-ink-300">{path}</span>}
        {query && <span className="text-ink-400">{query}</span>}
      </div>

      {/* Flags */}
      {analysis.flags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {analysis.flags.map((flag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-full bg-danger/10 border border-danger/30 text-xs font-mono text-danger-glow"
            >
              {flag}
            </span>
          ))}
        </div>
      )}

      {/* Component breakdown */}
      <div className="space-y-3">
        {components.map((comp, i) => {
          const Icon = comp.icon;
          return (
            <div
              key={comp.label}
              className={`glass rounded-lg p-4 transition-all duration-300 ${
                revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } ${comp.danger ? 'border-danger/30' : ''}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    comp.danger ? 'bg-danger/10' : 'bg-accent-500/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${comp.danger ? 'text-danger-glow' : 'text-accent-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="label-mono text-ink-400">{comp.label}</span>
                    {comp.danger && (
                      <span className="text-xs text-danger-glow font-mono">[FLAGGED]</span>
                    )}
                  </div>
                  <div
                    className={`font-mono text-sm break-all mb-2 ${
                      comp.danger ? 'text-danger-glow' : 'text-ink-100'
                    }`}
                  >
                    {comp.value}
                  </div>
                  <p className="text-xs text-ink-300 leading-relaxed">{comp.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
        <Lock className="w-3.5 h-3.5" />
        <span className="font-mono">This URL is never opened. Analysis is performed on the text only.</span>
      </div>
    </div>
  );
}
