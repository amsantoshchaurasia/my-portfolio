// ======================================================
// CERTIFICATE DROPDOWN OPTIONS
// ======================================================
// Default options for the admin form pickers. Extra options you add
// from the form are saved in Firestore ("certOptions") and merged in.
//
// Colors live in src/utils/colors/:
//   Platform -> platformColors.js
//   Tech     -> techColors.js
//   Type     -> typeColors.js
// Keep names here identical to the names there.
// Domain has no color: it is only used for filtering.

export const DEFAULT_PLATFORMS = [
  "Forage",
  "Coursera",
  "Udemy",
  "Google",
  "Microsoft",
  "IBM",
  "Meta",
  "AWS",
  "LinkedIn Learning",
  "edX",
  "NPTEL",
  "Simplilearn",
  "Great Learning",
  "Infosys Springboard",
  "Kaggle",
  "DataCamp",
  "HackerRank",
  "Cisco",
  "QSpiders",
  "TCS iON",
  "MKCL",
  "freeCodeCamp",
  "upGrad",
  "Udacity",
];

export const DEFAULT_DOMAINS = [
  "Data Analytics",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Deep Learning",
  "Business Intelligence",
  "Data Engineering",
  "Web Development",
  "App Development",
  "Cloud Computing",
  "Cyber Security",
  "Database Management",
  "Software Engineering",
  "UI/UX Design",
  "Digital Marketing",
  "Business & Finance",
  "Project Management",
  "Soft Skills",
];

export const DEFAULT_TECH = [
  "Python",
  "SQL",
  "Excel",
  "Power BI",
  "Tableau",
  "R",
  "Java",
  "JavaScript",
  "React",
  "HTML/CSS",
  "Node.js",
  "Git",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "TensorFlow",
  "Statistics",
  "Research Methodology",
  "ETL",
  "MySQL",
  "MongoDB",
  "Firebase",
  "AWS",
  "Azure",
  "Google Cloud",
  "Figma",
];

export const DEFAULTS_BY_KIND = {
  platform: DEFAULT_PLATFORMS,
  domain: DEFAULT_DOMAINS,
  tech: DEFAULT_TECH,
};

export const MAX_DOMAINS = 2;

// The certificate card shows these as pills, so keep the count small.
export const MAX_TECH = 4;