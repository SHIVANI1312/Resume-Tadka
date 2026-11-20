# Resume Tadka 🌶️

*Bland resume? Add some tadka.* A free resume checker that gives an ATS score, missing keywords, grammar fixes and STAR bullet rewrites.

**Status:** frontend prototype. Every screen works, but the analysis uses **sample data** (`lib/mockReport.js`). The real backend (file parsing + rules + AI) comes next.

## Run it on your computer

1. Install [Node.js](https://nodejs.org) (version 18 or newer).
2. In this folder, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open http://localhost:3000

## Deploy for free (Vercel)

1. Push this folder to a new GitHub repository.
2. On vercel.com, click **Add New → Project**, pick the repo and click **Deploy**. No settings needed.

## Project structure

| Path | What it does |
|---|---|
| `app/page.jsx` | Screen flow: landing → burning → results → re-upload → compare |
| `components/Landing.jsx` | Hero, upload box (drag & drop + validation), JD box, role picker |
| `components/Burning.jsx` | Funny "resume burning" loading screen |
| `components/Results.jsx` | Report dashboard: scores, top 3 fixes, breakdown and 6 tabs |
| `components/Compare.jsx` | Re-upload, before/after comparison and downloadable share card |
| `lib/mockReport.js` | Sample report. The real API will return this same shape. |
| `lib/file.js` | File checks (PDF/DOCX, 5 MB limit) and role list |
| `lib/template.js` | ATS-safe resume template download |

## Before you share it

- Replace the LinkedIn `#` link and the feedback email in `components/Footer.jsx`.
