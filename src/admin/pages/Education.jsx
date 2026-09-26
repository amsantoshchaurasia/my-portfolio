import { useState } from "react";

import Layout from "../components/Layout";
import EducationForm from "../components/EducationForm";
import EducationList from "../components/EducationList";

export default function Education() {
  // ========================================
  // STATE
  // ========================================

  const [refresh, setRefresh] = useState(0);
  const [editingEducation, setEditingEducation] = useState(null);

  function handleEducationAdded() {
    setRefresh((prev) => prev + 1);
  }

  function handleEditEducation(education) {
    setEditingEducation(education);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingEducation(null);
  }

  // ========================================
  // UI
  // ========================================

  return (
    <Layout title="Education Management">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-none">
        {/* PAGE HEADER */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
            Portfolio management
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Education
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Add, edit or remove the academic qualifications shown on your portfolio.
          </p>
        </div>

        {/* ADD / EDIT EDUCATION FORM */}
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4 sm:p-5">
          <EducationForm
            onEducationAdded={handleEducationAdded}
            editingEducation={editingEducation}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* EXISTING EDUCATION */}
        <EducationList
          refresh={refresh}
          onEditEducation={handleEditEducation}
        />
      </div>
    </Layout>
  );
}