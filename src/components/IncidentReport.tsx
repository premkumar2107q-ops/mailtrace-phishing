import { useState } from 'react';
import type { EmailInput, AnalysisResult } from '@/data/samples';
import { FileText, Download, Check } from 'lucide-react';

interface IncidentReportProps {
  input: EmailInput;
  result: AnalysisResult;
  caseId: string;
}

export function IncidentReport({ input, result, caseId }: IncidentReportProps) {
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => setGenerated(true);

  const handleDownload = () => {
    const reportText = generateReportText(input, result, caseId);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mailtrace-incident-report-${caseId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-4 h-4 text-accent-400" />
        <div className="label-mono text-accent-400">Incident Report</div>
      </div>

      {!generated ? (
        <div className="text-center py-8">
          <p className="text-ink-200 mb-6 max-w-md mx-auto">
            Generate a professional, print-ready incident report with all evidence,
            indicators, and recommended actions.
          </p>
          <button onClick={handleGenerate} className="btn-primary text-base group">
            <FileText className="w-4 h-4" />
            Generate Incident Report
          </button>
        </div>
      ) : (
        <div className="animate-fade-in-up">
          <div className="bg-ink-850 rounded-xl border border-ink-600/40 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-ink-600/30 bg-ink-900/50">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-display font-bold text-lg text-white tracking-wider">
                    MAILTRACE INCIDENT REPORT
                  </div>
                  <div className="label-mono text-ink-400 mt-1">Confidential Security Document</div>
                </div>
                <div className="text-right">
                  <div className="label-mono text-ink-400">Generated</div>
                  <div className="font-mono text-xs text-ink-200">{new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ReportField label="Case ID" value={caseId} mono />
                <ReportField label="Verdict" value={result.verdict} danger={result.score >= 50} />
                <ReportField label="Risk Score" value={`${result.score} / 100`} danger={result.score >= 50} />
              </div>

              <div className="border-t border-ink-600/20 pt-4">
                <div className="label-mono text-ink-400 mb-2">Source Email</div>
                <div className="text-sm text-ink-100 font-mono break-all">{input.from}</div>
              </div>

              <div className="border-t border-ink-600/20 pt-4">
                <div className="label-mono text-ink-400 mb-2">Subject</div>
                <div className="text-sm text-ink-100">{input.subject}</div>
              </div>

              <div className="border-t border-ink-600/20 pt-4">
                <div className="label-mono text-ink-400 mb-2">Detected Indicators</div>
                {result.evidence.length === 0 ? (
                  <p className="text-sm text-ink-300">No phishing indicators detected.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {result.evidence.map((ev, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-ink-100 animate-fade-in-up"
                        style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
                      >
                        <Check className="w-3.5 h-3.5 text-accent-400 mt-0.5 shrink-0" />
                        <span>{ev.label}</span>
                        <span className="text-ink-400 ml-auto font-mono text-xs">+{ev.weight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-ink-600/20 pt-4">
                <div className="label-mono text-ink-400 mb-2">Evidence</div>
                {result.evidence.length === 0 ? (
                  <p className="text-sm text-ink-300">No evidence to report.</p>
                ) : (
                  <div className="space-y-3">
                    {result.evidence.map((ev, i) => (
                      <div key={i} className="glass rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-ink-400">
                            {String(ev.number).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-medium text-white">{ev.label}</span>
                        </div>
                        <div className="font-mono text-xs text-accent-300 mb-1 break-all">
                          "{ev.matchedText}"
                        </div>
                        <p className="text-xs text-ink-300">{ev.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-ink-600/20 pt-4">
                <div className="label-mono text-ink-400 mb-2">Score Contributions</div>
                {result.evidence.length === 0 ? (
                  <p className="text-sm text-ink-300">Total: 0 / 100</p>
                ) : (
                  <div className="space-y-1">
                    {result.evidence.map((ev, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-ink-100">{ev.label}</span>
                        <span className="font-mono text-ink-300">+{ev.weight}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-ink-600/20">
                      <span className="font-display font-bold text-white">TOTAL</span>
                      <span className="font-display font-bold text-white">{result.score}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-ink-600/20 pt-4">
                <div className="label-mono text-ink-400 mb-2">Recommended Action</div>
                <p className="text-sm text-ink-100 leading-relaxed">{result.recommendedAction}</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-ink-600/30 bg-ink-900/50">
              <p className="text-xs text-ink-400 font-mono">
                MAILTRACE &middot; Educational security analysis &middot; No suspicious links were opened &middot; Analysis runs locally in your browser
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="btn-primary text-base mt-4 w-full justify-center group"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      )}
    </div>
  );
}

function ReportField({ label, value, mono, danger }: { label: string; value: string; mono?: boolean; danger?: boolean }) {
  return (
    <div className="glass rounded-lg p-3">
      <div className="label-mono text-ink-400 mb-1">{label}</div>
      <div className={`${mono ? 'font-mono' : 'font-display'} text-sm font-semibold ${danger ? 'text-danger-glow' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

function generateReportText(input: EmailInput, result: AnalysisResult, caseId: string): string {
  const lines = [
    '====================================',
    '    MAILTRACE INCIDENT REPORT',
    '====================================',
    '',
    `Case ID:          ${caseId}`,
    `Verdict:          ${result.verdict}`,
    `Risk Score:       ${result.score} / 100`,
    `Generated:        ${new Date().toLocaleString()}`,
    '',
    '--- SOURCE EMAIL ---',
    `From:             ${input.from}`,
    `Subject:          ${input.subject}`,
    '',
    '--- DETECTED INDICATORS ---',
    ...(result.evidence.length > 0
      ? result.evidence.map((ev) => `  [+] ${ev.label.padEnd(25)} +${ev.weight}`)
      : ['  No phishing indicators detected.']),
    '',
    '--- EVIDENCE ---',
    ...(result.evidence.length > 0
      ? result.evidence.map((ev) => `  [${String(ev.number).padStart(2, '0')}] ${ev.label}\n       Match: "${ev.matchedText}"\n       ${ev.explanation}`)
      : ['  No evidence to report.']),
    '',
    '--- SCORE CONTRIBUTIONS ---',
    ...(result.evidence.length > 0
      ? result.evidence.map((ev) => `  ${ev.label.padEnd(25)} +${ev.weight}`)
      : []),
    `  ${'TOTAL'.padEnd(25)} ${result.score}`,
    '',
    '--- RECOMMENDED ACTION ---',
    result.recommendedAction,
    '',
    '====================================',
    'MAILTRACE - Educational security analysis',
    'No suspicious links were opened.',
    'Analysis runs locally in your browser.',
    '====================================',
  ];
  return lines.join('\n');
}
