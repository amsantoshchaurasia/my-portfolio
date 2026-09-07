import { useRef } from "react";

import Layout from "../components/Layout";
import SkillsForm from "../components/SkillsForm";
import SkillsList from "../components/SkillsList";

export default function Skills() {
  const skillsListRef = useRef(null);

  // ==================================================
  // REFRESH SKILLS LIST AFTER ADDING A SKILL
  // ==================================================

  function handleSkillAdded() {
    skillsListRef.current?.refresh();
  }

  return (
    <Layout title="Skills Management">
      <div className="max-w-6xl">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
            Portfolio Management
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            Skills Management
          </h2>

          <p className="mt-3 text-gray-400">
            Add, edit and manage the technical skills displayed on
            your portfolio.
          </p>
        </div>

        {/* ==================================================
            ADD SKILL
        ================================================== */}

        <div
          className="
            rounded-3xl
            border
            border-slate-700
            bg-[#111827]
            p-8
            shadow-xl
          "
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Add New Skill
          </h3>

          <SkillsForm
            onSkillAdded={handleSkillAdded}
          />
        </div>

        {/* ==================================================
            EXISTING SKILLS
        ================================================== */}

        <div className="mt-8">
          <SkillsList
            ref={skillsListRef}
          />
        </div>

      </div>
    </Layout>
  );
}