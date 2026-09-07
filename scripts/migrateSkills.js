import { readFileSync } from "fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ========================================
// FIREBASE ADMIN INITIALIZATION
// ========================================

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ========================================
// SKILLS DATA
// ========================================

const skills = [
  {
    id: 1,
    name: "Python",
    icon: "SiPython",
    color: "text-yellow-400",
    category: "analytics",
  },
  {
    id: 2,
    name: "SQL",
    icon: "SiMysql",
    color: "text-blue-500",
    category: "analytics",
  },
  {
    id: 3,
    name: "Excel",
    icon: "FaMicrosoft",
    color: "text-green-500",
    category: "analytics",
  },
  {
    id: 4,
    name: "Power BI",
    icon: "FaChartBar",
    color: "text-yellow-500",
    category: "analytics",
  },
  {
    id: 5,
    name: "Pandas",
    icon: "SiPandas",
    color: "text-cyan-400",
    category: "analytics",
  },
  {
    id: 6,
    name: "NumPy",
    icon: "SiNumpy",
    color: "text-blue-400",
    category: "analytics",
  },
  {
    id: 7,
    name: "Scikit-Learn",
    icon: "SiScikitlearn",
    color: "text-orange-400",
    category: "analytics",
  },
  {
    id: 8,
    name: "React",
    icon: "SiReact",
    color: "text-cyan-400",
    category: "web",
  },
  {
    id: 9,
    name: "JavaScript",
    icon: "SiJavascript",
    color: "text-yellow-300",
    category: "web",
  },
  {
    id: 10,
    name: "HTML",
    icon: "SiHtml5",
    color: "text-orange-500",
    category: "web",
  },
  {
    id: 11,
    name: "CSS",
    icon: "FaCss3Alt",
    color: "text-blue-400",
    category: "web",
  },
  {
    id: 12,
    name: "Git",
    icon: "SiGit",
    color: "text-orange-500",
    category: "tools",
  },
  {
    id: 13,
    name: "GitHub",
    icon: "SiGithub",
    color: "text-white",
    category: "tools",
  },
  {
    id: 14,
    name: "Firebase",
    icon: "SiFirebase",
    color: "text-yellow-500",
    category: "tools",
  },
];

// ========================================
// MIGRATION
// ========================================

async function migrateSkills() {
  try {
    console.log("Starting Skills migration...");

    for (const skill of skills) {
      await db
        .collection("portfolio")
        .doc("skills")
        .collection("items")
        .doc(`skill${skill.id}`)
        .set({
          name: skill.name,
          icon: skill.icon,
          color: skill.color,
          category: skill.category,
          order: skill.id,
        });

      console.log(`Uploaded: ${skill.name}`);
    }

    console.log("================================");
    console.log("Skills migration completed!");
    console.log("14 skills uploaded successfully.");
    console.log("================================");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateSkills();