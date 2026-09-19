import { useEffect, useState } from "react";
import { getAboutStats } from "../../firebase/firestore";

/* =========================================================
   DYNAMIC EXPERIENCE CALCULATION
========================================================= */

// Santosh's professional journey start date.
// Month is 0-indexed in JS Date, so 2 = March.
const JOINING_DATE = new Date(2026, 2, 26);

function getExperienceLabel(startDate) {
  const now = new Date();

  let months =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());

  // If we haven't yet reached the same day-of-month as the
  // start date, the current month isn't fully complete.
  if (now.getDate() < startDate.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    months = 0;
  }

  /*
    Under 12 months: show exact month count.
    e.g. "1 Month", "6 Months", "11 Months"
  */
  if (months < 12) {
    return `${months} ${months === 1 ? "Month" : "Months"}`;
  }

  /*
    12+ months: shift to years in half-year steps.
    12-17 -> 1 Year
    18-23 -> 1.5 Years
    24-29 -> 2 Years
    ...and so on.
  */
  const years = Math.floor(months / 6) / 2;

  return `${years} ${years === 1 ? "Year" : "Years"}`;
}

export default function AboutStats() {
  const [stats, setStats] = useState({
    projects: "10+",
    certificates: "15+",
    cgpa: "8.70",
  });

  const [experience, setExperience] = useState(
    getExperienceLabel(JOINING_DATE)
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAboutStats();
        if (data) {
          setStats({
            projects: data.projects || "10+",
            certificates: data.certificates || "15+",
            cgpa: data.cgpa || "8.70",
          });
        }
      } catch (error) {
        console.error("Error loading About Stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Keep the experience counter fresh even if the tab stays
  // open across a day/month boundary (checks once per hour).
  useEffect(() => {
    const interval = setInterval(() => {
      setExperience(getExperienceLabel(JOINING_DATE));
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const statsList = [
    { number: stats.projects, title: "Projects" },
    { number: stats.certificates, title: "Certificates" },
    { number: stats.cgpa, title: "CGPA" },
    { number: experience, title: "Experience" },
  ];

  if (loading) {
    return (
      <div className="mt-10 text-center text-gray-400 text-sm">
        Loading stats...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-8 sm:mt-10 md:mt-12 lg:mt-14 xl:mt-6">
      {statsList.map((item) => (
        <div
          key={item.title}
          className="
            bg-slate-900/60
            backdrop-blur-sm
            rounded-2xl
            p-4 sm:p-5 md:p-6 xl:p-4
            border
            border-slate-800
            text-center
            transition
            duration-300
            hover:border-blue-500/60
            hover:-translate-y-1
            group
          "
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-4xl font-black text-blue-500 group-hover:scale-105 transition-transform duration-300">
            {item.number}
          </h2>
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider">
            {item.title}
          </p>
        </div>
      ))}
    </div>
  );
}