export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-lg font-extrabold">
            Resume <span className="text-chilli">Tadka</span>
          </span>
          <span className="text-sm text-charcoal-soft">
            Built with care by Shivani Rajpoot ·{' '}
            {/* TODO: replace # with your LinkedIn profile URL */}
            <a href="#" className="font-semibold text-chilli hover:underline">LinkedIn</a>
          </span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-6 text-sm font-medium">
          <a href="#privacy" className="hover:text-chilli">Privacy Policy</a>
          {/* TODO: replace with your real feedback email or form */}
          <a href="mailto:feedback@resumetadka.in" className="hover:text-chilli">Feedback</a>
        </nav>
      </div>
      <p id="privacy" className="mx-auto max-w-6xl px-6 pb-8 text-xs leading-relaxed text-charcoal-muted">
        Privacy: your resume is processed only to create your report and is deleted right after. We don’t store it, sell it or use it to train AI models.
      </p>
    </footer>
  );
}
