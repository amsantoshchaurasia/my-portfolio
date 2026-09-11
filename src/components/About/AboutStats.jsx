import { useEffect, useState } from "react";
import { getAboutStats } from "../../firebase/firestore";

export default function AboutStats() {
  const [stats, setStats] = useState({
    projects: "10+",
    certificates: "15+",
    cgpa: "8.70",
    experience: "1+",
  });

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
            experience: data.experience || "1+",
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

  const statsList = [
    { number: stats.projects, title: "Projects" },
    { number: stats.certificates, title: "Certificates" },
    { number: stats.cgpa, title: "CGPA" },
    { number: stats.experience, title: "Experience" },
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