'use client';

import { ChilliLogo } from './ui';

export default function Header({ screen, onHome, onAnalyse }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <button type="button" onClick={onHome} className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-chilli-light">
            <ChilliLogo />
          </span>
          <span>
            Resume <span className="text-chilli">Tadka</span>
          </span>
        </button>

        <nav aria-label="Main" className="flex flex-wrap items-center gap-6 text-[15px] font-medium">
          {screen === 'landing' ? (
            <>
              <a href="#features" className="hover:text-chilli">Features</a>
              <a href="#about" className="hover:text-chilli">About</a>
            </>
          ) : (
            <button type="button" onClick={onHome} className="hover:text-chilli">New check</button>
          )}
          <button
            type="button"
            onClick={onAnalyse}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-chilli px-5 font-bold text-white transition hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(201,58,38,.25)]"
          >
            Analyse My Resume
          </button>
        </nav>
      </div>
    </header>
  );
}
