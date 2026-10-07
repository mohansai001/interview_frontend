const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @typedef {Object} CandidateFormData
 * @property {string} candidateName
 * @property {string} candidateEmail
 * @property {string} role
 * @property {string} tsc
 * @property {string} panelname
 * @property {string} panelemail
 * @property {string} level
 * @property {string} jd
 */

/**
 * @param {CandidateFormData} values
 */
export function validateCandidateForm(values) {
  const errors = {};

  if (!values.candidateName.trim()) {
    errors.candidateName = "Candidate name is required.";
  }

  if (!values.candidateEmail.trim()) {
    errors.candidateEmail = "Candidate email is required.";
  } else if (!EMAIL_REGEX.test(values.candidateEmail.trim())) {
    errors.candidateEmail = "Enter a valid email address.";
  }

  if (!values.role.trim()) {
    errors.role = "Role is required.";
  }

  if (!values.tsc.trim()) {
    errors.tsc = "Please select a TSC.";
  }

  if (!values.level.trim()) {
    errors.level = "Level is required.";
  }

  if (!values.panelname.trim()) {
    errors.panelname = "Panel name is required.";
  }

  if (!values.panelemail.trim()) {
    errors.panelemail = "Panel email is required.";
  } else if (!EMAIL_REGEX.test(values.panelemail.trim())) {
    errors.panelemail = "Enter a valid panel email address.";
  }

  if (!values.jd.trim()) {
    errors.jd = "JD is required.";
  }

  return errors;
}

export function bytesToSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** index;
  const rounded = index === 0 ? value.toFixed(0) : value.toFixed(2);
  return `${rounded} ${units[index]}`;
}

/**
 * @param {File | null} file
 * @param {number} maxSizeBytes
 */
export function validateResumeFile(file, maxSizeBytes) {
  if (!file) return "Resume is required.";

  const isPdfMime = file.type === "application/pdf";
  const isPdfName = file.name.toLowerCase().endsWith(".pdf");

  if (!isPdfMime && !isPdfName) {
    return "Only PDF files are allowed.";
  }

  if (file.size > maxSizeBytes) {
    return `File size exceeds ${bytesToSize(maxSizeBytes)}.`;
  }

  return "";
}
