// ======================================================
// TECH / SKILL COLORS — SINGLE SOURCE OF TRUTH
// ======================================================
// Used by:
//   Admin:  ProjectsForm.jsx, ProjectsList.jsx, CertificatesForm.jsx
//   Public: TechBadge.jsx (Projects), CertificateCard.jsx (Certificates)
//
// To change a tech's color (e.g. Python yellow -> green), edit it
// ONCE here. Every form/list/card on both sides updates automatically.
//
// To add a new tech: add one line below. It will immediately be
// available everywhere (admin pickers + public badges).
// ======================================================

export const TECH_COLOR_MAP = {
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

  // EXTRA — buffer entries for common techs not yet used anywhere,
  // added so they already have a fixed (non-hash) color when needed
  angular: "border-red-500/40 text-red-400",
  "vue.js": "border-emerald-500/40 text-emerald-400",
  vue: "border-emerald-500/40 text-emerald-400",
  "next.js": "border-slate-300/40 text-slate-200",
  nextjs: "border-slate-300/40 text-slate-200",
  redux: "border-purple-500/40 text-purple-400",
  aws: "border-orange-500/40 text-orange-400",
  azure: "border-sky-500/40 text-sky-400",
  devops: "border-cyan-500/40 text-cyan-400",
  "data visualization": "border-pink-400/40 text-pink-300",
  statistics: "border-indigo-500/40 text-indigo-400",
};

// Deterministic fallback for any tech NOT in the map above (e.g. a
// custom-typed tech). Same name always gets the same fallback color.
const TECH_FALLBACK_PALETTE = [
  "border-blue-500/30 text-blue-400",
  "border-fuchsia-400/40 text-fuchsia-300",
  "border-teal-400/40 text-teal-300",
  "border-red-400/40 text-red-300",
  "border-indigo-400/40 text-indigo-300",
  "border-lime-400/40 text-lime-300",
];

/**
 * Get the badge classes for a technology/skill name.
 * Case-insensitive — "Python", "python", "PYTHON" all match the
 * same entry. Unknown names still get a color, hashed from the name.
 */
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

// Known technology names, for admin quick-pick chips (ProjectsForm).
export const KNOWN_TECHNOLOGIES = [
  "Python",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "Excel",
  "Power BI",
  "Tableau",
  "React",
  "React Native",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Node.js",
  "Firebase",
  "MongoDB",
  "Java",
  "C++",
  "Git",
  "GitHub",
  "NumPy",
  "Pandas",
  "Scikit-learn",
  "Django",
  "Flask",
  "Docker",
  "Figma",
  "Angular",
  "Vue.js",
  "Next.js",
  "Redux",
  "AWS",
];

// Known skill/tag names, for admin quick-pick chips (CertificatesForm).
export const KNOWN_SKILL_TAGS = [
  "Data Analytics",
  "Data Science",
  "Python",
  "SQL",
  "Power BI",
  "Excel",
  "Tableau",
  "Machine Learning",
  "Cloud Computing",
  "Web Development",
  "App Development",
  "Communication",
  "Leadership",
  "Other",
];