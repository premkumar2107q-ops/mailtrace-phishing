import { useState, useRef, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { WhyMailtrace } from '@/components/WhyMailtrace';
import { SampleLibrary } from '@/components/SampleLibrary';
import { Footer } from '@/components/Footer';
import { EmailPanel } from '@/components/EmailPanel';
import { AnalysisSequence } from '@/components/AnalysisSequence';
import { ThreatScore } from '@/components/ThreatScore';
import { DomainDNA } from '@/components/DomainDNA';
import { UrlXray } from '@/components/UrlXray';
import { AttackStory } from '@/components/AttackStory';
import { UserDecision } from '@/components/UserDecision';
import { IncidentReport } from '@/components/IncidentReport';
import { EvidencePanel } from '@/components/EvidencePanel';
import { InvestigationHistory } from '@/components/InvestigationHistory';
import { EMAIL_SAMPLES, type EmailInput, type EmailSample, type Evidence, type AnalysisResult, type HistoryEntry } from '@/data/samples';
import { analyzeEmail } from '@/data/scoringEngine';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';

type Phase = 'landing' | 'investigate' | 'analyzing' | 'results';

function generateCaseId(): string {
  const num = String(Math.floor(Math.random() * 9000) + 1).padStart(4, '0');
  return `MT-2026-${num}`;
}

function App() {
  const [phase, setPhase] = useState<Phase>('landing');
  const [emailInput, setEmailInput] = useState<EmailInput>({ from: '', subject: '', body: '' });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeEvidence, setActiveEvidence] = useState<Evidence | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [caseId, setCaseId] = useState('MT-2026-0001');

  const { history, addEntry, removeEntry, clearHistory } = useAnalysisHistory();

  const investigateRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const startInvestigation = useCallback(() => {
    const sample = EMAIL_SAMPLES[0];
    setEmailInput({ from: sample.from, subject: sample.subject, body: sample.body });
    setResult(null);
    setActiveEvidence(null);
    setShowReport(false);
    setCaseId(generateCaseId());
    setPhase('investigate');
    setTimeout(() => investigateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, []);

  const trySample = useCallback(() => {
    document.getElementById('samples')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const selectSample = useCallback((sample: EmailSample) => {
    setEmailInput({ from: sample.from, subject: sample.subject, body: sample.body });
    setResult(null);
    setActiveEvidence(null);
    setShowReport(false);
    setCaseId(generateCaseId());
    setPhase('investigate');
    setTimeout(() => investigateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, []);

  const handleInputChange = useCallback((input: EmailInput) => {
    setEmailInput(input);
    setResult(null);
    setActiveEvidence(null);
    setShowReport(false);
    setPhase('investigate');
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!emailInput.from.trim() && !emailInput.body.trim()) return;
    setPhase('analyzing');
  }, [emailInput]);

  const handleAnalysisComplete = useCallback(() => {
    const analysisResult = analyzeEmail(emailInput);
    setResult(analysisResult);
    setPhase('results');
    addEntry(emailInput.from, emailInput.subject, emailInput.body, analysisResult, caseId);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [emailInput, caseId, addEntry]);

  const handleEvidenceClick = useCallback((evidence: Evidence | null) => {
    setActiveEvidence(evidence);
  }, []);

  const handleNavigate = useCallback((section: string) => {
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (section === 'investigate') {
      if (phase === 'landing') startInvestigation();
      else investigateRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }, [phase, startInvestigation]);

  const handleGenerateReport = useCallback(() => {
    setShowReport(true);
    setTimeout(() => document.getElementById('incident-report')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  const handleReset = useCallback(() => {
    setPhase('investigate');
    setEmailInput({ from: '', subject: '', body: '' });
    setResult(null);
    setActiveEvidence(null);
    setShowReport(false);
    setCaseId(generateCaseId());
    investigateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openHistoryEntry = useCallback((entry: HistoryEntry) => {
    setEmailInput({ from: entry.from, subject: entry.subject, body: entry.body });
    setResult(entry.result);
    setCaseId(entry.caseId);
    setActiveEvidence(null);
    setShowReport(false);
    setPhase('results');
    setTimeout(() => investigateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, []);

  const analyzing = phase === 'analyzing';
  const analyzed = phase === 'results';
  const showInvestigation = phase !== 'landing';

  return (
    <div className="min-h-screen bg-ink-950 relative overflow-x-hidden">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="fixed inset-0 radial-glow pointer-events-none" aria-hidden="true" />

      <Navbar onStartInvestigation={startInvestigation} onNavigate={handleNavigate} />

      <main>
        <Hero onStartInvestigation={startInvestigation} onTrySample={trySample} />

        {showInvestigation && (
          <section
            ref={investigateRef}
            id="investigate"
            className="relative py-20 px-6 lg:px-8 scroll-mt-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <div className="label-mono text-accent-400 mb-1">Investigation</div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                    Email Forensic Analysis
                  </h2>
                </div>
                <button onClick={handleReset} className="btn-ghost text-xs">
                  New Investigation
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mb-6">
                <div>
                  {phase === 'analyzing' ? (
                    <AnalysisSequence onComplete={handleAnalysisComplete} />
                  ) : (
                    <EmailPanel
                      input={emailInput}
                      onInputChange={handleInputChange}
                      onAnalyze={handleAnalyze}
                      analyzing={analyzing}
                      analyzed={analyzed}
                      result={result}
                      activeEvidenceId={activeEvidence?.id ?? null}
                      onEvidenceClick={handleEvidenceClick}
                      caseId={caseId}
                    />
                  )}
                </div>

                {analyzed && result && (
                  <div className="lg:sticky lg:top-24 h-fit">
                    <EvidencePanel evidence={activeEvidence} />
                  </div>
                )}
              </div>

              {analyzed && result && (
                <div ref={resultsRef} className="space-y-6 scroll-mt-20">
                  <div className="animate-fade-in-up">
                    <ThreatScore result={result} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DomainDNA analysis={result.domainAnalysis} />
                    <UrlXray analysis={result.urlAnalysis} />
                  </div>

                  <AttackStory onGenerateReport={handleGenerateReport} />

                  <UserDecision result={result} onGenerateReport={handleGenerateReport} />

                  {showReport && (
                    <div id="incident-report" className="scroll-mt-20 animate-fade-in-up">
                      <IncidentReport input={emailInput} result={result} caseId={caseId} />
                    </div>
                  )}

                  <div className="text-center py-12">
                    <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                      <span className="text-white">Don't just detect. </span>
                      <span className="text-gradient">Show the evidence.</span>
                    </h2>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <HowItWorks />
        <WhyMailtrace />
        <SampleLibrary onSelectSample={selectSample} />

        {history.length > 0 && (
          <section className="relative py-12 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <InvestigationHistory
                history={history}
                onOpen={openHistoryEntry}
                onRemove={removeEntry}
                onClear={clearHistory}
              />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
