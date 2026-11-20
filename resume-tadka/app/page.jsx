'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Landing from '@/components/Landing';
import Burning from '@/components/Burning';
import Results from '@/components/Results';
import Compare, { Reupload } from '@/components/Compare';
import { buildMockReport } from '@/lib/mockReport';

/**
 * Screens: landing → burning → results → reupload → reburning → compare
 *
 * To connect the real backend later, replace buildMockReport() in startAnalysis()
 * with: const res = await fetch('/api/analyse', { method: 'POST', body: formData });
 */
export default function Home() {
  const [screen, setScreen] = useState('landing');
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [role, setRole] = useState('pm');
  const [report, setReport] = useState(null);

  // Stop the browser from opening a file dropped outside the upload box.
  useEffect(() => {
    const stop = (e) => e.preventDefault();
    window.addEventListener('dragover', stop);
    window.addEventListener('drop', stop);
    return () => {
      window.removeEventListener('dragover', stop);
      window.removeEventListener('drop', stop);
    };
  }, []);

  const go = (next) => {
    setScreen(next);
    window.scrollTo({ top: 0 });
  };

  const startAnalysis = () => {
    setReport(buildMockReport({ role, hasJd: jd.trim().length > 0, fileName: file?.name }));
    go('burning');
  };

  const onBurnDone = useCallback(() => go('results'), []);
  const onReburnDone = useCallback(() => go('compare'), []);

  const reset = () => {
    setFile(null);
    setJd('');
    setReport(null);
    go('landing');
  };

  const toUpload = () => {
    if (screen !== 'landing') {
      setScreen('landing');
      setTimeout(() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' }), 50);
    } else {
      document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header screen={screen} onHome={reset} onAnalyse={toUpload} />
      <main className="flex-1">
        {screen === 'landing' && (
          <Landing file={file} setFile={setFile} jd={jd} setJd={setJd} role={role} setRole={setRole} onStart={startAnalysis} />
        )}
        {screen === 'burning' && <Burning onDone={onBurnDone} />}
        {screen === 'results' && report && (
          <Results report={report} hasJd={jd.trim().length > 0} onCompare={() => go('reupload')} onNew={toUpload} />
        )}
        {screen === 'reupload' && report && (
          <Reupload previousScore={report.scores.ats} onBack={() => go('results')} onSubmit={() => go('reburning')} />
        )}
        {screen === 'reburning' && <Burning onDone={onReburnDone} durationMs={5000} />}
        {screen === 'compare' && report && (
          <Compare
            before={report.scores.ats}
            after={report.after.ats}
            breakdown={report.after.breakdown}
            onBack={() => go('results')}
            onNew={reset}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
