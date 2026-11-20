'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { FLAME_PATH } from './ui';

const MESSAGES = [
  'Heating the oil...',
  'Setting your typos on fire...',
  'Adding a little jeera...',
  'Roasting “hardworking team player”...',
  'Checking your ATS spices...',
  'Finding those missing keywords...',
  'Giving your achievements some tadka...',
  'Almost ready to serve!',
];

const STAGES = ['Parsing Resume', 'ATS Check', 'AI Review'];

const STICKERS = [
  { tag: 'Burned', text: 'Hardworking team player', strike: true, pos: 'left-0 top-[3%]', rot: '-8deg', bg: 'bg-turmeric-light', tagColor: 'text-turmeric-dark', delay: '0s' },
  { tag: 'Bye bye', text: 'Objective: To get a job', strike: true, pos: 'right-0 top-[6%]', rot: '7deg', bg: 'bg-chilli-light', tagColor: 'text-chilli-dark', delay: '.5s' },
  { tag: 'Typo alert', text: 'Managment skills', strike: false, pos: 'left-0 top-[42%]', rot: '5deg', bg: 'bg-white', tagColor: 'text-chilli-dark', delay: '1s' },
  { tag: 'Roasted', text: 'MS Office expert', strike: true, pos: 'right-0 top-[46%]', rot: '-6deg', bg: 'bg-leaf-light', tagColor: 'text-leaf-dark', delay: '1.4s' },
  { tag: 'Where?', text: 'No numbers anywhere?!', strike: false, pos: 'left-[2%] top-[84%]', rot: '-4deg', bg: 'bg-chilli-light', tagColor: 'text-chilli-dark', delay: '.3s' },
  { tag: 'Toasted', text: 'References on request', strike: true, pos: 'right-[2%] top-[86%]', rot: '6deg', bg: 'bg-turmeric-light', tagColor: 'text-turmeric-dark', delay: '.8s' },
];

/**
 * Plays the burn animation. Calls onDone when both the animation has finished
 * and `ready` is true (later: when the real API response has arrived).
 */
export default function Burning({ onDone, ready = true, durationMs = 9000 }) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const step = 100 / (durationMs / 120);
    const id = setInterval(() => {
      setProgress((p) => {
        // hold at 95% until the analysis is ready
        const cap = ready ? 100 : 95;
        return Math.min(cap, p + step);
      });
    }, 120);
    return () => clearInterval(id);
  }, [durationMs, ready]);

  useEffect(() => {
    if (progress >= 100 && !doneRef.current) {
      doneRef.current = true;
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
  }, [progress, onDone]);

  const msg = MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(progress / (100 / MESSAGES.length)))];
  const stage = progress < 34 ? 0 : progress < 67 ? 1 : 2;

  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-7 px-6 pb-20 pt-14 text-center">
      <div className="flex flex-col items-center gap-2.5">
        <span className="inline-flex items-center gap-2 rounded-full bg-chilli-light px-3.5 py-2 text-[13px] font-bold text-chilli-dark">
          <span className="h-2 w-2 rounded-full bg-chilli-bright" /> Burning in progress
        </span>
        <h1 className="text-[clamp(30px,4.4vw,50px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
          Your resume is burning<span className="text-chilli">…</span> in a good way
        </h1>
        <p className="max-w-lg text-[17px] leading-relaxed text-charcoal-soft">
          Sit tight. We’re roasting the bland bits and keeping the good stuff.
        </p>
      </div>

      {/* Sticker stage */}
      <div aria-hidden="true" className="relative h-[440px] w-full max-w-[640px]">
        <span className="rt-smoke absolute left-[44%] top-[34%] h-12 w-12 rounded-full bg-[#D9D4CC]" />
        <span className="rt-smoke absolute left-[52%] top-[30%] h-10 w-10 rounded-full bg-[#E4DFD8]" style={{ animationDelay: '.9s' }} />
        <span className="rt-smoke absolute left-[47%] top-[32%] h-8 w-8 rounded-full bg-[#D9D4CC]" style={{ animationDelay: '1.7s' }} />

        {/* resume paper */}
        <div className="rt-wobble absolute left-1/2 top-[14%] -ml-[105px] flex h-[270px] w-[210px] flex-col gap-2 overflow-hidden rounded-[14px] border-4 border-white bg-white p-[18px] shadow-[0_14px_34px_rgba(41,37,33,.18),0_0_0_1px_#EFE7DA]">
          <span className="self-start rounded-md bg-[#F3F0EB] px-2 py-0.5 text-[10px] font-bold text-charcoal-muted">resume_final_FINAL_v3.pdf</span>
          <div className="h-3 w-[62%] rounded-md bg-charcoal" />
          <div className="h-[7px] w-[42%] rounded bg-[#E4DED4]" />
          {[100, 90, 96, 78, 88].map((w, i) => (
            <div key={i} className={`h-1.5 rounded bg-[#EEE9E1] ${i === 0 ? 'mt-1.5' : ''}`} style={{ width: `${w}%` }} />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#3B2A20] via-[#7A4A2E]/80 to-transparent" />
        </div>

        {/* flames */}
        <div className="absolute left-1/2 top-[56%] -ml-[130px] flex h-[140px] w-[260px] items-end justify-center">
          <svg className="rt-flame -mr-6" width="90" height="110" viewBox="0 0 24 24"><path d={FLAME_PATH} fill="#E34B36" /></svg>
          <svg className="rt-flame relative z-10" width="130" height="150" viewBox="0 0 24 24" style={{ animationDelay: '.2s' }}>
            <path d={FLAME_PATH} fill="#E34B36" />
            <path d="M12 22a4 4 0 0 1-4-4c0-1.6 1-3 2-3.6.2 1.2 1 2 2 2 0-2 1-3.6 2.4-4.4-.2 1.4.4 2.6 1.2 3.4A4 4 0 0 1 12 22z" fill="#F4C542" />
          </svg>
          <svg className="rt-flame -ml-6" width="96" height="116" viewBox="0 0 24 24" style={{ animationDelay: '.35s' }}><path d={FLAME_PATH} fill="#E34B36" /></svg>
        </div>

        {/* embers */}
        <span className="rt-ember absolute left-[42%] top-[68%] h-[7px] w-[7px] rounded-full bg-turmeric" />
        <span className="rt-ember absolute left-[55%] top-[70%] h-1.5 w-1.5 rounded-full bg-turmeric" style={{ animationDelay: '.6s' }} />
        <span className="rt-ember absolute left-[49%] top-[66%] h-[5px] w-[5px] rounded-full bg-chilli-bright" style={{ animationDelay: '1.1s' }} />

        {/* funny stickers */}
        {STICKERS.map((s) => (
          <div key={s.text} className={`rt-float absolute ${s.pos}`} style={{ animationDelay: s.delay }}>
            <div
              className={`flex flex-col gap-0.5 whitespace-nowrap rounded-[14px] border-[3px] border-white px-3 py-2 text-left text-[12px] font-bold shadow-[0_6px_16px_rgba(41,37,33,.14)] sm:text-[13px] ${s.bg}`}
              style={{ transform: `rotate(${s.rot})` }}
            >
              <span className={`text-[10px] font-extrabold uppercase tracking-[.06em] ${s.tagColor}`}>{s.tag}</span>
              <span className={s.strike ? 'line-through decoration-chilli decoration-2' : ''}>{s.text}</span>
            </div>
          </div>
        ))}
      </div>

      <p role="status" aria-live="polite" className="min-h-[30px] text-xl font-bold">{msg}</p>

      {/* progress */}
      <div className="flex w-full max-w-[640px] flex-col gap-3.5">
        <div
          className="h-3 overflow-hidden rounded-full bg-[#F3EEE6]"
          role="progressbar"
          aria-label="Analysis progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="h-full rounded-full bg-chilli-bright transition-[width] duration-200 ease-linear" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex flex-wrap justify-between gap-3">
          {STAGES.map((label, i) => {
            const done = i < stage || progress >= 100;
            const active = i === stage && !done;
            return (
              <div key={label} className={`flex items-center gap-2 text-sm font-semibold ${done ? 'text-leaf' : active ? 'text-charcoal' : 'text-charcoal-muted'}`}>
                <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs font-extrabold text-white ${done ? 'bg-leaf' : active ? 'bg-chilli' : 'bg-[#CFC6B8]'}`}>
                  {done ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : i + 1}
                </span>
                {label}
              </div>
            );
          })}
        </div>
        <span className="text-[13px] text-charcoal-muted">{Math.round(progress)}% burned</span>
      </div>

      <p className="max-w-md text-[13px] leading-relaxed text-charcoal-muted">
        Don’t worry, only the bland bits get burned. Your real achievements are safe with us.
      </p>
    </section>
  );
}
