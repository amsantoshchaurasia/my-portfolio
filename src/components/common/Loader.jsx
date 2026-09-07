import { useEffect, useState } from "react";

export default function Loader({ children }) {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Timer to start fade-out animation slightly before removing from DOM
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for transition duration (500ms) before removing loader completely
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className={`
          fixed
          inset-0
          z-[9999]
          bg-[#0B1120]
          flex
          flex-col
          items-center
          justify-center
          overflow-hidden
          transition-opacity
          duration-500
          ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        {/* Glow */}
        <div className="absolute w-80 h-80 rounded-full bg-blue-600/25 blur-[120px]" />

        {/* Logo */}
        <h1 className="text-5xl md:text-6xl font-black tracking-wide">
          <span className="text-white">Santosh</span>{" "}
          <span className="text-blue-500">Chaurasia</span>
        </h1>

        <p className="mt-4 text-gray-400 tracking-[6px] uppercase text-sm font-medium">
          Data Analyst
        </p>

        {/* Loader Dots */}
        <div className="mt-12 flex gap-3">
          <span className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"></span>
          <span
            className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: ".2s" }}
          ></span>
          <span
            className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: ".4s" }}
          ></span>
        </div>
      </div>
    );
  }

  return children;
}