// ======================================================
// PLATFORM / ISSUER COLORS — SINGLE SOURCE OF TRUTH
// ======================================================
// Used by:
//   Admin:  CertificatesForm.jsx
//   Public: CertificateCard.jsx
//
// To change a platform's color, or add a new one, edit the list
// below ONCE. Write names the way you want them displayed.
//
// Lookup ignores case, spaces, dots and dashes, so "QSpiders" and
// "qspiders" share one entry. The platform names shown in the admin
// form live in certificateOptions.js (DEFAULT_PLATFORMS) and should
// match the names here.
// ======================================================

const PLATFORM_COLORS = {
  Forage: "border-violet-400/40 text-violet-300",
  Coursera: "border-blue-400/40 text-blue-300",
  Udemy: "border-fuchsia-400/40 text-fuchsia-300",
  Google: "border-red-400/40 text-red-300",
  Microsoft: "border-sky-400/40 text-sky-300",
  IBM: "border-indigo-400/40 text-indigo-300",
  Meta: "border-blue-500/40 text-blue-400",
  AWS: "border-orange-500/40 text-orange-400",
  "LinkedIn Learning": "border-cyan-400/40 text-cyan-300",
  edX: "border-slate-300/40 text-slate-200",
  NPTEL: "border-yellow-400/40 text-yellow-300",
  Simplilearn: "border-orange-400/40 text-orange-300",
  "Great Learning": "border-yellow-500/40 text-yellow-400",
  "Infosys Springboard": "border-sky-500/40 text-sky-400",
  Kaggle: "border-cyan-500/40 text-cyan-400",
  DataCamp: "border-green-400/40 text-green-300",
  HackerRank: "border-lime-400/40 text-lime-300",
  Cisco: "border-teal-500/40 text-teal-400",
  QSpiders: "border-emerald-400/40 text-emerald-300",
  "TCS iON": "border-blue-400/40 text-blue-300",
  MKCL: "border-rose-400/40 text-rose-300",
  freeCodeCamp: "border-teal-400/40 text-teal-300",
  upGrad: "border-red-500/40 text-red-400",
  Udacity: "border-cyan-500/40 text-cyan-400",
};

// "Great Learning" -> "greatlearning", "TCS iON" -> "tcsion"
const compact = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/[\s._\-/]+/g, "");

export const PLATFORM_COLOR_MAP = {
  ...Object.fromEntries(
    Object.entries(PLATFORM_COLORS).map(([name, classes]) => [
      compact(name),
      classes,
    ])
  ),
  // Old spelling that may already be saved on existing certificates
  qspider: PLATFORM_COLORS.QSpiders,
};

// Deterministic fallback for any platform NOT listed above.
const PLATFORM_FALLBACK_PALETTE = [
  "border-violet-400/40 text-violet-300",
  "border-pink-400/40 text-pink-300",
  "border-amber-400/40 text-amber-300",
  "border-emerald-400/40 text-emerald-300",
  "border-sky-400/40 text-sky-300",
  "border-rose-400/40 text-rose-300",
];

/**
 * Badge classes for a platform / issuer name.
 * Unknown names still get a stable color, hashed from the name.
 */
export function getPlatformColor(name) {
  const key = compact(name);

  if (PLATFORM_COLOR_MAP[key]) return PLATFORM_COLOR_MAP[key];

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  return PLATFORM_FALLBACK_PALETTE[hash % PLATFORM_FALLBACK_PALETTE.length];
}