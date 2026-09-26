import { useState } from "react";

import Layout from "../components/Layout";
import ExperienceForm from "../components/ExperienceForm";
import ExperienceList from "../components/ExperienceList";

export default function Experience() {
  // ========================================
  // STATE
  // ========================================

  const [refresh, setRefresh] = useState(0);
  const [editingExperience, setEditingExperience] = useState(null);

  function handleExperienceAdded() {
    setRefresh((prev) => prev + 1);
  }

  function handleEditExperience(experience) {
    setEditingExperience(experience);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingExperience(null);
  }

  // ========================================
  // UI
  // ========================================

  return (
    <Layout title="Experience Management">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-none">
        {/* PAGE HEADER */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
            Portfolio management
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Experience
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Add, edit or remove the professional experience shown on your portfolio.
          </p>
        </div>

        {/* ADD / EDIT EXPERIENCE FORM */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
          <ExperienceForm
            onExperienceAdded={handleExperienceAdded}
            editingExperience={editingExperience}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* EXISTING EXPERIENCE */}
        <ExperienceList
          refresh={refresh}
          onEditExperience={handleEditExperience}
        />
      </div>
    </Layout>
  );
}