import { useRef } from "react";

import Layout from "../components/Layout";
import SkillsForm from "../components/SkillsForm";
import SkillsList from "../components/SkillsList";

export default function Skills() {
  const skillsListRef = useRef(null);

  function handleSkillAdded() {
    skillsListRef.current?.refresh();
  }

  return (
    <Layout title="Skills Management">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-none">
        {/* PAGE HEADER */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
            Portfolio management
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Skills
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Add, edit and manage the technical skills shown on your portfolio.
          </p>
        </div>

        {/* ADD SKILL */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
          <SkillsForm onSkillAdded={handleSkillAdded} />
        </div>

        {/* EXISTING SKILLS */}
        <SkillsList ref={skillsListRef} />
      </div>
    </Layout>
  );
}