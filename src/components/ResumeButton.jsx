import React, { useState, useEffect } from "react";
import { getResumeURL } from "../firebase/storage";

export default function ResumeButton() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResume() {
      try {
        setLoading(true);
        const result = await getResumeURL();
        
        if (result) {
          const rawUrl = typeof result === "string" 
            ? result 
            : (result.fileUrl || result.secureUrl || result.url);
            
          setResumeData(rawUrl);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, []);

  const handleClick = (e) => {
    if (!resumeData) {
      e.preventDefault();
      if (!loading) {
        alert("Resume is currently not available.");
      }
    }
  };

  const getDownloadUrl = (url) => {
    if (!url) return "#";
    if (url.includes("cloudinary.com") && !url.includes("fl_attachment")) {
      return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
  };

  const isButtonDisabled = !resumeData || loading;

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* VIEW RESUME BUTTON (Opens PDF viewer in a new tab) */}
      <a
        href={resumeData || "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 ${
          isButtonDisabled
            ? "cursor-not-allowed opacity-50"
            : "hover:-translate-y-1"
        }`}
      >
        {loading ? "Loading..." : "View Resume"}
      </a>

      {/* DOWNLOAD RESUME BUTTON (Forces direct file download) */}
      <a
        href={getDownloadUrl(resumeData)}
        download="Santosh-Chaurasia-Resume.pdf"
        onClick={handleClick}
        className={`inline-flex items-center justify-center rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white ${
          isButtonDisabled
            ? "cursor-not-allowed opacity-50"
            : "hover:-translate-y-1"
        }`}
      >
        {loading ? "Loading..." : "Download Resume"}
      </a>
    </div>
  );
}