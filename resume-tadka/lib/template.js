/**
 * Downloads a single-column, ATS-safe resume template as a .doc file
 * (Word, Google Docs and LibreOffice all open it).
 */
export function downloadAtsTemplate() {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>ATS Resume Template</title>
<style>
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.35;color:#000;margin:0.7in}
h1{font-size:20pt;margin:0 0 4pt}
h2{font-size:12pt;text-transform:uppercase;border-bottom:1px solid #000;margin:14pt 0 6pt;padding-bottom:2pt}
p{margin:0 0 4pt} ul{margin:2pt 0 8pt 18pt;padding:0} li{margin:0 0 3pt}
.role{font-weight:bold}
</style></head><body>
<h1>YOUR NAME</h1>
<p>City, State | Phone: +91 XXXXX XXXXX | Email: name@email.com | LinkedIn: linkedin.com/in/yourname</p>

<h2>Summary</h2>
<p>[Target role] with [X years] of experience in [2–3 core skills]. Known for [one specific, proven strength with a number].</p>

<h2>Experience</h2>
<p class="role">Job Title — Company Name, City</p>
<p>Month YYYY – Month YYYY</p>
<ul>
<li>Action verb + what you did + result with a number (e.g. Increased X by [X%] in [X months]).</li>
<li>Action verb + what you did + result with a number.</li>
<li>Action verb + what you did + result with a number.</li>
</ul>
<p class="role">Job Title — Company Name, City</p>
<p>Month YYYY – Month YYYY</p>
<ul>
<li>Action verb + what you did + result with a number.</li>
<li>Action verb + what you did + result with a number.</li>
</ul>

<h2>Projects</h2>
<p class="role">Project Name — Tools used</p>
<ul><li>What problem it solved, what you built, and the result.</li></ul>

<h2>Education</h2>
<p class="role">Degree, Major — College Name, City</p>
<p>Month YYYY – Month YYYY | CGPA / %: X</p>

<h2>Skills</h2>
<p>Product: skill, skill, skill</p>
<p>Tools: tool, tool, tool</p>
<p>Languages: language, language</p>

<h2>Certifications &amp; Achievements</h2>
<ul><li>Certification or award — Issuer, Year</li></ul>
</body></html>`;

  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Resume-Tadka-ATS-Template.doc';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
