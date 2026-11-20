'use client';

import { useState } from 'react';
import { AlertCircle, ArrowLeft, Download, FileText, Linkedin, TrendingUp, Upload } from 'lucide-react';
import { ACCEPT, validateResumeFile } from '@/lib/file';
import { scoreLevel } from '@/lib/score';
import { ChilliLogo } from './ui';

/* ---------- Step 1: upload the updated resume ---------- */

export function Reupload({ previousScore, onBack, onSubmit }) {
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const handle = (f) => {
    setDragging(false);
    const res = validateResumeFile(f);
    if (!res.ok) { setError(res.error); return; }
    setError('');
    onSubmit(res.file);
  };

  return (
    <section className="rt-fade-up mx-auto flex max-w-2xl flex-col gap-6 px-6 pb-20 pt-12">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 self-start text-sm font-bold text-charcoal-soft hover:text-chilli">
        <ArrowLeft size={16} aria-hidden="true" /> Back to report
      </button>
      <div className="flex flex-col gap-2">
        <h1 className="text-[clamp(28px,3.6vw,38px)] font-extrabold tracking-[-0.03em]">Upload your updated resume</h1>
        <p className="text-charcoal-soft">Made the fixes? Upload the new version and we’ll compare it with your previous score of <strong className="text-charcoal">{previousScore}</strong>.</p>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); }}
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handle(e.dataTransfer?.files?.[0]); }}
        className={`flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-[20px] border-2 border-dashed p-8 text-center transition-colors ${dragging ? 'border-chilli bg-chilli-light' : 'border-[#D9CDB8] bg-white'}`}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-chilli-light">
          <Upload className="text-chilli" size={30} aria-hidden="true" />
        </span>
        <span className="text-lg font-bold">Drag & drop your updated resume</span>
        <label className="inline-flex min-h-[44px] cursor-pointer items-center rounded-xl bg-charcoal px-5 font-bold text-white focus-within:outline focus-within:outline-[3px] focus-within:outline-turmeric">
          Browse files
          <input type="file" accept={ACCEPT} className="sr-only" onChange={(e) => { handle(e.target.files?.[0]); e.target.value = ''; }} />
        </label>
        <span className="text-[13px] font-medium text-charcoal-muted">PDF or DOCX · Max 5 MB</span>
      </div>
      {error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl bg-chilli-light px-3.5 py-3 text-sm font-medium text-chilli-dark">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> {error}
        </div>
      )}
    </section>
  );
}

/* ---------- Share card (drawn to canvas for download) ---------- */

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function downloadShareCard(before, after) {
  const W = 1200, H = 627;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  try { await document.fonts?.ready; } catch {}
  const font = (w, s) => `${w} ${s}px "Plus Jakarta Sans", Arial, sans-serif`;

  ctx.fillStyle = '#FFF9ED'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#FCE9E4'; roundRect(ctx, 760, -80, 520, 520, 260); ctx.fill();

  // brand
  ctx.fillStyle = '#292521'; ctx.font = font(800, 40); ctx.fillText('Resume', 80, 110);
  const rw = ctx.measureText('Resume ').width;
  ctx.fillStyle = '#C93A26'; ctx.fillText('Tadka', 80 + rw, 110);

  ctx.fillStyle = '#292521'; ctx.font = font(800, 58);
  ctx.fillText('Added some tadka', 80, 230);
  ctx.fillText('to my resume!', 80, 300);

  // score boxes
  const box = (x, label, score, color) => {
    ctx.fillStyle = '#FFFFFF'; roundRect(ctx, x, 360, 250, 180, 28); ctx.fill();
    ctx.fillStyle = '#6B625A'; ctx.font = font(700, 24); ctx.fillText(label, x + 32, 410);
    ctx.fillStyle = color; ctx.font = font(800, 84); ctx.fillText(String(score), x + 32, 505);
    const sw = ctx.measureText(String(score)).width;
    ctx.fillStyle = '#6B625A'; ctx.font = font(700, 26);
    ctx.fillText('/100', x + 32 + sw + 8, 505);
  };
  box(80, 'BEFORE', before, '#8E2A1B');
  box(370, 'AFTER', after, '#3F6B52');

  ctx.fillStyle = '#C93A26'; roundRect(ctx, 660, 400, 250, 100, 50); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.font = font(800, 40);
  const txt = `+${after - before} pts`;
  ctx.fillText(txt, 660 + (250 - ctx.measureText(txt).width) / 2, 465);

  ctx.fillStyle = '#6B625A'; ctx.font = font(600, 22);
  ctx.fillText('ATS score · resumetadka', 80, 590);

  const link = document.createElement('a');
  link.download = 'my-resume-tadka-score.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* ---------- Step 2: comparison ---------- */

export default function Compare({ before, after, breakdown, onBack, onNew }) {
  const gain = after - before;
  const pct = Math.round((gain / before) * 100);
  const lvlB = scoreLevel(before);
  const lvlA = scoreLevel(after);

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="rt-fade-up mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-20 pt-10">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 self-start text-sm font-bold text-charcoal-soft hover:text-chilli">
        <ArrowLeft size={16} aria-hidden="true" /> Back to report
      </button>

      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-[clamp(30px,4vw,46px)] font-extrabold tracking-[-0.03em]">Look at that transformation!</h1>
        <p className="text-lg font-bold text-leaf">You improved by +{gain} points ({pct}% better)</p>
        <span className="rounded-full bg-turmeric-light px-3 py-1.5 text-xs font-semibold text-turmeric-dark">Sample comparison · real re-analysis coming soon</span>
      </div>

      {/* before / after */}
      <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-2 rounded-[22px] border border-line bg-white p-7 text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-charcoal-muted">Before</span>
          <span className="text-6xl font-extrabold tracking-tight">{before}<span className="text-xl text-charcoal-muted">/100</span></span>
          <span className={`self-center rounded-lg px-2.5 py-1 text-xs font-extrabold ${lvlB.bg} ${lvlB.text}`}>{lvlB.label}</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-turmeric shadow-[0_6px_16px_rgba(244,197,66,.45)]">
            <TrendingUp size={26} aria-hidden="true" />
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-[22px] border-2 border-leaf-bright bg-leaf-light/40 p-7 text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-leaf-dark">After</span>
          <span className="text-6xl font-extrabold tracking-tight">{after}<span className="text-xl text-charcoal-muted">/100</span></span>
          <span className={`self-center rounded-lg px-2.5 py-1 text-xs font-extrabold ${lvlA.bg} ${lvlA.text}`}>{lvlA.label}</span>
        </div>
      </div>

      {/* category bars */}
      <div className="flex flex-col gap-5 rounded-[22px] border border-line bg-white p-6 sm:p-8">
        <h2 className="text-lg font-extrabold">What improved</h2>
        <ul className="flex flex-col gap-5">
          {breakdown.map((b) => (
            <li key={b.label} className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-semibold">
                <span>{b.label}</span>
                <span className="text-leaf">{b.before} → {b.after} (+{b.after - b.before})</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="h-2.5 overflow-hidden rounded-full bg-[#F3EEE6]" aria-label={`Before: ${b.before}`}>
                  <div className="h-full rounded-full bg-[#CFC6B8]" style={{ width: `${b.before}%` }} />
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#F3EEE6]" aria-label={`After: ${b.after}`}>
                  <div className="h-full rounded-full bg-leaf-bright" style={{ width: `${b.after}%`, transition: 'width .8s ease-out' }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 text-xs font-semibold text-charcoal-muted">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#CFC6B8]" />Before</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-leaf-bright" />After</span>
        </div>
      </div>

      {/* share card */}
      <div className="grid items-center gap-6 rounded-[22px] bg-cream p-6 sm:p-8 md:grid-cols-2">
        <div aria-label="Shareable score card preview" className="relative overflow-hidden rounded-2xl bg-[#FFF9ED] p-6 shadow-soft ring-1 ring-line">
          <span className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-chilli-light" aria-hidden="true" />
          <div className="relative flex items-center gap-2 text-lg font-extrabold">
            <ChilliLogo size={20} /> Resume <span className="text-chilli">Tadka</span>
          </div>
          <p className="relative mt-4 text-2xl font-extrabold leading-tight">Added some tadka to my resume!</p>
          <div className="relative mt-5 flex items-center gap-3">
            <div className="rounded-xl bg-white px-4 py-3">
              <span className="block text-[11px] font-bold text-charcoal-muted">BEFORE</span>
              <span className="text-3xl font-extrabold text-chilli-dark">{before}</span>
            </div>
            <div className="rounded-xl bg-white px-4 py-3">
              <span className="block text-[11px] font-bold text-charcoal-muted">AFTER</span>
              <span className="text-3xl font-extrabold text-leaf">{after}</span>
            </div>
            <span className="rounded-full bg-chilli px-4 py-2 text-lg font-extrabold text-white">+{gain}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold">Show off your glow-up</h2>
          <p className="text-sm leading-relaxed text-charcoal-soft">Download your score card and share it on LinkedIn. Recruiters like candidates who take feedback seriously.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => downloadShareCard(before, after)} className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-charcoal px-5 font-bold text-white transition hover:-translate-y-px">
              <Download size={18} aria-hidden="true" /> Download score card
            </button>
            <button type="button" onClick={shareLinkedIn} className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#0A66C2] px-5 font-bold text-white transition hover:-translate-y-px">
              <Linkedin size={18} aria-hidden="true" /> Share on LinkedIn
            </button>
          </div>
          <button type="button" onClick={onNew} className="inline-flex items-center gap-2 self-start text-sm font-bold text-chilli hover:underline">
            <FileText size={16} aria-hidden="true" /> Check another resume
          </button>
        </div>
      </div>
    </section>
  );
}
