/**
 * SAMPLE report used by the prototype.
 * The real backend will return an object with exactly this shape from POST /api/analyse,
 * so swapping mock → real only means replacing buildMockReport() with a fetch call.
 */

const KEYWORDS = {
  pm: {
    found: ['Product Strategy', 'Agile', 'Figma', 'User Research', 'Stakeholder Management', 'Wireframing'],
    missing: ['Roadmap Prioritisation', 'SQL', 'A/B Testing', 'Product Analytics', 'PRD', 'Go-to-Market'],
  },
  sde: {
    found: ['JavaScript', 'React', 'Git', 'REST APIs', 'Data Structures'],
    missing: ['System Design', 'Unit Testing', 'CI/CD', 'TypeScript', 'Docker', 'SQL'],
  },
  consulting: {
    found: ['Stakeholder Management', 'Excel', 'Market Research', 'Presentations'],
    missing: ['Problem Structuring', 'Financial Modelling', 'Hypothesis-driven Analysis', 'PowerPoint Storylining', 'Client Management'],
  },
  marketing: {
    found: ['Social Media', 'Influencer Outreach', 'Content Strategy', 'Brand Marketing'],
    missing: ['Performance Marketing', 'Google Analytics', 'SEO', 'Campaign ROI', 'A/B Testing', 'CRM'],
  },
};

const ADD_THESE = {
  pm: [
    { text: 'Prioritised a backlog of [X] features using RICE scoring with engineering and design, shipping the top [X] in [X weeks] and lifting activation by [X%].', covers: 'Roadmap Prioritisation' },
    { text: 'Wrote SQL queries on [X users] of event data to find a [X%] drop-off in onboarding, which led to a redesign that cut drop-off by [X%].', covers: 'SQL, Product Analytics' },
    { text: 'Ran [X] A/B tests on the checkout flow, increasing conversion by [X%] and adding [X revenue] per month.', covers: 'A/B Testing' },
  ],
  sde: [
    { text: 'Designed a caching layer for an API serving [X users], cutting p95 latency from [X ms] to [X ms].', covers: 'System Design' },
    { text: 'Added unit tests that raised coverage from [X%] to [X%] and reduced production bugs by [X%] over [X months].', covers: 'Unit Testing' },
    { text: 'Set up a CI/CD pipeline with automated tests, reducing deployment time from [X hours] to [X minutes].', covers: 'CI/CD' },
  ],
  consulting: [
    { text: 'Structured a [X]-branch issue tree to diagnose a [X%] margin decline, presenting 3 recommendations to the client leadership.', covers: 'Problem Structuring' },
    { text: 'Built a 5-year financial model in Excel to size a [X revenue] market entry opportunity across [X] scenarios.', covers: 'Financial Modelling' },
    { text: 'Synthesised [X] stakeholder interviews into a 15-slide storyline that secured client sign-off within [X days].', covers: 'PowerPoint Storylining' },
  ],
  marketing: [
    { text: 'Launched a performance campaign with a budget of [X revenue], achieving a [X%] lower cost per acquisition than the previous quarter.', covers: 'Performance Marketing' },
    { text: 'Improved organic traffic by [X%] in [X months] by rewriting [X] product pages for SEO.', covers: 'SEO' },
    { text: 'Tracked campaign ROI in Google Analytics across [X] channels and shifted [X%] of spend to the top performer.', covers: 'Google Analytics, Campaign ROI' },
  ],
};

export function buildMockReport({ role = 'pm', hasJd = false, fileName = 'resume.pdf' } = {}) {
  const kw = KEYWORDS[role] ?? KEYWORDS.pm;

  return {
    isSample: true,
    fileName,
    role,
    scores: {
      ats: 62,
      jdMatch: hasJd ? 74 : null,
      readiness: 68,
    },
    breakdown: [
      { label: 'Formatting', score: 70 },
      { label: 'Resume Sections', score: 85 },
      { label: 'Keywords', score: hasJd ? 58 : 52 },
      { label: 'Achievement Impact', score: 45 },
      { label: 'Grammar & Language', score: 72 },
      { label: 'Resume Length', score: 90 },
    ],
    fixes: [
      {
        id: 'impact',
        priority: 'High',
        category: 'Bullet quality',
        title: 'Your experience bullets lack measurable impact',
        why: '7 of 11 bullets have no number or result. Recruiters skim for outcomes, and “lack of quantifiable results” is one of their top deal-breakers.',
        how: 'Add a number to each bullet: users, %, time saved, revenue or team size. See the STAR Rewrites tab for ready-made versions.',
      },
      {
        id: 'keywords',
        priority: 'High',
        category: 'JD match',
        title: 'Important keywords from the role are missing',
        why: `${kw.missing.length} skills that ${hasJd ? 'your JD' : 'this role'} usually asks for don’t appear anywhere in your resume, so ATS keyword searches may skip you.`,
        how: 'Add the missing skills you genuinely have to your Skills section and work 2–3 of them into experience bullets.',
      },
      {
        id: 'skills',
        priority: 'Medium',
        category: 'Structure',
        title: 'Your skills section needs better organisation',
        why: 'Tools, soft skills and languages are mixed in one long line, which is hard to scan in 6 seconds.',
        how: 'Split skills into 2–3 labelled rows, e.g. “Product: …”, “Tools: …”, “Design: …”.',
      },
      {
        id: 'weak-verbs',
        priority: 'Medium',
        category: 'Bullet quality',
        title: '3 bullets start with weak phrases',
        why: '“Responsible for”, “Helped” and “Worked on” describe duties, not achievements, and make your contribution sound passive.',
        how: 'Start with a strong action verb: Led, Built, Launched, Reduced, Increased, Designed.',
      },
      {
        id: 'buzzwords',
        priority: 'Medium',
        category: 'Language',
        title: 'Clichés in your summary',
        why: '“Hardworking team player” and “passionate” appear on most resumes and tell the recruiter nothing specific.',
        how: 'Replace them with one concrete strength backed by proof, e.g. “Designed and shipped 2 internal tools used by 40+ staff.”',
      },
      {
        id: 'dates',
        priority: 'Medium',
        category: 'Structure',
        title: 'One role is missing exact dates',
        why: 'Employers flag resumes without employment dates, and ATS parsers can mis-order roles without them.',
        how: 'Use the same Month YYYY – Month YYYY format for every role.',
      },
      {
        id: 'icons',
        priority: 'Low',
        category: 'ATS formatting',
        title: 'Icons next to your contact details',
        why: 'Some ATS software can’t read icons, so your phone or email could be dropped.',
        how: 'Use plain text labels: “Email: …  |  Phone: …  |  LinkedIn: …”.',
      },
      {
        id: 'pronouns',
        priority: 'Low',
        category: 'Language',
        title: 'Personal pronouns in 2 bullets',
        why: 'Resume bullets read best without “I” or “my”, which waste space.',
        how: 'Drop the pronoun and start with the verb: “I designed…” → “Designed…”.',
      },
    ],
    grammar: [
      { wrong: 'Managment', right: 'Management', context: 'Skills: Stakeholder Managment, Agile' },
      { wrong: 'recieved', right: 'received', context: '…and recieved the Best Intern award' },
      { wrong: 'lead a team', right: 'led a team', context: 'Lead a team of 4 interns (past tense needed)' },
      { wrong: 'Worked on designing', right: 'Designed', context: 'Worked on designing the onboarding flow' },
      { wrong: 'its', right: 'it’s / its', context: 'Check “its” vs “it’s” in your summary' },
    ],
    keywords: kw,
    starRewrites: [
      {
        original: 'Worked with the product team to improve the application.',
        improved: 'Collaborated with a cross-functional team of 5 to redesign the onboarding flow, cutting drop-off by [X%] in [X weeks].',
      },
      {
        original: 'Responsible for influencer outreach.',
        improved: 'Reached out to [X] micro and macro influencers, securing [X] collaborations that generated [X] new followers in [X months].',
      },
      {
        original: 'Helped in usability testing of the app.',
        improved: 'Ran usability tests with [X users], identified 6 friction points and drove fixes that raised task success from [X%] to [X%].',
      },
      {
        original: 'Made dashboards for the sales team.',
        improved: 'Built 3 sales dashboards in [tool] used daily by [X] reps, reducing weekly reporting time by [X hours].',
      },
    ],
    addThese: ADD_THESE[role] ?? ADD_THESE.pm,
    atsChecks: [
      { label: 'Single-column layout', pass: true, note: 'Your content reads top to bottom, which every ATS handles well.' },
      { label: 'No tables', pass: false, note: 'Your skills sit in a table. Some systems read table cells out of order, so list them as plain text instead.' },
      { label: 'No images or graphics', pass: true, note: 'No photos, logos or charts found.' },
      { label: 'Standard fonts', pass: true, note: 'Common fonts like Calibri or Arial render reliably.' },
      { label: 'Contact information', pass: false, note: 'Your contact line uses icons. Swap them for plain text so the ATS reads your email and phone.' },
      { label: 'Standard section headers', pass: true, note: 'Headings like “Experience” and “Education” are easy for ATS to recognise.' },
      { label: 'Text readability', pass: true, note: 'The file is text-based, not a scanned image.' },
      { label: 'Consistent formatting', pass: false, note: 'Date formats change between roles. Pick one format and use it everywhere.' },
    ],
    after: {
      ats: 80,
      breakdown: [
        { label: 'Formatting', before: 70, after: 88 },
        { label: 'Keywords', before: 52, after: 76 },
        { label: 'Achievement Impact', before: 45, after: 72 },
        { label: 'Structure', before: 85, after: 92 },
      ],
    },
  };
}
