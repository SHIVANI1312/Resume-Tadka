'use client';

import { useState } from 'react';
import {
  AlertCircle, BarChart3, CheckCircle2, FileText, LayoutTemplate, Search, ShieldCheck, Sparkles,
  Target, TrendingUp, Upload, X, Zap,
} from 'lucide-react';
import { ACCEPT, ROLES, formatBytes, validateResumeFile } from '@/lib/file';
import { FlameIcon } from './ui';

const FEATURES = [
  { icon: BarChart3, title: 'ATS Score', body: 'A 0–100 score with a clear breakdown of where you lost points and why.', tint: 'bg-chilli-light text-chilli' },
  { icon: Target, title: 'JD Match', body: 'See how closely your resume fits the role you are applying for.', tint: 'bg-turmeric-light text-turmeric-dark' },
  { icon: Search, title: 'Keyword Gap', body: 'Found and missing keywords from the JD, with tips to add them naturally.', tint: 'bg-leaf-light text-leaf' },
  { icon: Sparkles, title: 'STAR Rewrites', body: 'Weak bullets rewritten as Situation, Task, Action and Result, ready to copy.', tint: 'bg-chilli-light text-chilli' },
  { icon: LayoutTemplate, title: 'ATS Format Check', body: 'Flags columns, tables, images and fonts that confuse ATS software.', tint: 'bg-turmeric-light text-turmeric-dark' },
  { icon: TrendingUp, title: 'Before & After', body: 'Re-upload your updated resume and watch your score climb.', tint: 'bg-leaf-light text-leaf' },
];

function FileInput({ onPick, className, children }) {
  return (
    <label className={`cursor-pointer ${className}`}>
      {children}
      <input
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          onPick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </label>
  );
}

export default function Landing({ file, setFile, jd, setJd, role, setRole, onStart }) {
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [formError, setFormError] = useState('');

  const handleFile = (f) => {
    setDragging(false);
    const res = validateResumeFile(f);
    if (!res.ok) {
      setFile(null);
      setFileError(res.error);
      return;
    }
    setFile(res.file);
    setFileError('');
    setFormError('');
  };

  const submit = () => {
    if (!file) {
      setFormError(fileError ? 'Fix the file issue above, then try again.' : 'Upload your resume first to get your tadka report.');
      return;
    }
    setFormError('');
    onStart();
  };

  const words = jd.trim() ? jd.trim().split(/\s+/).length : 0;

  const zone = dragging
    ? 'border-chilli bg-chilli-light'
    : file
      ? 'border-leaf-bright bg-[#F3F8F5]'
      : fileError
        ? 'border-chilli bg-[#FFF6F3]'
        : 'border-[#D9CDB8] bg-white';

  return (
    <>
      {/* HERO */}
      <section id="top" className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 pb-10 pt-16 text-center sm:pt-20">
        <h1 className="text-[clamp(34px,5vw,58px)] font-extrabold leading-[1.1] tracking-[-0.035em]">
          Burn your resume and add <span className="text-chilli">some tadka</span> to it
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-charcoal-soft">
          Get an instant ATS check, spot missing keywords and turn weak bullets into strong STAR achievements. Free, private and no signup needed.
        </p>
      </section>

      {/* UPLOAD */}
      <section id="upload" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16">
        <div className="flex flex-col gap-8 rounded-[28px] border border-line bg-white p-6 shadow-card sm:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight">Let’s add some tadka to your resume</h2>
            <p className="text-charcoal-soft">Upload your resume, paste a job description and pick your target role.</p>
          </div>

          <div className="grid gap-7 lg:grid-cols-2">
            {/* Dropzone */}
            <div className="flex min-w-0 flex-col gap-2.5">
              <span className="text-[15px] font-bold">1. Your resume</span>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFile(e.dataTransfer?.files?.[0]); }}
                className={`flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-[20px] border-2 border-dashed p-7 text-center transition-colors ${zone}`}
              >
                {!file ? (
                  <>
                    <span className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-chilli-light">
                      <Upload className="text-chilli" size={30} aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold">{dragging ? 'Drop it like it’s hot' : 'Drag & drop your resume here'}</span>
                      <span className="text-sm text-charcoal-muted">or</span>
                    </div>
                    <FileInput onPick={handleFile} className="inline-flex min-h-[44px] items-center rounded-xl bg-charcoal px-5 font-bold text-white transition hover:-translate-y-px focus-within:outline focus-within:outline-[3px] focus-within:outline-turmeric">
                      Browse files
                    </FileInput>
                    <span className="text-[13px] font-medium text-charcoal-muted">PDF or DOCX · Max 5 MB</span>
                  </>
                ) : (
                  <div className="rt-pop flex w-full flex-col items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-light">
                      <CheckCircle2 className="text-leaf" size={28} aria-hidden="true" />
                    </span>
                    <span className="text-[17px] font-bold text-leaf">Resume uploaded</span>
                    <div className="flex w-full max-w-sm items-center gap-3 rounded-[14px] border border-[#DCE9E0] bg-white p-3 text-left">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-chilli-light">
                        <FileText className="text-chilli" size={20} aria-hidden="true" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-bold">{file.name}</span>
                        <span className="text-xs text-charcoal-muted">
                          {file.name.split('.').pop().toUpperCase()} · {formatBytes(file.size)} · Ready
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove file"
                        onClick={() => { setFile(null); setFileError(''); }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-charcoal-soft hover:bg-chilli-light"
                      >
                        <X size={18} aria-hidden="true" />
                      </button>
                    </div>
                    <FileInput onPick={handleFile} className="inline-flex min-h-[44px] items-center rounded-[10px] px-3.5 text-sm font-semibold text-chilli hover:bg-chilli-light">
                      Replace file
                    </FileInput>
                  </div>
                )}
              </div>
              {fileError && (
                <div role="alert" className="flex items-start gap-2.5 rounded-xl bg-chilli-light px-3.5 py-3 text-sm font-medium leading-relaxed text-chilli-dark">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>

            {/* JD + role */}
            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label htmlFor="jd" className="text-[15px] font-bold">
                  2. Paste your Job Description <span className="font-medium text-charcoal-muted">(Optional)</span>
                </label>
                <textarea
                  id="jd"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="e.g. We're looking for an Associate Product Manager with experience in roadmap prioritisation, SQL, A/B testing and stakeholder management..."
                  className="min-h-[190px] w-full resize-y rounded-2xl border-[1.5px] border-[#E6DAC3] bg-white p-4 text-[15px] leading-relaxed placeholder:text-charcoal-muted/80 focus:border-chilli focus:outline-none"
                />
                <div className="flex flex-wrap justify-between gap-2 text-[13px] leading-relaxed text-charcoal-muted">
                  <span className="flex-1 basis-64">Adding a JD helps us identify missing keywords and measure how closely your resume matches the role.</span>
                  <span className="font-semibold">{words ? `${words} words` : 'No JD added'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <label htmlFor="role" className="text-[15px] font-bold">3. Target role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="min-h-[52px] w-full cursor-pointer rounded-[14px] border-[1.5px] border-[#E6DAC3] bg-white px-4 text-[15px] font-semibold focus:border-chilli focus:outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3.5 border-t border-line pt-7">
            <button
              type="button"
              onClick={submit}
              className="inline-flex min-h-[58px] w-full max-w-sm items-center justify-center gap-2.5 rounded-2xl bg-chilli px-10 text-lg font-extrabold text-white transition hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(201,58,38,.25)]"
            >
              Add Tadka <FlameIcon />
            </button>
            {formError && (
              <div role="alert" className="rounded-[10px] bg-chilli-light px-4 py-2.5 text-sm font-semibold text-chilli-dark">{formError}</div>
            )}
            <p className="text-center text-sm text-charcoal-soft">Your resume is deleted after analysis. Free. No signup required.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: ShieldCheck, label: 'Privacy First' },
                { icon: CheckCircle2, label: 'ATS-Friendly Analysis' },
                { icon: Zap, label: 'No Signup Required' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-semibold">
                  <Icon size={16} className="text-leaf" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-14">
        <div className="mb-10 flex flex-col items-center gap-2.5 text-center">
          <span className="text-[13px] font-bold uppercase tracking-[.08em] text-chilli">Features</span>
          <h2 className="text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.03em]">Everything your resume needs, in one report</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, tint }) => (
            <div key={title} className="flex items-start gap-4 rounded-[20px] border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(41,37,33,.08)]">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint}`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[17px] font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-charcoal-soft">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20 pt-14">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-[28px] bg-charcoal p-8 text-cream sm:p-14">
          <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-3.5">
            <span className="text-[13px] font-bold uppercase tracking-[.08em] text-turmeric">About</span>
            <h2 className="text-[clamp(26px,3vw,36px)] font-extrabold tracking-tight">Built for students who never hear back</h2>
            <p className="leading-relaxed text-[#E9E1D3]">
              Most resumes get filtered out before a recruiter reads them, and nobody tells you why. Resume Tadka shows you exactly what to fix, in plain language, so your next application has a real shot.
            </p>
          </div>
          <a href="#upload" className="inline-flex min-h-[52px] items-center rounded-[14px] bg-turmeric px-6 font-extrabold text-charcoal transition hover:-translate-y-px">
            Try it free
          </a>
        </div>
      </section>
    </>
  );
}
