// Category (type) values match the admin panel exactly, so a
// certificate's type looks identical on both sides.
export const CERTIFICATE_CATEGORIES = [
  { value: "web", label: "Web Development" },
  { value: "app", label: "App Development" },
  { value: "analytics", label: "Data Analyst" },
  { value: "other", label: "Other" },
];

const KNOWN_CATEGORIES = ["web", "app", "analytics"];

export function getCertificateCategoryLabel(category) {
  switch (category) {
    case "web":
      return "Web Development";
    case "app":
      return "App Development";
    case "analytics":
      return "Data Analyst";
    default:
      return "Other";
  }
}

export function getCertificateCategoryBadgeClasses(category) {
  switch (category) {
    case "app":
      return "bg-emerald-600/10 border-emerald-500/30 text-emerald-400";
    case "analytics":
      return "bg-purple-600/10 border-purple-500/30 text-purple-400";
    case "web":
    default:
      return "bg-blue-600/10 border-blue-500/30 text-blue-400";
  }
}

export function matchesCertificateCategory(certificate, filterValue) {
  if (filterValue === "all") return true;
  if (filterValue === "other") return !KNOWN_CATEGORIES.includes(certificate.category);
  return certificate.category === filterValue;
}

// ======================================================
// PLATFORM (company/issuer) COLORS — deterministic hash so
// "Forage" is always the same color. Different palette than
// tech tags so the two badge types never look identical.
// ======================================================

const PLATFORM_COLOR_MAP = {
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
};

const PLATFORM_FALLBACK_PALETTE = [
  "border-violet-400/40 text-violet-300",
  "border-pink-400/40 text-pink-300",
  "border-amber-400/40 text-amber-300",
  "border-emerald-400/40 text-emerald-300",
  "border-sky-400/40 text-sky-300",
  "border-rose-400/40 text-rose-300",
];

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

// ======================================================
// TECH / SKILL TAG COLORS — exact same map as the Projects
// side's TechBadge, so "Python" / "SQL" etc. are always the
// same color everywhere on the site.
// ======================================================

const TECH_COLOR_MAP = {
  python: "border-yellow-400/40 text-yellow-300",
  sql: "border-orange-400/40 text-orange-300",
  mysql: "border-orange-400/40 text-orange-300",
  postgresql: "border-sky-400/40 text-sky-300",
  excel: "border-green-400/40 text-green-300",
  "power bi": "border-amber-400/40 text-amber-300",
  powerbi: "border-amber-400/40 text-amber-300",
  tableau: "border-rose-400/40 text-rose-300",
  react: "border-cyan-400/40 text-cyan-300",
  "react native": "border-cyan-400/40 text-cyan-300",
  javascript: "border-yellow-300/40 text-yellow-200",
  typescript: "border-blue-400/40 text-blue-300",
  html: "border-orange-500/40 text-orange-400",
  css: "border-blue-500/40 text-blue-400",
  "tailwind css": "border-teal-400/40 text-teal-300",
  tailwind: "border-teal-400/40 text-teal-300",
  "node.js": "border-lime-400/40 text-lime-300",
  nodejs: "border-lime-400/40 text-lime-300",
  firebase: "border-amber-500/40 text-amber-400",
  mongodb: "border-emerald-400/40 text-emerald-300",
  java: "border-red-400/40 text-red-300",
  "c++": "border-indigo-400/40 text-indigo-300",
  git: "border-orange-400/40 text-orange-300",
  github: "border-gray-300/40 text-gray-200",
  numpy: "border-sky-400/40 text-sky-300",
  pandas: "border-purple-400/40 text-purple-300",
  "scikit-learn": "border-orange-400/40 text-orange-300",
  django: "border-emerald-500/40 text-emerald-400",
  flask: "border-gray-300/40 text-gray-200",
  docker: "border-sky-400/40 text-sky-300",
  figma: "border-pink-400/40 text-pink-300",
  "data analytics": "border-purple-400/40 text-purple-300",
  "data science": "border-fuchsia-400/40 text-fuchsia-300",
  "machine learning": "border-red-400/40 text-red-300",
  "cloud computing": "border-sky-400/40 text-sky-300",
  "web development": "border-blue-400/40 text-blue-300",
  "app development": "border-emerald-400/40 text-emerald-300",
  communication: "border-teal-400/40 text-teal-300",
  leadership: "border-amber-400/40 text-amber-300",
};

const TECH_FALLBACK_PALETTE = [
  "border-blue-500/30 text-blue-400",
  "border-fuchsia-400/40 text-fuchsia-300",
  "border-teal-400/40 text-teal-300",
  "border-red-400/40 text-red-300",
  "border-indigo-400/40 text-indigo-300",
  "border-lime-400/40 text-lime-300",
];

export function getTechColor(name) {
  const key = (name || "").trim().toLowerCase();

  if (TECH_COLOR_MAP[key]) {
    return TECH_COLOR_MAP[key];
  }

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  return TECH_FALLBACK_PALETTE[hash % TECH_FALLBACK_PALETTE.length];
}