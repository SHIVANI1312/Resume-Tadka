'use client';

import { useState } from 'react';
import {
  AlertTriangle, CheckCircle2, ChevronDown, Download, FileWarning, RefreshCw, SpellCheck, ThumbsDown, ThumbsUp,
  XCircle, Lightbulb,
} from 'lucide-react';
import { PRIORITY_STYLES, scoreLevel } from '@/lib/score';
import { roleLabel } from '@/lib/file';
import { downloadAtsTemplate } from '@/lib/template';
import { CopyButton, InfoTip, TERMS } from './ui';

/* ---------- Score pieces ---------- */

function Gauge({ score, size = 132 }) {
  const lvl = scoreLevel(score);
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`${score} out of 100`}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#F3EEE6" strokeWidth="12" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={lvl.ring} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[34px] font-extrabold leading-none tracking-tight">{score}</span>
        <span className="text-xs font-semibold text-charcoal-muted">/ 100</span>
      </div>
    </div>
  );
}

function LevelPill({ score }) {
  const lvl = scoreLevel(score);
  return <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${lvl.bg} ${lvl.text}`}>{lvl.label}</span>;
}

function ScoreCard({ title, term, children }) {
  return (
    <div className="flex flex-col gap-4 rounded-[22px] border border-line bg-white p-6">
      <div className="flex items-center gap-1">
        <h2 className="text-[15px] font-bold">{title}</h2>
        <InfoTip label={title}>{TERMS[term]}</InfoTip>
      </div>
      {children}
    </div>
  );
}

function Bar({ value, className = '' }) {
  const lvl = scoreLevel(value);
  return (
    <div className={`h-2.5 overflow-hidden rounded-full bg-[#F3EEE6] ${className}`}>
      <div className={`h-full rounded-full ${lvl.bar}`} style={{ width: `${value}%`, transition: 'width .8s ease-out' }} />
    </div>
  );
}

/* ---------- Fix pieces ---------- */

function PriorityBadge({ p }) {
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide ${PRIORITY_STYLES[p]}`}>{p}</span>;
}

function FixDetail({ fix }) {
  return (
    <dl className="grid gap-3 text-sm leading-relaxed sm:grid-cols-2">
      <div className="rounded-xl bg-cream p-3.5">
        <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-charcoal-muted">Why it matters</dt>
        <dd className="text-charcoal-soft">{fix.why}</dd>
      </div>
      <div className="rounded-xl bg-leaf-light/60 p-3.5">
        <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-leaf-dark">How to fix it</dt>
        <dd className="text-charcoal">{fix.how}</dd>
      </div>
    </dl>
  );
}

function FixAccordion({ fix, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-line bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-2xl p-4 text-left hover:bg-cream/60 sm:p-5"
      >
        <PriorityBadge p={fix.priority} />
        <span className="flex-1 font-bold">{fix.title}</span>
        <span className="hidden text-xs font-semibold text-charcoal-muted sm:inline">{fix.category}</span>
        <ChevronDown size={18} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && <div className="px-4 pb-5 sm:px-5"><FixDetail fix={fix} /></div>}
    </div>
  );
}

/* ---------- Tabs ---------- */

const TABS = [
  { id: 'fixes', label: 'Fix List' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'keywords', label: 'Keyword Gap' },
  { id: 'star', label: 'STAR Rewrites' },
  { id: 'add', label: 'Add These' },
  { id: 'ats', label: 'ATS Check' },
];

function FixListTab({ fixes }) {
  const order = { High: 0, Medium: 1, Low: 2 };
  const sorted = [...fixes].sort((a, b) => order[a.priority] - order[b.priority]);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-charcoal-soft">{fixes.length} issues found, sorted by priority. Tap any issue to see why it matters and how to fix it.</p>
      {sorted.map((f, i) => <FixAccordion key={f.id} fix={f} defaultOpen={i === 0} />)}
    </div>
  );
}

function GrammarTab({ grammar }) {
  if (!grammar.length) {
    return <Empty icon={SpellCheck} title="No grammar or spelling issues found" body="Nice and clean. Still worth one last read out loud before you hit send." />;
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-charcoal-soft">Recruiters notice typos fast. Fix these {grammar.length} before you apply.</p>
      {grammar.map((g) => (
        <div key={g.wrong + g.context} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4">
          <SpellCheck size={20} className="shrink-0 text-chilli" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 basis-60 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2 text-[15px]">
              <span className="rounded-md bg-chilli-light px-2 py-0.5 font-semibold text-chilli-dark line-through decoration-2">{g.wrong}</span>
              <span aria-hidden="true" className="text-charcoal-muted">→</span>
              <span className="sr-only">should be</span>
              <span className="rounded-md bg-leaf-light px-2 py-0.5 font-bold text-leaf-dark">{g.right}</span>
            </div>
            <span className="text-[13px] text-charcoal-muted">“{g.context}”</span>
          </div>
          <CopyButton text={g.right} label="Copy fix" />
        </div>
      ))}
    </div>
  );
}

function KeywordsTab({ keywords, hasJd }) {
  if (!keywords.found.length && !keywords.missing.length) {
    return <Empty icon={FileWarning} title="No keyword data yet" body="Paste a job description on the first screen to see which skills you have and which you’re missing." />;
  }
  return (
    <div className="flex flex-col gap-6">
      {!hasJd && (
        <div className="flex items-start gap-2.5 rounded-xl bg-turmeric-light px-4 py-3 text-sm font-medium text-turmeric-dark">
          <Lightbulb size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          No JD added, so these are common keywords for this role. Add a JD for an exact match.
        </div>
      )}
      <div className="flex flex-col gap-3">
        <h3 className="flex items-center gap-1 font-bold">Found in your resume ({keywords.found.length}) <InfoTip label="keywords">{TERMS.keywords}</InfoTip></h3>
        <div className="flex flex-wrap gap-2">
          {keywords.found.map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-leaf-light px-3 py-1.5 text-sm font-semibold text-leaf-dark">
              <CheckCircle2 size={15} aria-hidden="true" /> {k}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold">Missing ({keywords.missing.length})</h3>
        <div className="flex flex-wrap gap-2">
          {keywords.missing.map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-chilli-light px-3 py-1.5 text-sm font-semibold text-chilli-dark">
              <XCircle size={15} aria-hidden="true" /> {k}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-cream p-4 text-sm leading-relaxed text-charcoal-soft">
        <strong className="text-charcoal">How to add them naturally:</strong> only add skills you really have. Put tools in your Skills section, then show 2–3 of them in action inside experience bullets (for example, “Used SQL to find…”). Avoid stuffing a list of keywords at the bottom.
      </div>
    </div>
  );
}

function StarTab({ rewrites }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-1 text-sm text-charcoal-soft">
        Your weakest bullets, rewritten using STAR. Replace anything in [brackets] with your real numbers.
        <InfoTip label="STAR">{TERMS.star}</InfoTip>
      </p>
      {rewrites.map((r) => (
        <div key={r.original} className="grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-2 md:p-5">
          <div className="flex flex-col gap-2 rounded-xl bg-[#F7F4EF] p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-charcoal-muted">Original</span>
            <p className="text-[15px] leading-relaxed text-charcoal-soft">{r.original}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-xl bg-leaf-light/60 p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-leaf-dark">Improved</span>
            <p className="text-[15px] font-medium leading-relaxed">{r.improved}</p>
            <div className="mt-auto"><CopyButton text={r.improved} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddTheseTab({ items }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2.5 rounded-xl bg-turmeric-light px-4 py-3 text-sm font-medium text-turmeric-dark">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        These are templates, not facts. Only use one if you really did it, and replace every [X] with your actual result.
      </div>
      {items.map((it) => (
        <div key={it.text} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
          <span className="self-start rounded-md bg-chilli-light px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-chilli-dark">Covers: {it.covers}</span>
          <p className="text-[15px] font-medium leading-relaxed">{it.text}</p>
          <div><CopyButton text={it.text} /></div>
        </div>
      ))}
    </div>
  );
}

function AtsTab({ checks }) {
  const passed = checks.filter((c) => c.pass).length;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-charcoal-soft">{passed} of {checks.length} ATS checks passed.</p>
      <ul className="grid gap-3 md:grid-cols-2">
        {checks.map((c) => (
          <li key={c.label} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
            {c.pass
              ? <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-leaf" aria-label="Passed" />
              : <XCircle size={22} className="mt-0.5 shrink-0 text-chilli" aria-label="Needs fixing" />}
            <div className="flex flex-col gap-1">
              <span className="font-bold">{c.label}</span>
              <span className="text-sm leading-relaxed text-charcoal-soft">{c.note}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Empty({ icon: Icon, title, body }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line p-10 text-center">
      <Icon size={28} className="text-charcoal-muted" aria-hidden="true" />
      <span className="font-bold">{title}</span>
      <span className="max-w-sm text-sm text-charcoal-soft">{body}</span>
    </div>
  );
}

/* ---------- Page ---------- */

export default function Results({ report, hasJd, onCompare, onNew }) {
  const [tab, setTab] = useState('fixes');
  const [feedback, setFeedback] = useState(null);

  const order = { High: 0, Medium: 1, Low: 2 };
  const top3 = [...report.fixes].sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 3);

  const goToTab = (id) => {
    setTab(id);
    document.getElementById('report-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="rt-fade-up mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-20 pt-10">
      {/* Title */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[clamp(28px,3.6vw,40px)] font-extrabold tracking-[-0.03em]">Your Resume Tadka Report</h1>
          <p className="text-charcoal-soft">Here’s what we found. Let’s make your resume stand out.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full border border-line px-3 py-1.5">{report.fileName}</span>
          <span className="rounded-full border border-line px-3 py-1.5">{roleLabel(report.role)}</span>
          {report.isSample && <span className="rounded-full bg-turmeric-light px-3 py-1.5 text-turmeric-dark">Sample report · real analysis coming soon</span>}
        </div>
      </div>

      {/* Score cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <ScoreCard title="ATS Score" term="ats">
          <div className="flex items-center gap-5">
            <Gauge score={report.scores.ats} />
            <div className="flex flex-col gap-2">
              <LevelPill score={report.scores.ats} />
              <p className="text-sm leading-relaxed text-charcoal-soft">ATS software can read most of your resume, but formatting and keywords are costing you points.</p>
            </div>
          </div>
        </ScoreCard>

        <ScoreCard title="JD Match" term="jd">
          {report.scores.jdMatch != null ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[40px] font-extrabold leading-none tracking-tight">{report.scores.jdMatch}%</span>
                <LevelPill score={report.scores.jdMatch} />
              </div>
              <Bar value={report.scores.jdMatch} />
              <p className="text-sm leading-relaxed text-charcoal-soft">You cover most of the JD. Adding the missing keywords could push you past 85%.</p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-start justify-center gap-3">
              <span className="text-[40px] font-extrabold leading-none text-[#CFC6B8]">—</span>
              <p className="text-sm leading-relaxed text-charcoal-soft">Add a JD to unlock this score.</p>
              <button type="button" onClick={onNew} className="text-sm font-bold text-chilli hover:underline">Add a job description</button>
            </div>
          )}
        </ScoreCard>

        <ScoreCard title="Recruiter Readiness" term="readiness">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] font-extrabold leading-none tracking-tight">{report.scores.readiness}</span>
              <span className="text-sm font-semibold text-charcoal-muted">/ 100</span>
              <LevelPill score={report.scores.readiness} />
            </div>
            <Bar value={report.scores.readiness} />
            <p className="text-sm leading-relaxed text-charcoal-soft">Your skills are clear, but your achievements need numbers to stand out in a 6-second skim.</p>
          </div>
        </ScoreCard>
      </div>

      {/* Top fixes + breakdown */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-4 rounded-[22px] border border-line bg-white p-6 lg:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold">Your top 3 fixes</h2>
            <button type="button" onClick={() => goToTab('fixes')} className="text-sm font-bold text-chilli hover:underline">
              View all {report.fixes.length} fixes
            </button>
          </div>
          <ol className="flex flex-col gap-3">
            {top3.map((f, i) => (
              <li key={f.id} className="flex gap-3.5 rounded-2xl bg-cream/70 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal text-sm font-extrabold text-turmeric">{i + 1}</span>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge p={f.priority} />
                    <span className="font-bold">{f.title}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-charcoal-soft">{f.why}</p>
                  <p className="text-sm font-medium leading-relaxed"><span className="font-bold text-leaf">Fix: </span>{f.how}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-5 rounded-[22px] border border-line bg-white p-6 lg:col-span-5">
          <h2 className="text-lg font-extrabold">Score breakdown</h2>
          <ul className="flex flex-col gap-4">
            {report.breakdown.map((b) => (
              <li key={b.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{b.label}</span>
                  <span className={scoreLevel(b.score).text}>{b.score}</span>
                </div>
                <Bar value={b.score} />
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-3 text-xs font-semibold text-charcoal-muted">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-chilli-bright" />0–49 Bland</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-turmeric" />50–74 Needs Tadka</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-leaf-bright" />75+ Full Masala</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div id="report-tabs" className="scroll-mt-24 rounded-[22px] border border-line bg-white">
        <div role="tablist" aria-label="Report sections" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line px-3 pt-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-t-xl border-b-[3px] px-4 text-sm font-bold transition-colors ${
                tab === t.id ? 'border-chilli text-chilli' : 'border-transparent text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {t.label}
              {t.id === 'grammar' && report.grammar.length > 0 && (
                <span className="ml-1.5 rounded-full bg-chilli-light px-1.5 text-[11px] text-chilli-dark">{report.grammar.length}</span>
              )}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="p-5 sm:p-7">
          {tab === 'fixes' && <FixListTab fixes={report.fixes} />}
          {tab === 'grammar' && <GrammarTab grammar={report.grammar} />}
          {tab === 'keywords' && <KeywordsTab keywords={report.keywords} hasJd={hasJd} />}
          {tab === 'star' && <StarTab rewrites={report.starRewrites} />}
          {tab === 'add' && <AddTheseTab items={report.addThese} />}
          {tab === 'ats' && <AtsTab checks={report.atsChecks} />}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-[22px] bg-cream p-6">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadAtsTemplate}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-charcoal px-5 font-bold text-white transition hover:-translate-y-px"
          >
            <Download size={18} aria-hidden="true" /> Download ATS-Safe Template
          </button>
          <button
            type="button"
            onClick={onCompare}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-chilli px-5 font-bold text-white transition hover:-translate-y-px"
          >
            <RefreshCw size={18} aria-hidden="true" /> Re-upload and Compare
          </button>
        </div>
        <div className="flex items-center gap-3">
          {feedback ? (
            <span role="status" className="text-sm font-semibold text-leaf">
              {feedback === 'up' ? 'Thanks! Glad it helped.' : 'Thanks for telling us. We’ll make it better.'}
            </span>
          ) : (
            <>
              <span className="text-sm font-semibold">Was this helpful?</span>
              <button type="button" aria-label="Helpful" onClick={() => setFeedback('up')} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white hover:bg-leaf-light">
                <ThumbsUp size={18} aria-hidden="true" />
              </button>
              <button type="button" aria-label="Not helpful" onClick={() => setFeedback('down')} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white hover:bg-chilli-light">
                <ThumbsDown size={18} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
