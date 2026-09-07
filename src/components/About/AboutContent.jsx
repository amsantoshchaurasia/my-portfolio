import { useEffect, useState } from "react";
import { getAboutData } from "../../firebase/firestore";
import profile from "../../assets/images/profile.png";

export default function AboutContent() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAbout() {
      try {
        const data = await getAboutData();
        if (data) {
          setAbout(data);
        }
      } catch (error) {
        console.error("Error loading About data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAbout();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Profile Image - Optimized with subtle glowing frame */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.15)] bg-slate-900">
          <img
            src={about?.imageUrl || profile}
            alt="Santosh Chaurasia"
            className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-7">
        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white tracking-tight">
          {about?.heading || "Hi, I'm Santosh Chaurasia"}
        </h3>

        <p className="text-gray-300 leading-relaxed text-sm sm:text-base font-normal">
          {about?.description ||
            "A dedicated IT professional and Data Science student with hands-on expertise in Python, SQL, Excel, and Power BI. Passionate about transforming complex data into clear insights and building modern web applications."}
        </p>

        {/* Additional Information Cards */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm transition hover:border-blue-500/50">
            <p className="text-xs uppercase tracking-wider text-blue-400 font-medium">
              Role
            </p>
            <p className="mt-1 text-white font-semibold text-sm sm:text-base">
              {about?.role || "Data Analyst"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm transition hover:border-blue-500/50">
            <p className="text-xs uppercase tracking-wider text-blue-400 font-medium">
              Location
            </p>
            <p className="mt-1 text-white font-semibold text-sm sm:text-base">
              {about?.location || "Mumbai, Maharashtra"}
            </p>
          </div>
        </div>

        {/* Short Bio */}
        {about?.shortBio && (
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide">
              {about.shortBio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}