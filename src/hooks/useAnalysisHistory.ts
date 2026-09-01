import { useState, useCallback } from 'react';
import type { HistoryEntry, AnalysisResult } from '@/data/samples';

const STORAGE_KEY = 'mailtrace-history';
const MAX_ENTRIES = 10;

function load(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function save(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore quota errors
  }
}

export function useAnalysisHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(load);

  const addEntry = useCallback(
    (from: string, subject: string, body: string, result: AnalysisResult, caseId: string) => {
      const entry: HistoryEntry = {
        caseId,
        from,
        subject,
        body,
        score: result.score,
        verdict: result.verdict,
        timestamp: Date.now(),
        result,
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, MAX_ENTRIES);
        save(next);
        return next;
      });
    },
    [],
  );

  const removeEntry = useCallback((caseId: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.caseId !== caseId);
      save(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    save([]);
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
