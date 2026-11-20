export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ACCEPT = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/** Returns { ok, file?, error? } */
export function validateResumeFile(file) {
  if (!file) return { ok: false, error: 'No file found. Try dropping your resume again.' };
  const name = file.name || '';
  const ext = name.split('.').pop().toLowerCase();
  if (ext !== 'pdf' && ext !== 'docx') {
    return { ok: false, error: 'That file type isn’t supported. Please upload a PDF or DOCX.' };
  }
  if (file.size === 0) {
    return { ok: false, error: 'This file looks empty. Try uploading a text-based PDF or DOCX.' };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: 'That file is over 5 MB. Try exporting a lighter PDF and upload again.' };
  }
  return { ok: true, file };
}

export function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const ROLES = [
  { id: 'pm', label: 'Product Management' },
  { id: 'sde', label: 'Software Development (SDE)' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'marketing', label: 'Marketing' },
];

export function roleLabel(id) {
  return ROLES.find((r) => r.id === id)?.label ?? 'Product Management';
}
