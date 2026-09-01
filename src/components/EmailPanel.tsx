import { useMemo, useState } from 'react';
import { Mail, ArrowRight, Loader2, Pencil, Check } from 'lucide-react';
import type { EmailInput, Evidence, AnalysisResult } from '@/data/samples';

interface EmailPanelProps {
  input: EmailInput;
  onInputChange: (input: EmailInput) => void;
  onAnalyze: () => void;
  analyzing: boolean;
  analyzed: boolean;
  result: AnalysisResult | null;
  activeEvidenceId: string | null;
  onEvidenceClick: (evidence: Evidence | null) => void;
  caseId: string;
}

interface Segment {
  text: string;
  evidence?: Evidence;
}

function buildSegments(
  fieldText: string,
  evidence: Evidence[],
  field: 'from' | 'subject' | 'body',
): Segment[] {
  const relevant = evidence
    .filter((e) => e.field === field && fieldText.includes(e.matchedText))
    .sort((a, b) => a.start - b.start);

  if (relevant.length === 0) return [{ text: fieldText }];

  const segs: Segment[] = [];
  let pos = 0;
  const usedTexts = new Set<string>();

  for (const ev of relevant) {
    if (usedTexts.has(ev.matchedText)) continue;
    const idx = fieldText.indexOf(ev.matchedText, pos);
    if (idx === -1) continue;
    if (idx > pos) segs.push({ text: fieldText.substring(pos, idx) });
    segs.push({ text: ev.matchedText, evidence: ev });
    pos = idx + ev.matchedText.length;
    usedTexts.add(ev.matchedText);
  }
  if (pos < fieldText.length) segs.push({ text: fieldText.substring(pos) });
  return segs;
}

const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  'look-alike-domain': { text: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/50' },
  'suspicious-url': { text: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/50' },
  'urgency-language': { text: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-500/50' },
  'suspicious-keywords': { text: 'text-yellow-300', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
  'sender-anomaly': { text: 'text-fuchsia-300', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/50' },
  'credential-request': { text: 'text-rose-300', bg: 'bg-rose-500/10', border: 'border-rose-500/50' },
  'attachment': { text: 'text-purple-300', bg: 'bg-purple-500/10', border: 'border-purple-500/50' },
  'legitimate': { text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/50' },
};

export function EmailPanel({
  input,
  onInputChange,
  onAnalyze,
  analyzing,
  analyzed,
  result,
  activeEvidenceId,
  onEvidenceClick,
  caseId,
}: EmailPanelProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EmailInput>(input);

  const isEmpty = !input.from.trim() && !input.subject.trim() && !input.body.trim();
  const showEditor = editing || isEmpty;

  const segments = useMemo(() => {
    if (!result || result.evidence.length === 0) return null;
    return {
      from: buildSegments(input.from, result.evidence, 'from'),
      subject: buildSegments(input.subject, result.evidence, 'subject'),
      body: buildSegments(input.body, result.evidence, 'body'),
    };
  }, [result, input]);

  const handleStartEdit = () => {
    setDraft(input);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    onInputChange(draft);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const renderSegment = (seg: Segment, key: number) => {
    if (!seg.evidence) return <span key={key}>{seg.text}</span>;
    const colors = CATEGORY_COLORS[seg.evidence.category] ?? CATEGORY_COLORS['suspicious-url'];
    const isActive = activeEvidenceId === seg.evidence.id;
    return (
      <span
        key={key}
        role="button"
        tabIndex={0}
        onClick={() => onEvidenceClick(seg.evidence ?? null)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEvidenceClick(seg.evidence ?? null);
          }
        }}
        className={`evidence-highlight ${colors.text} ${colors.bg} ${isActive ? 'active' : ''}`}
        aria-label={`Evidence: ${seg.evidence.label}`}
      >
        {seg.text}
        <span className={`evidence-marker ml-1 ${colors.bg} ${colors.text} ${colors.border}`}>
          {String(seg.evidence.number).padStart(2, '0')}
        </span>
      </span>
    );
  };

  const inputCls =
    'w-full bg-ink-900/60 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-ink-100 font-mono focus:border-accent-500/50 focus:outline-none focus-ring transition-colors';

  return (
    <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
      {/* Case header */}
      <div className="px-6 py-4 border-b border-ink-600/30 bg-ink-850/50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <div className="label-mono text-ink-400">New Investigation</div>
              <div className="font-display font-bold text-white text-sm">Email Analysis</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="label-mono text-ink-400">Case ID</div>
              <div className="font-mono text-sm text-accent-300 font-medium">{caseId}</div>
            </div>
            <div className="w-px h-10 bg-ink-600/40" />
            <div>
              <div className="label-mono text-ink-400">Status</div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    analyzed ? 'bg-success-glow' : 'bg-warning'
                  } animate-pulse-soft`}
                />
                <span className="text-sm font-medium text-ink-100">
                  {analyzing ? 'ANALYZING' : analyzed ? 'ANALYZED' : 'READY FOR ANALYSIS'}
                </span>
              </div>
            </div>
            {!showEditor && !analyzing && (
              <button
                onClick={handleStartEdit}
                className="btn-ghost text-xs"
                aria-label="Edit email"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Email content / editing */}
      <div className="p-6 space-y-4">
        {showEditor ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-2 items-start">
              <label htmlFor="edit-from" className="label-mono text-ink-400 pt-2">
                From
              </label>
              <input
                id="edit-from"
                type="text"
                value={draft.from}
                onChange={(e) => setDraft({ ...draft, from: e.target.value })}
                className={inputCls}
                placeholder="sender@example.com"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-2 items-start">
              <label htmlFor="edit-subject" className="label-mono text-ink-400 pt-2">
                Subject
              </label>
              <input
                id="edit-subject"
                type="text"
                value={draft.subject}
                onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                className={inputCls}
                placeholder="Email subject"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-2 items-start">
              <label htmlFor="edit-body" className="label-mono text-ink-400 pt-2">
                Body
              </label>
              <textarea
                id="edit-body"
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                className={`${inputCls} min-h-[160px] resize-y leading-relaxed`}
                placeholder="Paste the email body here..."
              />
            </div>
          </>
        ) : (
          <>
            {/* From */}
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-2 items-start">
              <div className="label-mono text-ink-400 pt-1">From</div>
              <div className="text-sm text-ink-100 font-mono break-all">
                {segments ? segments.from.map(renderSegment) : input.from}
              </div>
            </div>

            {/* Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-2 items-start">
              <div className="label-mono text-ink-400 pt-1">Subject</div>
              <div className="text-base font-medium text-white">
                {segments ? segments.subject.map(renderSegment) : input.subject}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-ink-600/30 pt-4">
              <div className="label-mono text-ink-400 mb-3">Body</div>
              <div className="text-sm text-ink-100 leading-relaxed whitespace-pre-wrap font-mono">
                {segments ? segments.body.map(renderSegment) : input.body}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      {showEditor && (
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={handleSaveEdit} className="btn-primary text-sm flex-1 justify-center">
            <Check className="w-4 h-4" />
            Apply
          </button>
          {editing && (
            <button onClick={handleCancelEdit} className="btn-ghost text-sm">
              Cancel
            </button>
          )}
        </div>
      )}

      {!showEditor && !analyzed && !analyzing && (
        <div className="px-6 pb-6">
          <button
            onClick={onAnalyze}
            className="btn-primary w-full justify-center text-base group"
          >
            Analyze Email
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}

      {analyzing && (
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-3 py-3 text-ink-200">
            <Loader2 className="w-5 h-5 animate-spin text-accent-400" />
            <span className="font-display font-medium text-sm">Running investigation...</span>
          </div>
        </div>
      )}
    </div>
  );
}
