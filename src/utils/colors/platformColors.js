// ======================================================
// PLATFORM / COMPANY / ISSUER COLORS — SINGLE SOURCE OF TRUTH
// ======================================================
// Used by:
//   Admin:  CertificatesForm.jsx
//   Public: CertificateCard.jsx
//
// To change a platform's color, or add a new one (like Qspider),
// edit it ONCE here.
// ======================================================

export const PLATFORM_COLOR_MAP = {
  forage: "border-violet-400/40 text-violet-300",
  coursera: "border-blue-400/40 text-blue-300",
  udemy: "border-fuchsia-400/40 text-fuchsia-300",
  google: "border-red-400/40 text-red-300",
  microsoft: "border-sky-400/40 text-sky-300",
  ibm: "border-indigo-400/40 text-indigo-300",
  "linkedin learning": "border-cyan-400/40 text-cyan-300",
  simplilearn: "border-orange-400/40 text-orange-300",
  hackerrank: "border-lime-400/40 text-lime-300",
  freecodecamp: "border-teal-400/40 text-teal-300",

  // NEW — added for the Data Analyst + Web Development certificates
  qspider: "border-emerald-400/40 text-emerald-300",

  // EXTRA — buffer entries for common platforms not yet used anywhere
  edx: "border-slate-300/40 text-slate-200",
  udacity: "border-cyan-500/40 text-cyan-400",
  upgrad: "border-red-500/40 text-red-400",
  "great learning": "border-yellow-500/40 text-yellow-400",
};

// Deterministic fallback for any platform NOT in the map above.
const PLATFORM_FALLBACK_PALETTE = [
  "border-violet-400/40 text-violet-300",
  "border-pink-400/40 text-pink-300",
  "border-amber-400/40 text-amber-300",
  "border-emerald-400/40 text-emerald-300",
  "border-sky-400/40 text-sky-300",
  "border-rose-400/40 text-rose-300",
];

/**
 * Get the badge classes for a platform/company/issuer name.
 * Case-insensitive. Unknown names still get a color, hashed from the name.
 */
export function getPlatformColor(name) {
  const key = (name || "").trim().toLowerCase();

  if (PLATFORM_COLOR_MAP[key]) {
    return PLATFORM_COLOR_MAP[key];
  }

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  return PLATFORM_FALLBACK_PALETTE[hash % PLATFORM_FALLBACK_PALETTE.length];
}

// Known platforms, for the admin quick-pick chips (CertificatesForm).
export const COMPANY_SUGGESTIONS = [
  "Forage",
  "Coursera",
  "Udemy",
  "Google",
  "Microsoft",
  "IBM",
  "LinkedIn Learning",
  "Simplilearn",
  "HackerRank",
  "freeCodeCamp",

  // NEW
  "Qspider",
  "edX",
  "Udacity",
  "upGrad",
  "Great Learning",
];