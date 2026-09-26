// Same technology color map as the admin panel (ProjectsList.jsx),
// so a tech tag always shows the same color on both sides —
// e.g. "Python" is always yellow, "SQL" is always orange.

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
};

// Consistent fallback palette for any technology not listed above —
// deterministic so the same unlisted tech always lands on the same color.
const TECH_FALLBACK_PALETTE = [
  "border-blue-500/30 text-blue-400",
  "border-fuchsia-400/40 text-fuchsia-300",
  "border-teal-400/40 text-teal-300",
  "border-red-400/40 text-red-300",
  "border-indigo-400/40 text-indigo-300",
  "border-lime-400/40 text-lime-300",
];

function getTechColor(name) {
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

export default function TechBadge({ name }) {
  return (

    <span
      className={`
      px-2.5
      py-1
      sm:px-4
      sm:py-2

      rounded-full

      text-xs
      sm:text-sm
      font-medium

      bg-slate-800/60

      border

      ${getTechColor(name)}
      `}
    >
      {name}
    </span>

  );
}