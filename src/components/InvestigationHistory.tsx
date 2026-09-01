import type { HistoryEntry } from '@/data/samples';
import { History, Trash2, X } from 'lucide-react';

interface InvestigationHistoryProps {
  history: HistoryEntry[];
  onOpen: (entry: HistoryEntry) => void;
  onRemove: (caseId: string) => void;
  onClear: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-danger-glow';
  if (score >= 50) return 'text-warning';
  if (score >= 25) return 'text-accent-400';
  return 'text-success-glow';
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function InvestigationHistory({ history, onOpen, onRemove, onClear }: InvestigationHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-accent-400" />
          <div className="label-mono text-accent-400">Recent Investigations</div>
        </div>
        <button
          onClick={onClear}
          className="text-ink-400 hover:text-danger-glow transition-colors text-xs flex items-center gap-1 focus-ring rounded-md"
          aria-label="Clear history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {history.map((entry) => (
          <div
            key={entry.caseId}
            className="group glass rounded-lg p-3 flex items-center gap-3 hover:bg-ink-800/60 transition-colors"
          >
            <button
              onClick={() => onOpen(entry)}
              className="flex-1 flex items-center gap-3 text-left min-w-0 focus-ring rounded-md"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs text-accent-300">{entry.caseId}</span>
                  <span className="text-xs text-ink-400">{formatTime(entry.timestamp)}</span>
                </div>
                <div className="text-sm text-ink-100 truncate font-mono">{entry.from}</div>
                <div className="text-xs text-ink-300 truncate">{entry.subject}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`font-display font-bold text-lg ${getScoreColor(entry.score)}`}>
                  {entry.score}
                </div>
                <div className={`text-xs font-medium ${getScoreColor(entry.score)}`}>
                  {entry.verdict}
                </div>
              </div>
            </button>
            <button
              onClick={() => onRemove(entry.caseId)}
              className="text-ink-400 hover:text-danger-glow transition-colors p-1 opacity-0 group-hover:opacity-100 focus-ring rounded-md shrink-0"
              aria-label="Remove entry"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-ink-400 text-center font-mono">
        Analysis runs locally in your browser.
      </p>
    </div>
  );
}
