'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Info } from 'lucide-react';

export function ChilliLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M18 6.2c1.6 1.6 1.6 4.2.5 6.7C16.6 17.2 12 20.6 5 20.1c-1 0-1.3-1.3-.3-1.8C9 16.4 12.1 13 13.6 8.6c.8-2.3 2.9-3.8 4.4-2.4z"
        fill="#E34B36"
      />
      <path d="M17.4 6c-.1-1.6.7-2.9 2.2-3.6" stroke="#3F6B52" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export const FLAME_PATH =
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z';

export function FlameIcon({ size = 20, color = '#F4C542', filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={FLAME_PATH} />
    </svg>
  );
}

/** Info icon that explains a term on hover, focus or tap. */
export function InfoTip({ label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={`What is ${label}?`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-charcoal-muted hover:bg-cream hover:text-charcoal"
      >
        <Info size={16} aria-hidden="true" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-xl bg-charcoal px-4 py-3 text-left text-[13px] font-medium leading-relaxed text-white shadow-soft"
        >
          {children}
        </span>
      )}
    </span>
  );
}

export function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition-colors ${
        copied ? 'bg-leaf-light text-leaf-dark' : 'bg-cream text-charcoal hover:bg-chilli-light'
      }`}
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {copied ? 'Copied' : label}
      <span className="sr-only" aria-live="polite">{copied ? 'Copied to clipboard' : ''}</span>
    </button>
  );
}

export const TERMS = {
  ats: 'ATS (Applicant Tracking System): software companies use to collect, organise and filter job applications before a recruiter sees them.',
  jd: 'JD Match: how closely the skills and keywords in your resume line up with the job description you pasted.',
  star: 'STAR: Situation, Task, Action and Result. A simple way to explain what you did and what changed because of it.',
  keywords: 'Keywords: skills and terms in a job description that recruiters and ATS software search for.',
  readiness: 'Recruiter Readiness: how clearly your resume shows your skills and achievements to a human skimming it in a few seconds.',
};
